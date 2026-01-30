
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
    url: "/shot-types/full-body.jpg"
  },
  {
    type: ShotType.UPPER_BODY,
    label: 'Upper Body',
    description: 'Waist up',
    url: "/shot-types/upper-body.jpg"
  },
  {
    type: ShotType.LOWER_BODY,
    label: 'Lower Body',
    description: 'Waist down',
    url: "/shot-types/lower-body.jpg"
  },
];

export const POSES: Pose[] = [
  {
    id: 'A1', category: 'A', title: 'The Classic Contrapposto',
    description: 'Model stands facing forward, weight fully on the right leg, right hip slightly pushed out. Left leg relaxed, knee slightly bent, toe lightly touching the ground. Both arms hang naturally at the sides, shoulders relaxed and thrown back.',
    usage: 'Universal pose. Best for showcasing the natural drape and silhouette of long coats, dresses, or suits.',
    url: '/poses/a1.jpg'
  },
  {
    id: 'A2', category: 'A', title: 'Mid-Stride Walking',
    description: 'Capturing a walking moment. Right leg takes a large step forward, heel touching ground, leg straight; Left leg behind, toe pushing off, knee bent. Body weight on the front foot. Arms swing naturally (Left arm forward, Right arm back).',
    usage: 'Showcasing pants fit, skirt flow/draping, and dynamic folds of jackets in motion.',
    url: '/poses/a2.jpg'
  },
  {
    id: 'A3', category: 'A', title: 'The Over-the-Shoulder Back View',
    description: 'Model stands with back to camera. Head turned to the back right (even if no face, head angle must turn). Right shoulder slightly dropped, left hand hangs naturally, right hand lightly rests on the right waist.',
    usage: 'Specifically for showcasing back designs, back prints, or jacket rear cuts.',
    url: 'https://picsum.photos/400/600?random=103&grayscale'
  },
  {
    id: 'A4', category: 'A', title: 'The 3/4 Turn',
    description: 'Body rotated about 45 degrees relative to the camera. Weight on the back leg, front leg slightly crossed in front of the back leg. The arm facing the camera hangs naturally, the other hand can be lightly placed behind the back.',
    usage: 'Very slimming angle, excellent for showing side lines and layering hierarchy.',
    url: 'https://picsum.photos/400/600?random=104&grayscale'
  },
  {
    id: 'A5', category: 'A', title: 'One Hand in Pocket Casual',
    description: 'Standing frontally or slightly to the side. Weight shifted to one side. One hand heavily casually tucked into trousers or jacket pocket, thumb exposed. The other arm relaxed naturally.',
    usage: 'Showcasing trousers pocket design, jacket casualness, while emphasizing the waistline position.',
    url: 'https://picsum.photos/400/600?random=105&grayscale'
  },
  {
    id: 'A6', category: 'A', title: 'Arms Crossed Texture Focus',
    description: 'Stable stance, feet shoulder-width apart. Arms crossed loosely in front of chest (do not hug too tight to avoid hiding too much cloth). Head tilted slightly.',
    usage: 'Focuses visual attention on the chest and sleeves, suitable for showing knitwear texture, cuff details, or top patterns.',
    url: 'https://picsum.photos/400/600?random=106&grayscale'
  },
  {
    id: 'A7', category: 'A', title: 'The Elegant Seated Pose',
    description: 'Model seated on a sleek GUNDE-style folding chair. Back straight, right leg elegantly crossed over left knee. Hands lightly folded on thighs.',
    usage: 'Showcasing skirt length and sitting effect, or knee lines of pants and shoe coordination when seated.',
    url: 'https://picsum.photos/400/600?random=107&grayscale'
  },
  {
    id: 'A8', category: 'A', title: 'The Detail Touch',
    description: 'Standing base, one hand raised to lightly touch the opposite collar, lapel edge, or adjusting the other hands cuff. Movement should be gentle, like a frozen moment.',
    usage: 'Forces viewer gaze to specific craftsmanship details (collar shape, cufflinks, material).',
    url: 'https://picsum.photos/400/600?random=108&grayscale'
  },
  {
    id: 'A9', category: 'A', title: 'The Strong A-Stance',
    description: 'Feet placed slightly wider than shoulders, standing firmly on the ground, legs straight. Hands hang naturally at sides. Body straight and powerful.',
    usage: 'Suitable for street wear, loose fit pants, or voluminous jackets to show presence/aura.',
    url: 'https://picsum.photos/400/600?random=109&grayscale'
  },
  {
    id: 'A10', category: 'A', title: 'The Wall Lean',
    description: 'Model leans lightly with one shoulder and back against an invisible wall. The leaning leg bends slightly to support body, outer leg stretches straight and crosses in front. Outer arm hangs naturally, leaning arm can bend slightly.',
    usage: 'Creates a casual, lazy fashion feel, allowing clothes to stack folds naturally, appearing more lifestyle-oriented.',
    url: 'https://picsum.photos/400/600?random=110&grayscale'
  },
  {
    id: 'A11', category: 'A', title: 'Double Hands on Hips Power',
    description: 'Feet shoulder-width apart, standing firmly. Both hands on waist sides, elbows flaring out. Torso remains straight and confident.',
    usage: 'Emphasizes waistline and belt accessories, and displays a confident, strong aura. Suitable for suits or workwear.',
    url: 'https://picsum.photos/400/600?random=111&grayscale'
  },
  {
    id: 'A12', category: 'A', title: 'The High Stool Perch',
    description: 'Model is not fully seated, but perching on the edge of a high Hee bar stool. One leg straight with toe touching ground, the other leg slightly bent resting on the chair bar. Hands casually on thigh.',
    usage: 'Creates a lighter, more dynamic atmosphere than a full sit. Good for showing trouser leg drape and shoes.',
    url: 'https://picsum.photos/400/600?random=112&grayscale'
  },
  {
    id: 'A13', category: 'A', title: 'The Jacket Sling Stride',
    description: 'In a mid-stride walking state. One hand is bent back hooking a jacket casually over the same shoulder. The other hand swings naturally.',
    usage: 'Showcasing layered styling, especially the combination of inner wear vs outer jacket.',
    url: 'https://picsum.photos/400/600?random=113&grayscale'
  },
  {
    id: 'A14', category: 'A', title: 'Upward Stretched Crossed Stance',
    description: 'Legs tightly crossed (scissor legs). Torso leans back slightly and extends to one side. Right hand raised high above head, palm hovering in front of face; Left arm hangs naturally. Head tilted back significanty, gazing upward.',
    usage: 'Showcasing suit structural sense, slim straight trouser fit, and high-fashion coolness.',
    url: 'https://picsum.photos/400/600?random=114&grayscale'
  },
  {
    id: 'A15', category: 'A', title: 'The Street Groove Freeze',
    description: 'Legs in a Cross-step stance, weight shifting flexibly. Upper body twists slightly, Right hand raised above head, Left hand extended horizontally to side. Head turned to left, eyes looking down.',
    usage: 'Perfect for Streetwears casual coolness. Suitable for showing loose fit of Hoodies and sweatpants.',
    url: 'https://picsum.photos/400/600?random=115&grayscale'
  },
  {
    id: 'A16', category: 'A', title: 'The Head-On Power Stride',
    description: 'Capturing the dynamic moment of walking straight towards the lens. Weight on the back foot, front heel just touching the ground, toe slightly turned up. Hands in trouser pockets, exhibiting a momentum of walking against the wind. Head straight, eyes looking firmly at the lens.',
    usage: 'Showing strong confident aura. Presents internal structure of jackets and layered wear.',
    url: 'https://picsum.photos/400/600?random=116&grayscale'
  },
  {
    id: 'A17', category: 'A', title: 'The Luxe Floor Lounge',
    description: 'Sitting casually on floor. One leg extended forward, other leg bent at knee. Upper body leans back, one hand behind supporting body on ground, other arm resting on bent knee.',
    usage: 'Conveying a lazy, luxurious casual attitude. Suitable for premium knitwear or comfort fit pants.',
    url: 'https://picsum.photos/400/600?random=117&grayscale'
  },
  {
    id: 'A18', category: 'A', title: 'The Joyful Suspension',
    description: 'Both toes lightly tap the ground, floating feel. Knees naturally bent together, body weight sinking in Z shape. Arms spread to sides (Left high Right low). Head lowered, looking at feet, with a smile.',
    usage: 'Excellent for showing Mobility and comfort. Highlights stretch of bottom fabrics.',
    url: 'https://picsum.photos/400/600?random=118&grayscale'
  },
  {
    id: 'A19', category: 'A', title: 'Mid-Air Stride Suspension',
    description: 'Vertical jump at peak. Upper body straight, frontal. Right leg lifted high, thigh parallel to ground, knee bent 90 degrees and rotated inward; Left leg vertical downwards, toe pointed down.',
    usage: 'Showing suit activity space in large movements and dynamic tie movement.',
    url: 'https://picsum.photos/400/600?random=119&grayscale'
  },
  {
    id: 'A20', category: 'A', title: 'Dynamic Back-Kick Leap',
    description: 'Front visible to camera. Right foot toe supports weight; Left foot kicks back significantly, calf folded backwards and upwards. Upper body straight. Right hand bent in front to clavicle, Left hand extends back.',
    usage: 'Focus on showing drape of Pleated Trousers in motion. NO SIDE PROFILE.',
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
  { id: 'm1', gender: 'Male', label: 'Caucasian Male (Stubble)', url: '/models/m1.jpg' },
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
