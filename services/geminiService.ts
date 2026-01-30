
import { GoogleGenAI, Type } from "@google/genai";
import heic2any from "heic2any";
import { FIXED_CAMERA_SETTINGS, POSES, BUILT_IN_MODELS, BUILT_IN_BACKGROUNDS } from "../constants";
import { AppState, ShotType } from "../types";

/**
 * Helper to normalize uploaded files for UI Preview.
 * Attempts to convert HEIC to JPEG for browser display.
 * If conversion fails, returns original file (allowing API to handle it).
 */
export const normalizeFile = async (file: File): Promise<File> => {
  const fileName = file.name.toLowerCase();
  const isHeic =
    file.type === 'image/heic' ||
    file.type === 'image/heif' ||
    fileName.endsWith('.heic') ||
    fileName.endsWith('.heif');

  if (isHeic) {
    try {
      console.log(`Detected HEIC file: ${file.name}. Attempting UI conversion...`);

      // Convert to ArrayBuffer to ensure clean read
      const arrayBuffer = await file.arrayBuffer();
      // Force correct MIME type for heic2any
      const blobWithType = new Blob([arrayBuffer], { type: 'image/heic' });

      // Call heic2any
      // Note: heic2any might fetch WASM. If offline or blocked, this throws.
      const convertedBlob = await heic2any({
        blob: blobWithType,
        toType: 'image/jpeg',
        quality: 0.85
      });

      const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
      const newFileName = file.name.replace(/\.(heic|heif)$/i, ".jpg");

      console.log("HEIC conversion successful for UI preview.");
      return new File([blob], newFileName, { type: "image/jpeg" });
    } catch (error: any) {
      console.warn("HEIC UI conversion failed. Using original file for API.", error);
      // IMPORTANT: We return the original file. 
      // The UI <img src> might fail on Chrome/Windows, but the API will succeed.
      return file;
    }
  }

  return file;
};

/**
 * Helper to process image for Gemini API.
 * Strategy:
 * 1. Try to load image into HTMLImageElement (Canvas).
 * 2. If Success: Resize/Compress to JPEG (Standardize).
 * 3. If Error (e.g. Chrome loading HEIC): Read raw bytes and send as-is (Gemini supports HEIC).
 */
const processImageForGemini = async (source: File | string): Promise<{ mimeType: string, data: string }> => {
  return new Promise(async (resolve, reject) => {
    try {
      let src = '';
      let originalFile: File | null = null;

      if (source instanceof File) {
        src = URL.createObjectURL(source);
        originalFile = source;
      } else {
        const response = await fetch(source);
        const blob = await response.blob();
        src = URL.createObjectURL(blob);
        originalFile = new File([blob], "downloaded.jpg", { type: blob.type || 'image/jpeg' });
      }

      const img = new Image();

      // OPTION A: Browser supports format (JPG, PNG, WebP, or Safari HEIC)
      img.onload = () => {
        URL.revokeObjectURL(src);
        const canvas = document.createElement('canvas');
        const MAX_DIM = 1536;
        let width = img.width;
        let height = img.height;

        if (width > MAX_DIM || height > MAX_DIM) {
          if (width > height) {
            height = Math.round((height * MAX_DIM) / width);
            width = MAX_DIM;
          } else {
            width = Math.round((width * MAX_DIM) / height);
            height = MAX_DIM;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw if canvas fails
          if (originalFile) {
            readRawFile(originalFile).then(resolve).catch(reject);
          } else {
            reject(new Error("Canvas context unavailable"));
          }
          return;
        }
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        const base64 = dataUrl.split(',')[1];
        resolve({ mimeType: 'image/jpeg', data: base64 });
      };

      // OPTION B: Browser DOES NOT support format (e.g. Chrome loading HEIC)
      // Gemini API supports HEIC, so we just send the raw base64.
      img.onerror = () => {
        URL.revokeObjectURL(src);
        console.log("Browser render failed (likely HEIC on non-Apple device). Falling back to raw upload.");

        if (originalFile) {
          readRawFile(originalFile).then(resolve).catch(reject);
        } else {
          reject(new Error("Failed to load image source."));
        }
      };

      img.src = src;

    } catch (error: any) {
      reject(new Error(`Image processing failed: ${error.message}`));
    }
  });
};

// Helper to read raw file as base64
const readRawFile = (file: File): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      // result looks like "data:image/heic;base64,....."
      const match = result.match(/^data:(.*);base64,(.*)$/);
      if (match) {
        let mimeType = match[1];
        // Fix common MIME type issues with HEIC
        if (!mimeType || mimeType === 'application/octet-stream' || mimeType === '') {
          if (file.name.toLowerCase().endsWith('.heic')) mimeType = 'image/heic';
          else if (file.name.toLowerCase().endsWith('.heif')) mimeType = 'image/heif';
        }

        resolve({
          mimeType: mimeType || 'image/jpeg',
          data: match[2]
        });
      } else {
        reject(new Error("Failed to parse file data."));
      }
    };
    reader.onerror = () => reject(new Error("File reading failed."));
    reader.readAsDataURL(file);
  });
};

/**
 * 1.5 Pass Pre-processor: Detect Face in Garment and Mask it.
 * This ensures the generation model doesn't get confused by the garment model's face.
 */
const detectAndMaskFace = async (
  apiKey: string,
  imageData: { mimeType: string, data: string }
): Promise<{ mimeType: string, data: string }> => {
  // If the image is raw HEIC and browser can't read it (Chrome), we can't mask it on canvas.
  // In that case, we return original and hope for the best.
  // However, normalizeFile usually converts HEIC to JPG for UI, so processImageForGemini usually returns JPG.
  if (imageData.mimeType !== 'image/jpeg' && imageData.mimeType !== 'image/png') {
    console.warn("Skipping face masking on non-standard format (likely raw HEIC)");
    return imageData;
  }

  try {
    console.log("Checking garment for faces to mask...");
    const ai = new GoogleGenAI({ apiKey });

    // 1. Detect Face using Gemini Flash (Fast & Cheap)
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: imageData },
          {
            text: `Analyze this fashion garment image. 
                             Detect the bounding box of the HUMAN FACE / HEAD. 
                             Return JSON: { "has_face": boolean, "box_2d": [ymin, xmin, ymax, xmax] } 
                             (Normalized coordinates 0-1). 
                             If no face is clearly visible, set has_face to false.` }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            has_face: { type: Type.BOOLEAN },
            box_2d: {
              type: Type.ARRAY,
              items: { type: Type.NUMBER },
              description: "[ymin, xmin, ymax, xmax]"
            }
          }
        }
      }
    });

    const result = response.text ? JSON.parse(response.text) : null;

    if (result && result.has_face && result.box_2d) {
      console.log("Face detected in garment. Masking...");
      return await maskFaceOnCanvas(imageData.data, result.box_2d);
    }

    console.log("No face detected in garment.");
    return imageData;

  } catch (e) {
    console.warn("Face masking failed, using original garment image.", e);
    return imageData;
  }
};

const maskFaceOnCanvas = (base64Data: string, box: number[]): Promise<{ mimeType: string, data: string }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve({ mimeType: 'image/jpeg', data: base64Data });
        return;
      }

      // Draw original
      ctx.drawImage(img, 0, 0);

      // Draw Mask
      // box is [ymin, xmin, ymax, xmax] 0-1 normalized
      const [ymin, xmin, ymax, xmax] = box;
      const x = xmin * img.width;
      const y = ymin * img.height;
      const w = (xmax - xmin) * img.width;
      const h = (ymax - ymin) * img.height;

      // Use a neutral grey mask (better for lighting diffusion than black)
      ctx.fillStyle = "#BBBBBB";
      // Expand mask slightly to cover neck/hair issues
      ctx.fillRect(x - (w * 0.1), y - (h * 0.1), w * 1.2, h * 1.2);

      const dataUrl = canvas.toDataURL('image/jpeg', 0.95);
      resolve({ mimeType: 'image/jpeg', data: dataUrl.split(',')[1] });
    };
    img.onerror = () => resolve({ mimeType: 'image/jpeg', data: base64Data }); // Fallback
    img.src = `data:image/jpeg;base64,${base64Data}`;
  });
};

/**
 * 2nd Pass Validator
 * CHANGED: Now uses gemini-3-flash-preview for lower cost/latency
 */
const verifyLightingConsistency = async (
  apiKey: string,
  generatedImageBase64: string
): Promise<{ pass: boolean; reason: string }> => {
  const ai = new GoogleGenAI({ apiKey });
  const rawBase64 = generatedImageBase64.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: 'image/jpeg', data: rawBase64 } },
          {
            text: `Act as a Senior Art Director. Pass if lighting is consistent. Return JSON { "pass": boolean, "reason": string }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { pass: { type: Type.BOOLEAN }, reason: { type: Type.STRING } }
        }
      }
    });

    if (response.text) return JSON.parse(response.text);
    return { pass: true, reason: "No analysis" };
  } catch (error) {
    return { pass: true, reason: "Skip" };
  }
};

/**
 * 3rd Pass Validator
 * CHANGED: Now uses gemini-3-flash-preview for lower cost/latency
 */
const verifyModelIdentity = async (
  apiKey: string,
  originalModelBase64: string,
  generatedImageBase64: string
): Promise<{ pass: boolean; reason: string }> => {
  const ai = new GoogleGenAI({ apiKey });
  const genBase64 = generatedImageBase64.replace(/^data:image\/\w+;base64,/, "");

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          { text: "Reference" },
          { inlineData: { mimeType: 'image/jpeg', data: originalModelBase64 } },
          { text: "Generated" },
          { inlineData: { mimeType: 'image/jpeg', data: genBase64 } },
          {
            text: `Compare identity. Return JSON { "pass": boolean, "reason": string }`
          }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: { pass: { type: Type.BOOLEAN }, reason: { type: Type.STRING } }
        }
      }
    });

    if (response.text) return JSON.parse(response.text);
    return { pass: true, reason: "No analysis" };
  } catch (error) {
    return { pass: true, reason: "Skip" };
  }
};

export const generateFashionImage = async (
  poseId: string,
  state: AppState,
  consistencyPrompt: string = ""
): Promise<string> => {
  if (!import.meta.env.VITE_API_KEY) throw new Error("API Key not found");

  const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY });
  const selectedPose = POSES.find(p => p.id === poseId);
  if (!selectedPose) throw new Error(`Pose ${poseId} not found`);

  // 1. Process Garments (Detect & Mask Faces)
  // We first standardise the image, THEN check for faces to mask
  const garmentParts = await Promise.all(state.garmentFiles.map(async (file) => {
    let processed = await processImageForGemini(file);

    // Automatic Face Masking Step
    // This prevents the original model's face from leaking into the generation
    processed = await detectAndMaskFace(import.meta.env.VITE_API_KEY!, processed);

    return { inlineData: { data: processed.data, mimeType: processed.mimeType } };
  }));

  let modelData = { mimeType: 'image/jpeg', data: '' };
  if (state.modelSource === 'upload' && state.modelFile) {
    modelData = await processImageForGemini(state.modelFile);
  } else if (state.modelSource === 'builtin' && state.builtInModelId) {
    const model = BUILT_IN_MODELS.find(m => m.id === state.builtInModelId);
    if (model) modelData = await processImageForGemini(model.url);
  }
  const modelPart = { inlineData: { data: modelData.data, mimeType: modelData.mimeType } };

  let bgPart = null;
  if (state.bgSource === 'upload' && state.bgFile) {
    const bgData = await processImageForGemini(state.bgFile);
    bgPart = { inlineData: { data: bgData.data, mimeType: bgData.mimeType } };
  } else if (state.bgSource === 'builtin' && state.builtInBgId) {
    const bg = BUILT_IN_BACKGROUNDS.find(b => b.id === state.builtInBgId);
    if (bg) {
      const bgData = await processImageForGemini(bg.url);
      bgPart = { inlineData: { data: bgData.data, mimeType: bgData.mimeType } };
    }
  }

  // 2. Prompt Construction
  let framingInstruction = "";
  if (selectedPose.category === 'B') {
    framingInstruction = "MANDATORY FRAMING: MACRO / DETAIL SHOT. Focus EXCLUSIVELY on the specific body part or garment detail described. CROPPING OK.";
  } else {
    // User Strict Requirements for Step 5 Selection
    switch (state.shotType) {
      case ShotType.FULL_BODY:
        framingInstruction = "CRITICAL FRAMING: FULL BODY SHOT. The ENTIRE subject from HEAD TO TOE must be visible. leave headroom and footroom. DO NOT CROP FEET.";
        break;
      case ShotType.UPPER_BODY:
        framingInstruction = "CRITICAL FRAMING: UPPER BODY SHOT. Frame from the HIPS/WAIST UP to the head. FOCUS on torso and face. DO NOT show legs.";
        break;
      case ShotType.LOWER_BODY:
        framingInstruction = "CRITICAL FRAMING: LOWER BODY SHOT. Frame from the WAIST DOWN to the feet. FOCUS on pants/skirt/shoes. DO NOT show head/shoulders.";
        break;
      default:
        framingInstruction = "Standard fashion composition.";
        break;
    }
  }

  const cameraSettings = {
    ...FIXED_CAMERA_SETTINGS,
    gender: state.gender || "Auto-detect",
    race: state.race || "Auto-detect"
  };

  const MAX_ATTEMPTS = 2; // Reduce attempts to speed up for now, but keep verification
  let attempts = 0;
  let generatedImageBase64 = '';
  let additionalInstructions = "";

  while (attempts < MAX_ATTEMPTS) {
    attempts++;

    const textPrompt = `
        Role: Senior Fashion Photographer & High-End Retoucher.
        Task: Generate a hyper-realistic fashion photograph with flawless compositing.
        
        INPUTS:
        - Model: Preserve identity (face, skin, body type) from the model image provided. 
          **CRITICAL**: DO NOT use the face from the garment image (it has been masked out). Use the explicit Model image.
        - Garments: Maintain texture and details.
        - Background: Match lighting to the background image.

        COMPOSITION:
        - Framing: ${framingInstruction}
        - Pose Name: ${selectedPose.title}
        - POSE DESCRIPTION (STRICTLY FOLLOW THIS): ${selectedPose.description}

        LIGHTING & INTEGRATION (CRITICAL):
        - LIGHTING MATCH: Analyze the background's light source (direction, temperature, softness) and apply the EXACT same lighting to the model's face and body.
        - SHADOWS: Cast realistic, contact-grounding shadows on the floor/ground. The model MUST NOT look floating.
        - REFLECTIONS: If the environment is reflective, show subtle reflections of the model.
        - AMBIENT OCCLUSION: Add natural darkening in crevices and where the model touches the environment.
        - COLOR GRADING: Harmonize the skin tones and garment colors with the background's ambient color palette.

        ADAPTIVE LOGIC (HIGHEST PRIORITY):
        1. SKIRT/DRESS DETECTION: IF the garment provided is a SKIRT or DRESS:
           - POSE OVERRIDE: IF the requested pose implies "hands in pockets", CHANGE IT to "Hands on hips/waist (Akimbo)". Skirts do not have pockets.
           - SHOES: The model MUST wear elegant High Heels.
           - SHOE COLOR: The High Heels MUST match the color palette of the skirt/dress.
        
        BATCH CONSISTENCY (UNIFORM STYLING):
        ${consistencyPrompt}
        
        NEGATIVE PROMPT:
        low quality, ugly, distorted face, floating limbs, pasted on, sticker look, grey box on face, blurred face, flat lighting, no shadows, mismatched lighting, chromatic aberration, cartoonish, bad composition.
        
        ${additionalInstructions}

        SETTINGS:
        ${JSON.stringify(cameraSettings)}
      `;

    const parts: any[] = [{ text: textPrompt }, modelPart, ...garmentParts];
    if (bgPart) parts.push(bgPart);

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts: parts },
      config: { imageConfig: { aspectRatio: "1:1", imageSize: "4K" } }
    });

    let foundImage = false;
    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          generatedImageBase64 = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
          foundImage = true;
          break;
        }
      }
    }

    if (!foundImage) throw new Error("No image generated.");

    // Verification (Skipped if we are on last attempt)
    if (attempts < MAX_ATTEMPTS) {
      const [lightingCheck, identityCheck] = await Promise.all([
        verifyLightingConsistency(import.meta.env.VITE_API_KEY, generatedImageBase64),
        verifyModelIdentity(import.meta.env.VITE_API_KEY, modelData.data, generatedImageBase64)
      ]);

      if (lightingCheck.pass && identityCheck.pass) {
        return generatedImageBase64;
      } else {
        additionalInstructions = `\nFIX ISSUES: ${!identityCheck.pass ? "Wrong Identity. " : ""}${!lightingCheck.pass ? "Bad Lighting. " : ""}`;
      }
    } else {
      return generatedImageBase64;
    }
  }

  return generatedImageBase64;
};
