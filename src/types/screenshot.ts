export interface Screenshot {
  id: string;
  dataUrl: string;
  timestamp: number;
  label: string;
  cameraAngle: string;
  studioMode: "tree" | "rock";
  seed: number;
}

export interface AIAnalysis {
  id: string;
  timestamp: number;
  screenshotIds: string[];
  prompt: string;
  response: string;
  model: string;
}
