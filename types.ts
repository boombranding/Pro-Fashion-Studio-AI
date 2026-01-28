
export interface Pose {
  id: string;
  category: 'A' | 'B';
  title: string;
  description: string;
  usage: string;
  url: string;
}

export enum ShotType {
  UPPER_BODY = 'Upper Body - Waist Up',
  LOWER_BODY = 'Lower Body - Waist Down',
  FULL_BODY = 'Full Body Shot',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  NON_BINARY = 'Non-binary',
}

export interface AppState {
  modelSource: 'builtin' | 'upload';
  builtInModelId: string | null;
  modelFile: File | null;
  gender: string;
  race: string;
  
  bgSource: 'builtin' | 'upload';
  builtInBgId: string | null;
  bgFile: File | null;
  
  garmentFiles: File[];
  
  selectedPoseIds: string[];
  
  shotType: ShotType | null;

  // View State
  viewMode: 'studio' | 'generating'; 
  isGenerating: boolean;
  results: GeneratedResult[];
  error: string | null;
}

export interface GeneratedResult {
  poseId: string;
  imageUrl: string;
  loading: boolean;
  error?: string;
}

export interface ValidationResult {
  isValid: boolean;
  missingFields: string[];
}

export interface Project {
  id: string;
  timestamp: number;
  itemCount: number;
  thumbnailUrl?: string;
}

export interface GalleryItem {
  id: string;
  projectId: string;
  poseId: string;
  imageUrl: string;
  timestamp: number;
}

declare global {
  interface AIStudio {
    hasSelectedApiKey: () => Promise<boolean>;
    openSelectKey: () => Promise<void>;
  }
}
