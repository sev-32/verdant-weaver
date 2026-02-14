export type RockParams = Record<string, number | string | boolean>;

export type RockPresetId = "granite" | "sandstone" | "basalt" | "limestone" | "slate" | "volcanic";

export interface RockPreset {
  id: RockPresetId;
  name: string;
  description: string;
  params: Partial<RockParams>;
}

export interface SavedRock {
  id: string;
  name: string;
  params: RockParams;
  seed: number;
  timestamp: number;
}

export interface SceneRock {
  id: string;
  savedRockId: string;
  position: [number, number, number];
  rotation: [number, number, number];
  scale: number;
}

export const DEFAULT_ROCK_PARAMS: RockParams = {
  // Shape
  rockType: "boulder",
  scale: 1.5,
  scaleX: 1.0,
  scaleY: 1.0,
  scaleZ: 1.0,
  subdivisions: 5,
  seed: 42,

  // Displacement
  displacementStrength: 0.35,
  displacementFrequency: 1.8,
  displacementOctaves: 6,
  displacementLacunarity: 2.1,
  displacementPersistence: 0.48,

  // Erosion
  erosionStrength: 0.25,
  erosionSharpness: 1.4,
  erosionDirection: 0.7,
  erosionChannels: 0.3,
  erosionSmoothing: 0.15,

  // Fracture
  fractureStrength: 0.0,
  fractureDensity: 3,
  fractureSharpness: 2.0,
  fractureDepth: 0.12,

  // Layering (sedimentary)
  layeringStrength: 0.0,
  layeringFrequency: 8,
  layeringWarp: 0.2,
  layeringThickness: 0.5,

  // Surface detail
  surfaceRoughness: 0.85,
  surfaceBumpScale: 0.04,
  surfacePitting: 0.15,
  surfaceLichen: 0.0,
  surfaceMoss: 0.0,

  // Material / PBR
  baseColor: "#7a7a72",
  baseColorVariation: 0.15,
  secondaryColor: "#5a5852",
  metalness: 0.02,
  roughness: 0.88,
  emissiveStrength: 0.0,

  // Crystalline
  crystallineStrength: 0.0,
  crystallineScale: 0.3,
  crystallineColor: "#b8c4d8",

  // Quartz deposits
  quartzStrength: 0.0,
  quartzScale: 0.4,
  quartzColor: "#e8e4d8",
  quartzRoughness: 0.15,
  quartzMetalness: 0.0,

  // Mica / Glitter
  micaStrength: 0.0,
  micaDensity: 12,
  micaColor: "#d4c8a0",
  micaMetalness: 0.6,

  // Mineral veins
  veinStrength: 0.0,
  veinScale: 2.0,
  veinColor: "#c8b890",
  veinThickness: 0.08,
  veinMetalness: 0.1,

  // Moss types
  mossColor: "#3a5a28",
  mossThreshold: 0.6,
  mossCoverage: 0.0,
  mossType: "clump",        // clump | sheet | drape | stringy
  mossHeight: 0.3,
  mossVariation: 0.2,

  // Lichen
  lichenStrength: 0.0,
  lichenColor: "#b8c86a",
  lichenScale: 4.0,
  lichenThreshold: 0.5,

  // Environment
  groundEmbed: 0.15,
  rotation: 0,

  // Developer / Quality
  wireframe: false,
  shadowQuality: 2048,
  pixelRatio: 0,             // 0 = auto
  maxSubdivisions: 6,
  showNormals: false,
  showUVs: false,
  flatShading: false,
  toneMappingExposure: 1.0,
  fogDensity: 0.02,
};

export const ROCK_PRESETS: RockPreset[] = [
  {
    id: "granite",
    name: "Granite",
    description: "Coarse-grained igneous rock with speckled surface",
    params: {
      baseColor: "#8a8580",
      secondaryColor: "#6e6a64",
      displacementStrength: 0.28,
      displacementFrequency: 2.2,
      displacementOctaves: 5,
      surfaceRoughness: 0.82,
      surfacePitting: 0.22,
      surfaceBumpScale: 0.035,
      erosionStrength: 0.12,
      erosionSharpness: 1.2,
      fractureStrength: 0.08,
      crystallineStrength: 0.12,
      crystallineColor: "#c8b8a8",
      baseColorVariation: 0.18,
      roughness: 0.85,
      quartzStrength: 0.15,
      micaStrength: 0.2,
    },
  },
  {
    id: "sandstone",
    name: "Sandstone",
    description: "Sedimentary rock with visible layering and warm tones",
    params: {
      baseColor: "#c4956a",
      secondaryColor: "#a87d52",
      displacementStrength: 0.22,
      displacementFrequency: 1.4,
      displacementOctaves: 4,
      surfaceRoughness: 0.92,
      surfacePitting: 0.08,
      erosionStrength: 0.42,
      erosionSharpness: 0.8,
      erosionChannels: 0.45,
      layeringStrength: 0.55,
      layeringFrequency: 12,
      layeringWarp: 0.35,
      roughness: 0.94,
      baseColorVariation: 0.12,
      veinStrength: 0.2,
      veinColor: "#d4a870",
    },
  },
  {
    id: "basalt",
    name: "Basalt",
    description: "Dark volcanic rock with columnar fracturing",
    params: {
      baseColor: "#3a3a3e",
      secondaryColor: "#2a2a2e",
      displacementStrength: 0.18,
      displacementFrequency: 2.8,
      displacementOctaves: 5,
      surfaceRoughness: 0.78,
      surfacePitting: 0.3,
      fractureStrength: 0.42,
      fractureDensity: 5,
      fractureSharpness: 3.0,
      fractureDepth: 0.18,
      roughness: 0.75,
      baseColorVariation: 0.06,
      metalness: 0.04,
    },
  },
  {
    id: "limestone",
    name: "Limestone",
    description: "Pale sedimentary rock with smooth erosion patterns",
    params: {
      baseColor: "#d4cfc2",
      secondaryColor: "#b8b2a4",
      displacementStrength: 0.2,
      displacementFrequency: 1.2,
      displacementOctaves: 4,
      surfaceRoughness: 0.7,
      surfacePitting: 0.35,
      erosionStrength: 0.55,
      erosionSharpness: 0.6,
      erosionSmoothing: 0.35,
      erosionChannels: 0.55,
      layeringStrength: 0.3,
      layeringFrequency: 6,
      roughness: 0.82,
      baseColorVariation: 0.08,
      lichenStrength: 0.3,
    },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Fine-grained metamorphic rock with flat cleavage planes",
    params: {
      baseColor: "#4a5058",
      secondaryColor: "#383e44",
      displacementStrength: 0.15,
      displacementFrequency: 3.2,
      displacementOctaves: 4,
      surfaceRoughness: 0.65,
      surfacePitting: 0.05,
      fractureStrength: 0.28,
      fractureDensity: 8,
      fractureSharpness: 1.5,
      layeringStrength: 0.65,
      layeringFrequency: 18,
      layeringThickness: 0.3,
      scaleY: 0.6,
      roughness: 0.72,
      metalness: 0.05,
      baseColorVariation: 0.05,
      micaStrength: 0.3,
      micaColor: "#a0a0b0",
    },
  },
  {
    id: "volcanic",
    name: "Volcanic",
    description: "Porous igneous rock with vesicular texture and rough surface",
    params: {
      baseColor: "#2e2828",
      secondaryColor: "#1a1616",
      displacementStrength: 0.4,
      displacementFrequency: 3.5,
      displacementOctaves: 7,
      surfaceRoughness: 0.95,
      surfacePitting: 0.55,
      surfaceBumpScale: 0.06,
      erosionStrength: 0.08,
      roughness: 0.92,
      baseColorVariation: 0.1,
      emissiveStrength: 0.02,
    },
  },
];
