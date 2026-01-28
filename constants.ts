
import { Pose, ShotType } from './types';

export const FIXED_CAMERA_SETTINGS = {
  "image_type": "Studio Photography",
  "lens": "85mm Portrait Lens",
  "aperture": "f/2.8",
  "focus": "Sharp focus on subject",
  "depth_of_field": "Shallow depth of field with blurred background",
  "build": "Natural athletic build",
  "pose": "Confident and relaxed posture",
  "lighting": {
    "type": "Professional Studio Lighting",
    "key_light": "Softbox main light (front)",
    "fill_light": "Soft fill light",
    "rim_light": "Subtle rim light",
    "shadows": "Soft and natural",
    "skin_tones": "Accurate and lifelike",
    "realism": "High",
    "look": "Fashion Magazine Portrait",
    "color_grading": "Neutral and balanced",
    "no_filters": true
  },
  "quality": {
    "resolution": "8K",
    "detail_level": "Ultra-high",
    "noise": "None"
  },
  "constraints": [
    "Focus entirely on subject",
    "No motion blur",
    "No over-processing",
    "No cartoon style",
    "No distorted anatomy"
  ],
  "Size": [
    "1:1",
    "Highest Resolution"
  ]
};

export const SHOT_TYPE_OPTIONS = [
  { 
    type: ShotType.FULL_BODY, 
    label: 'Full Body', 
    description: 'Head to toe',
    url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='24' r='8' fill='%231f2937'/%3E%3Cpath d='M50 36 C 36 36, 28 42, 28 52 V 62 H 36 V 90 H 46 V 66 H 54 V 90 H 64 V 62 H 72 V 52 C 72 42, 64 36, 50 36 Z' fill='%231f2937'/%3E%3Cpath d='M20 30 V 20 H 30 M80 30 V 20 H 70 M20 70 V 80 H 30 M80 70 V 80 H 70' stroke='%231f2937' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
  },
  { 
    type: ShotType.UPPER_BODY, 
    label: 'Upper Body', 
    description: 'Waist up',
    url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='24' r='8' fill='%231f2937'/%3E%3Cpath d='M50 36 C 36 36, 28 42, 28 52 V 62 H 36 V 66 H 64 V 62 H 72 V 52 C 72 42, 64 36, 50 36 Z' fill='%231f2937'/%3E%3Cpath d='M36 68 V 90 H 46 V 68 H 54 V 90 H 64 V 68' fill='%23E5E7EB'/%3E%3Cpath d='M20 25 V 15 H 30 M80 25 V 15 H 70 M20 55 V 65 H 30 M80 55 V 65 H 70' stroke='%231f2937' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
  },
  { 
    type: ShotType.LOWER_BODY, 
    label: 'Lower Body', 
    description: 'Waist down',
    url: "data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100' fill='none'%3E%3Ccircle cx='50' cy='24' r='8' fill='%23E5E7EB'/%3E%3Cpath d='M50 36 C 36 36, 28 42, 28 52 V 62 H 36 V 66 H 64 V 62 H 72 V 52 C 72 42, 64 36, 50 36 Z' fill='%23E5E7EB'/%3E%3Cpath d='M36 66 V 90 H 46 V 66 H 54 V 90 H 64 V 66' fill='%231f2937'/%3E%3Cpath d='M25 60 V 50 H 35 M75 60 V 50 H 65 M25 90 V 100 H 35 M75 90 V 100 H 65' stroke='%231f2937' stroke-width='3' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E"
  },
];

export const POSES: Pose[] = [
  {
    id: 'A1', category: 'A', title: 'Classic Weight Shift',
    description: 'Model stands facing forward, weight shifted to the right leg, right hip slightly out. Left leg relaxed with knee slightly bent.',
    usage: 'Universal pose. Best for showcasing long coats, dresses, or general silhouettes.',
    url: 'https://picsum.photos/400/600?random=101&grayscale' 
  },
  {
    id: 'A2', category: 'A', title: 'Mid-Walk Frame',
    description: 'Capturing a step in motion. Right leg forward, heel touching ground, left leg behind on toes.',
    usage: 'Displays pants fit, dress movement, and natural jacket folds during motion.',
    url: 'https://picsum.photos/400/600?random=102&grayscale'
  },
  {
    id: 'A3', category: 'A', title: 'Over-the-Shoulder Back View',
    description: 'Model stands back to camera, head turned 45 degrees back. Right shoulder dropped slightly.',
    usage: 'Specifically for back designs, prints, or jacket rear construction.',
    url: 'https://picsum.photos/400/600?random=103&grayscale'
  },
  {
    id: 'A4', category: 'A', title: 'Three-Quarter Side Pose',
    description: 'Body rotated 45 degrees from lens. Weight on back leg, front leg crossed slightly.',
    usage: 'Slimming angle that highlights side seams and layering textures.',
    url: 'https://picsum.photos/400/600?random=104&grayscale'
  },
  {
    id: 'A5', category: 'A', title: 'One Hand in Pocket',
    description: 'Facing forward or slightly side. One hand casually tucked into pocket.',
    usage: 'Shows off pocket details, casual outerwear vibe, and waistline placement.',
    url: 'https://picsum.photos/400/600?random=105&grayscale'
  },
  {
    id: 'A6', category: 'A', title: 'Arms Crossed',
    description: 'Steady stance, shoulders square. Arms relaxed across the chest.',
    usage: 'Focuses attention on chest and sleeve details, knit textures, or patterns.',
    url: 'https://picsum.photos/400/600?random=106&grayscale'
  },
  {
    id: 'A7', category: 'A', title: 'Elegant Crossed-Leg Sit',
    description: 'Model sitting on a studio stool. Back straight, right leg crossed over left knee.',
    usage: 'Shows dress length when seated or how pants drape over knees and footwear.',
    url: 'https://picsum.photos/400/600?random=107&grayscale'
  },
  {
    id: 'A8', category: 'A', title: 'Touching Collar/Cuff',
    description: 'Standing pose, one hand raised to lightly touch the collar or lapel edge.',
    usage: 'Directs viewer focus to specific craftsmanship details (buttons, lapels, material).',
    url: 'https://picsum.photos/400/600?random=108&grayscale'
  },
  {
    id: 'A9', category: 'A', title: 'Power A-Stance',
    description: 'Feet planted wider than shoulders. Arms natural at sides.',
    usage: 'Ideal for street wear, oversized pants, or high-volume jackets to show presence.',
    url: 'https://picsum.photos/400/600?random=109&grayscale'
  },
  {
    id: 'A10', category: 'A', title: 'Leaning Against Wall',
    description: 'One shoulder and back leaning lightly against a wall surface. One leg bent.',
    usage: 'Creates a casual, lifestyle vibe allowing clothes to stack and fold naturally.',
    url: 'https://picsum.photos/400/600?random=110&grayscale'
  },
  {
    id: 'A11', category: 'A', title: 'Hands on Hips',
    description: 'Feet shoulder-width apart. Both hands on waist, elbows out.',
    usage: 'Emphasizes waistline and belts, projecting a strong, confident editorial look.',
    url: 'https://picsum.photos/400/600?random=111&grayscale'
  },
  {
    id: 'A12', category: 'A', title: 'High Stool Perch',
    description: 'Model sitting on the edge of a high stool. One leg straight, one leg bent.',
    usage: 'Lighter, more dynamic seated pose than a full chair sit.',
    url: 'https://picsum.photos/400/600?random=112&grayscale'
  },
  {
    id: 'A13', category: 'A', title: 'Jacket Over Shoulder',
    description: 'Mid-walk frame. One hand hooked back holding a jacket over the shoulder.',
    usage: 'Perfect for layering shots, showing off inner garments alongside outerwear.',
    url: 'https://picsum.photos/400/600?random=113&grayscale'
  },
  {
    id: 'A14', category: 'A', title: 'Looking Up Extension',
    description: 'Legs crossed tightly while standing. Torso leaning back slightly. One hand raised.',
    usage: 'Shows suit structure and slim-fit trouser lines.',
    url: 'https://picsum.photos/400/600?random=114&grayscale'
  },
  {
    id: 'A15', category: 'A', title: 'Street Movement Frame',
    description: 'Cross-step standing pose. Upper body twisted with arms wide.',
    usage: 'Captures the "cool" factor of modern street fashion.',
    url: 'https://picsum.photos/400/600?random=115&grayscale'
  },
  {
    id: 'A16', category: 'A', title: 'Striding Forward',
    description: 'Direct stride toward lens. Hands in pockets pushing jacket open.',
    usage: 'Powerful editorial look showing inner garment and coat structure.',
    url: 'https://picsum.photos/400/600?random=116&grayscale'
  },
  {
    id: 'A17', category: 'A', title: 'Floor Lounge Sit',
    description: 'Model sitting casually on the floor. One leg extended, one leg tucked.',
    usage: 'Conveys a relaxed, high-fashion loungewear attitude.',
    url: 'https://picsum.photos/400/600?random=117&grayscale'
  },
  {
    id: 'A18', category: 'A', title: 'Light Toe Bounce',
    description: 'Capturing a moment of weightlessness on toes. Knees slightly together.',
    usage: 'Shows flexibility and comfort of casual athletic wear.',
    url: 'https://picsum.photos/400/600?random=118&grayscale'
  },
  {
    id: 'A19', category: 'A', title: 'Jump Stride',
    description: 'Vertical jump at peak height. One knee raised parallel to ground.',
    usage: 'Showcases suit tailoring and movement range.',
    url: 'https://picsum.photos/400/600?random=119&grayscale'
  },
  {
    id: 'A20', category: 'A', title: 'Side Kick Movement',
    description: 'Light jump with one foot landing. One leg kicked back sharply.',
    usage: 'Demonstrates drape of pleated trousers or wide-leg pants in motion.',
    url: 'https://picsum.photos/400/600?random=120&grayscale'
  },

  {
    id: 'B1', category: 'B', title: 'Neckline Detail',
    description: 'Macro shot focusing on collar construction and stitching.',
    usage: 'Showcases neckline craftsmanship.',
    url: 'https://picsum.photos/400/400?random=201&blur=2'
  },
  {
    id: 'B2', category: 'B', title: 'Cuff/Wrist Detail',
    description: 'Close-up of forearm and wrist showing cuff buttons or fabric weave.',
    usage: 'Showcases sleeve and fabric texture.',
    url: 'https://picsum.photos/400/400?random=202&blur=2'
  },
  {
    id: 'B3', category: 'B', title: 'Waistline/Pocket Close-up',
    description: 'Focus on belt loops, waist buttons, or pocket seam details.',
    usage: 'Showcases waist construction.',
    url: 'https://picsum.photos/400/400?random=203&blur=2'
  },
  {
    id: 'B4', category: 'B', title: 'Button/Placket Macro',
    description: 'High-detail shot of garment fasteners and button material.',
    usage: 'Showcases hardware and closure details.',
    url: 'https://picsum.photos/400/400?random=204&blur=2'
  },
  {
    id: 'B5', category: 'B', title: 'Back Yoke Detail',
    description: 'Focus on upper back shoulder seams and yoke construction.',
    usage: 'Showcases back tailoring.',
    url: 'https://picsum.photos/400/400?random=205&blur=2'
  },
  {
    id: 'B6', category: 'B', title: 'Fabric Texture/Fold',
    description: 'Macro shot of natural fabric draping and material weave.',
    usage: 'Showcases premium material quality.',
    url: 'https://picsum.photos/400/400?random=206&blur=2'
  },
  {
    id: 'B7', category: 'B', title: 'Upper Body Pocket Hand',
    description: 'Waist-up shot showing hand casually in jacket pocket.',
    usage: 'Natural lifestyle detail of upper body garments.',
    url: 'https://picsum.photos/400/400?random=207&blur=2'
  },
  {
    id: 'B8', category: 'B', title: 'Lower Body Pocket Hand',
    description: 'Waist-down shot showing hand in trouser pocket.',
    usage: 'Natural lifestyle detail of lower body garments.',
    url: 'https://picsum.photos/400/400?random=208&blur=2'
  }
];

export const BUILT_IN_MODELS = [
  { id: 'f1', gender: 'Female', label: 'Asian Female (Light Skin)', url: 'https://picsum.photos/400/600?random=301' },
  { id: 'f2', gender: 'Female', label: 'Caucasian Female (Blonde)', url: 'https://picsum.photos/400/600?random=302' },
  { id: 'f3', gender: 'Female', label: 'African Female (Natural)', url: 'https://picsum.photos/400/600?random=303' },
  { id: 'f4', gender: 'Female', label: 'Latina Female', url: 'https://picsum.photos/400/600?random=304' },
  { id: 'f5', gender: 'Female', label: 'Southeast Asian Female', url: 'https://picsum.photos/400/600?random=305' },
  { id: 'f6', gender: 'Female', label: 'Middle Eastern Female', url: 'https://picsum.photos/400/600?random=306' },
  { id: 'f7', gender: 'Female', label: 'Redhead Caucasian Female', url: 'https://picsum.photos/400/600?random=307' },
  { id: 'f8', gender: 'Female', label: 'East Asian Female (Bob Cut)', url: 'https://picsum.photos/400/600?random=308' },
  { id: 'f9', gender: 'Female', label: 'Black Female (Braids)', url: 'https://picsum.photos/400/600?random=309' },
  { id: 'f10', gender: 'Female', label: 'Senior Caucasian Female', url: 'https://picsum.photos/400/600?random=310' },
  { id: 'm1', gender: 'Male', label: 'Caucasian Male (Stubble)', url: 'https://picsum.photos/400/600?random=311' },
  { id: 'm2', gender: 'Male', label: 'Asian Male (Clean Shaven)', url: 'https://picsum.photos/400/600?random=312' },
  { id: 'm3', gender: 'Male', label: 'Black Male (Fade Cut)', url: 'https://picsum.photos/400/600?random=313' },
  { id: 'm4', gender: 'Male', label: 'Latino Male', url: 'https://picsum.photos/400/600?random=314' },
  { id: 'm5', gender: 'Male', label: 'Middle Eastern Male (Beard)', url: 'https://picsum.photos/400/600?random=315' },
  { id: 'm6', gender: 'Male', label: 'South Asian Male', url: 'https://picsum.photos/400/600?random=316' },
  { id: 'm7', gender: 'Male', label: 'Caucasian Male (Long Hair)', url: 'https://picsum.photos/400/600?random=317' },
  { id: 'm8', gender: 'Male', label: 'East Asian Male (Street)', url: 'https://picsum.photos/400/600?random=318' },
  { id: 'm9', gender: 'Male', label: 'Senior Asian Male', url: 'https://picsum.photos/400/600?random=319' },
  { id: 'm10', gender: 'Male', label: 'Black Male (Dreads)', url: 'https://picsum.photos/400/600?random=320' },
];

export const BUILT_IN_BACKGROUNDS = [
  { id: 's1', category: 'Studio', label: 'Infinite Grey', url: 'https://picsum.photos/800/800?random=501' },
  { id: 's2', category: 'Studio', label: 'Pure White Cyclorama', url: 'https://picsum.photos/800/800?random=502' },
  { id: 's3', category: 'Studio', label: 'Textured Canvas (Brown)', url: 'https://picsum.photos/800/800?random=503' },
  { id: 's4', category: 'Studio', label: 'Dark Mood Concrete', url: 'https://picsum.photos/800/800?random=504' },
  { id: 's5', category: 'Studio', label: 'Gradient Blue', url: 'https://picsum.photos/800/800?random=505' },
  { id: 's6', category: 'Studio', label: 'Warm Beige Wall', url: 'https://picsum.photos/800/800?random=506' },
  { id: 's7', category: 'Studio', label: 'Industrial Loft Brick', url: 'https://picsum.photos/800/800?random=507' },
  { id: 's8', category: 'Studio', label: 'Abstract Light Shadow', url: 'https://picsum.photos/800/800?random=508' },
  { id: 's9', category: 'Studio', label: 'Pastel Pink Studio', url: 'https://picsum.photos/800/800?random=509' },
  { id: 's10', category: 'Studio', label: 'Black Velvet', url: 'https://picsum.photos/800/800?random=510' },
  { id: 'o1', category: 'Outdoor', label: 'NYC Street Corner', url: 'https://picsum.photos/800/800?random=601' },
  { id: 'o2', category: 'Outdoor', label: 'Parisian Cafe Exterior', url: 'https://picsum.photos/800/800?random=602' },
  { id: 'o3', category: 'Outdoor', label: 'Modern Glass Architecture', url: 'https://picsum.photos/800/800?random=603' },
  { id: 'o4', category: 'Outdoor', label: 'Concrete Skate Park', url: 'https://picsum.photos/800/800?random=604' },
  { id: 'o5', category: 'Outdoor', label: 'Rooftop at Sunset', url: 'https://picsum.photos/800/800?random=605' },
  { id: 'o6', category: 'Outdoor', label: 'Graffiti Alleyway', url: 'https://picsum.photos/800/800?random=606' },
  { id: 'o7', category: 'Outdoor', label: 'Luxury Storefront', url: 'https://picsum.photos/800/800?random=607' },
  { id: 'o8', category: 'Outdoor', label: 'Subway Station Platform', url: 'https://picsum.photos/800/800?random=608' },
  { id: 'o9', category: 'Outdoor', label: 'Old European Cobblestone', url: 'https://picsum.photos/800/800?random=609' },
  { id: 'o10', category: 'Outdoor', label: 'City Bridge Walkway', url: 'https://picsum.photos/800/800?random=610' },
  { id: 'w1', category: 'Wilderness', label: 'Desert Dunes', url: 'https://picsum.photos/800/800?random=701' },
  { id: 'w2', category: 'Wilderness', label: 'Forest Clearing', url: 'https://picsum.photos/800/800?random=702' },
  { id: 'w3', category: 'Wilderness', label: 'Rocky Beach Coast', url: 'https://picsum.photos/800/800?random=703' },
  { id: 'w4', category: 'Wilderness', label: 'Mountain Peak Snow', url: 'https://picsum.photos/800/800?random=704' },
  { id: 'w5', category: 'Wilderness', label: 'Tropical Jungle', url: 'https://picsum.photos/800/800?random=705' },
  { id: 'w6', category: 'Wilderness', label: 'Open Grass Field', url: 'https://picsum.photos/800/800?random=706' },
];
