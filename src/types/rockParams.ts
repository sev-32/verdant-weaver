export type RockParams = Record<string, number | string | boolean>;

export type RockPresetId = "granite" | "sandstone" | "basalt" | "limestone" | "slate" | "volcanic" | "obsidian" | "marble" | "quartzite" | "pumice" | "gneiss" | "schist";

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
  // ═══════════════════════════════════════
  // SHAPE & GEOMETRY
  // ═══════════════════════════════════════
  rockType: "boulder",
  scale: 1.5,
  scaleX: 1.0,
  scaleY: 1.0,
  scaleZ: 1.0,
  subdivisions: 5,
  seed: 42,
  groundEmbed: 0.15,
  rotation: 0,
  // Asymmetry
  asymmetryX: 0.0,
  asymmetryY: 0.0,
  asymmetryZ: 0.0,
  // Squash/Stretch
  squash: 0.0,
  taper: 0.0,
  twist: 0.0,
  bend: 0.0,
  // Edge rounding
  edgeSoftness: 0.0,
  edgeBevel: 0.0,

  // ═══════════════════════════════════════
  // DISPLACEMENT
  // ═══════════════════════════════════════
  displacementStrength: 0.35,
  displacementFrequency: 1.8,
  displacementOctaves: 6,
  displacementLacunarity: 2.1,
  displacementPersistence: 0.48,
  displacementWarpStrength: 0.0,
  displacementWarpFrequency: 1.0,
  // Secondary displacement
  secondaryDisplacementStrength: 0.0,
  secondaryDisplacementFrequency: 4.0,
  secondaryDisplacementOctaves: 3,
  // Micro displacement
  microDisplacementStrength: 0.0,
  microDisplacementFrequency: 12.0,
  microDisplacementOctaves: 2,

  // ═══════════════════════════════════════
  // SURFACE DETAIL
  // ═══════════════════════════════════════
  surfaceRoughness: 0.85,
  surfaceBumpScale: 0.04,
  surfacePitting: 0.15,
  surfacePittingSize: 0.5,
  surfacePittingDepth: 0.4,
  surfaceScratchStrength: 0.0,
  surfaceScratchFrequency: 8.0,
  surfaceScratchDirection: 0.0,
  surfaceGranularity: 0.0,
  surfaceGranularityScale: 20.0,
  surfacePolyshStrength: 0.0,
  surfacePolishAreaSize: 0.5,

  // ═══════════════════════════════════════
  // EROSION
  // ═══════════════════════════════════════
  erosionStrength: 0.25,
  erosionSharpness: 1.4,
  erosionDirection: 0.7,
  erosionChannels: 0.3,
  erosionSmoothing: 0.15,
  erosionChannelWidth: 0.3,
  erosionChannelDepth: 0.5,
  erosionRiverlets: 0.0,
  erosionRiverletsScale: 6.0,
  // Thermal erosion (freeze-thaw)
  thermalErosionStrength: 0.0,
  thermalCrackDepth: 0.15,
  thermalCrackWidth: 0.08,
  thermalCrackDensity: 4,
  thermalCrackDirection: 0.5,
  // Chemical weathering
  chemicalWeatheringStrength: 0.0,
  chemicalWeatheringDepth: 0.3,
  chemicalWeatheringPattern: 0.5,
  chemicalPittingStrength: 0.0,
  chemicalPittingScale: 5.0,

  // ═══════════════════════════════════════
  // FRACTURE
  // ═══════════════════════════════════════
  fractureStrength: 0.0,
  fractureDensity: 3,
  fractureSharpness: 2.0,
  fractureDepth: 0.12,
  fractureJaggedeness: 0.5,
  fractureOffset: 0.0,
  fractureType: "voronoi",  // voronoi | linear | conchoidal | columnar
  // Columnar jointing (basalt)
  columnarJointStrength: 0.0,
  columnarJointSides: 6,
  columnarJointScale: 0.8,
  columnarJointRegularity: 0.7,

  // ═══════════════════════════════════════
  // LAYERING (sedimentary)
  // ═══════════════════════════════════════
  layeringStrength: 0.0,
  layeringFrequency: 8,
  layeringWarp: 0.2,
  layeringThickness: 0.5,
  layeringContrast: 0.5,
  layeringAsymmetry: 0.0,
  layeringErosion: 0.0,
  layeringColorShift: 0.0,

  // ═══════════════════════════════════════
  // MATERIAL / PBR
  // ═══════════════════════════════════════
  baseColor: "#7a7a72",
  baseColorVariation: 0.15,
  secondaryColor: "#5a5852",
  tertiaryColor: "#8a8678",
  tertiaryColorStrength: 0.0,
  metalness: 0.02,
  roughness: 0.88,
  emissiveStrength: 0.0,
  emissiveColor: "#ff4400",
  subsurfaceScattering: 0.0,
  subsurfaceColor: "#d4a870",
  anisotropy: 0.0,
  anisotropyAngle: 0.0,
  clearcoatStrength: 0.0,
  clearcoatRoughness: 0.3,
  sheenStrength: 0.0,
  sheenColor: "#ffffff",
  iridescenceStrength: 0.0,
  iridescenceIOR: 1.5,
  specularStrength: 1.0,
  specularColor: "#ffffff",

  // ═══════════════════════════════════════
  // CRYSTALLINE
  // ═══════════════════════════════════════
  crystallineStrength: 0.0,
  crystallineScale: 0.3,
  crystallineColor: "#b8c4d8",
  crystallineFacets: 8,
  crystallineSharpness: 0.7,
  crystallineMetalness: 0.1,
  crystallineRoughness: 0.2,
  crystallineEmissive: 0.0,
  crystallineDispersion: 0.0,

  // ═══════════════════════════════════════
  // QUARTZ DEPOSITS
  // ═══════════════════════════════════════
  quartzStrength: 0.0,
  quartzScale: 0.4,
  quartzColor: "#e8e4d8",
  quartzRoughness: 0.15,
  quartzMetalness: 0.0,
  quartzTranslucency: 0.3,
  quartzClusterSize: 0.5,
  quartzClusterDensity: 0.5,
  quartzInclusions: 0.0,
  quartzInclusionColor: "#d4a040",

  // ═══════════════════════════════════════
  // MICA / GLITTER
  // ═══════════════════════════════════════
  micaStrength: 0.0,
  micaDensity: 12,
  micaColor: "#d4c8a0",
  micaMetalness: 0.6,
  micaSize: 0.5,
  micaAngleSpread: 0.3,
  micaFlakeRoughness: 0.1,
  micaBirefringence: 0.0,

  // ═══════════════════════════════════════
  // MINERAL VEINS
  // ═══════════════════════════════════════
  veinStrength: 0.0,
  veinScale: 2.0,
  veinColor: "#c8b890",
  veinThickness: 0.08,
  veinMetalness: 0.1,
  veinRoughness: 0.4,
  veinWaviness: 0.2,
  veinBranching: 0.0,
  veinGlow: 0.0,
  veinSecondaryColor: "#a89870",
  veinSecondaryStrength: 0.0,
  veinDepth: 0.0,

  // ═══════════════════════════════════════
  // IRON OXIDE / RUST STAINING
  // ═══════════════════════════════════════
  rustStrength: 0.0,
  rustColor: "#8b4513",
  rustSecondaryColor: "#cd853f",
  rustScale: 3.0,
  rustDrip: 0.0,
  rustDripLength: 0.5,
  rustOxidation: 0.3,
  rustPatina: 0.0,
  rustPatinaColor: "#2e8b57",

  // ═══════════════════════════════════════
  // WATER STAINING
  // ═══════════════════════════════════════
  waterStainStrength: 0.0,
  waterStainColor: "#4a4a42",
  waterStainHeight: 0.5,
  waterStainSharpness: 0.3,
  waterStainDrip: 0.0,
  wetAreaStrength: 0.0,
  wetAreaHeight: 0.3,
  wetAreaDarkening: 0.3,
  wetAreaGloss: 0.6,

  // ═══════════════════════════════════════
  // SALT / MINERAL CRUST
  // ═══════════════════════════════════════
  saltCrustStrength: 0.0,
  saltCrustColor: "#e8e8e0",
  saltCrustScale: 6.0,
  saltCrustThreshold: 0.6,
  saltCrystals: 0.0,
  saltCrystalSize: 0.3,

  // ═══════════════════════════════════════
  // MOSS (multiple types)
  // ═══════════════════════════════════════
  mossColor: "#3a5a28",
  mossSecondaryColor: "#2a4a1e",
  mossThreshold: 0.6,
  mossCoverage: 0.0,
  mossType: "clump",        // clump | sheet | drape | stringy | cushion | feather
  mossHeight: 0.3,
  mossVariation: 0.2,
  mossDensity: 0.5,
  mossEdgeSoftness: 0.3,
  mossPreferCrevices: 0.5,
  mossPreferNorth: 0.0,
  mossPreferShade: 0.3,
  mossMoisture: 0.5,
  mossAge: 0.5,
  mossSporeSpread: 0.2,

  // ═══════════════════════════════════════
  // LICHEN (multiple types)
  // ═══════════════════════════════════════
  lichenStrength: 0.0,
  lichenColor: "#b8c86a",
  lichenSecondaryColor: "#98a84a",
  lichenScale: 4.0,
  lichenThreshold: 0.5,
  lichenType: "crustose",   // crustose | foliose | fruticose | map
  lichenCircularity: 0.5,
  lichenEdgeColor: "#c8d878",
  lichenEdgeWidth: 0.1,
  lichenAge: 0.5,
  lichenDensity: 0.5,
  lichenElevation: 0.3,
  lichenPreferExposed: 0.5,

  // ═══════════════════════════════════════
  // ALGAE
  // ═══════════════════════════════════════
  algaeStrength: 0.0,
  algaeColor: "#1a3a12",
  algaeScale: 3.0,
  algaeWetness: 0.5,
  algaeThreshold: 0.4,
  algaeSliminess: 0.3,

  // ═══════════════════════════════════════
  // SNOW / ICE / FROST
  // ═══════════════════════════════════════
  snowStrength: 0.0,
  snowColor: "#f0f0f8",
  snowThreshold: 0.5,
  snowSharpness: 0.3,
  snowDrift: 0.2,
  snowDriftDirection: 0.0,
  iceStrength: 0.0,
  iceColor: "#c8d8f0",
  iceThickness: 0.3,
  iceTranslucency: 0.5,
  frostStrength: 0.0,
  frostScale: 8.0,
  frostColor: "#e0e8f0",

  // ═══════════════════════════════════════
  // DUST / SEDIMENT / ASH
  // ═══════════════════════════════════════
  dustStrength: 0.0,
  dustColor: "#b8a890",
  dustThreshold: 0.4,
  dustGravity: 0.7,
  dustThickness: 0.3,
  sedimentStrength: 0.0,
  sedimentColor: "#8a7a60",
  sedimentHeight: 0.3,
  ashStrength: 0.0,
  ashColor: "#505050",
  ashCoverage: 0.3,

  // ═══════════════════════════════════════
  // AGING / PATINA
  // ═══════════════════════════════════════
  ageStrength: 0.0,
  ageDesaturation: 0.3,
  ageDarkening: 0.2,
  ageColorShift: 0.0,
  ageCracking: 0.0,
  ageWear: 0.0,
  ageWearColor: "#a0a098",

  // ═══════════════════════════════════════
  // ENVIRONMENT INTERACTION
  // ═══════════════════════════════════════
  groundMossCoverage: 0.0,
  groundMossHeight: 0.1,
  buriedDepth: 0.0,
  soilLine: 0.0,
  soilColor: "#4a3828",

  // ═══════════════════════════════════════
  // CSG MERGE SETTINGS
  // ═══════════════════════════════════════
  csgEnabled: false,
  csgCrackWidth: 0.08,
  csgCrackDepth: 0.15,
  csgCrackNoise: 0.5,
  csgDisplacementStrength: 0.2,
  csgMossAtSeam: 0.0,
  csgMossAtSeamColor: "#3a5a28",
  csgBlendRadius: 0.3,
  csgSeamRoughness: 0.9,
  csgSeamDarkening: 0.2,

  // ═══════════════════════════════════════
  // DEVELOPER / QUALITY
  // ═══════════════════════════════════════
  wireframe: false,
  shadowQuality: 2048,
  pixelRatio: 0,             // 0 = auto
  maxSubdivisions: 6,
  showNormals: false,
  showUVs: false,
  showWireframe: false,
  showBoundingBox: false,
  showVertexColors: true,
  flatShading: false,
  toneMappingExposure: 1.0,
  toneMappingType: "aces",   // aces | reinhard | cineon | linear
  fogDensity: 0.02,
  fogColor: "#1a1a2e",
  enableSSAO: false,
  ssaoRadius: 0.5,
  ssaoIntensity: 1.0,
  enableBloom: false,
  bloomThreshold: 0.9,
  bloomStrength: 0.3,
  bloomRadius: 0.5,
  antialiasType: "msaa",     // msaa | fxaa | smaa | none
  shadowBias: -0.001,
  envMapIntensity: 1.0,
  groundReflection: 0.0,
  gridOpacity: 0.25,
  gridSize: 30,
  showAxesHelper: false,
  showStats: false,
  maxTextureSize: 2048,
  anisotropicFiltering: 4,
};

export const ROCK_PRESETS: RockPreset[] = [
  {
    id: "granite",
    name: "Granite",
    description: "Coarse-grained igneous rock with speckled surface",
    params: {
      baseColor: "#8a8580", secondaryColor: "#6e6a64",
      displacementStrength: 0.28, displacementFrequency: 2.2, displacementOctaves: 5,
      surfaceRoughness: 0.82, surfacePitting: 0.22, surfaceBumpScale: 0.035,
      erosionStrength: 0.12, erosionSharpness: 1.2,
      fractureStrength: 0.08,
      crystallineStrength: 0.12, crystallineColor: "#c8b8a8",
      baseColorVariation: 0.18, roughness: 0.85,
      quartzStrength: 0.15, micaStrength: 0.2,
      surfaceGranularity: 0.4, surfaceGranularityScale: 25.0,
    },
  },
  {
    id: "sandstone",
    name: "Sandstone",
    description: "Sedimentary rock with visible layering and warm tones",
    params: {
      baseColor: "#c4956a", secondaryColor: "#a87d52",
      displacementStrength: 0.22, displacementFrequency: 1.4, displacementOctaves: 4,
      surfaceRoughness: 0.92, surfacePitting: 0.08,
      erosionStrength: 0.42, erosionSharpness: 0.8, erosionChannels: 0.45,
      layeringStrength: 0.55, layeringFrequency: 12, layeringWarp: 0.35,
      roughness: 0.94, baseColorVariation: 0.12,
      veinStrength: 0.2, veinColor: "#d4a870",
      erosionRiverlets: 0.3, chemicalWeatheringStrength: 0.15,
    },
  },
  {
    id: "basalt",
    name: "Basalt",
    description: "Dark volcanic rock with columnar fracturing",
    params: {
      baseColor: "#3a3a3e", secondaryColor: "#2a2a2e",
      displacementStrength: 0.18, displacementFrequency: 2.8, displacementOctaves: 5,
      surfaceRoughness: 0.78, surfacePitting: 0.3,
      fractureStrength: 0.42, fractureDensity: 5, fractureSharpness: 3.0, fractureDepth: 0.18,
      roughness: 0.75, baseColorVariation: 0.06, metalness: 0.04,
      columnarJointStrength: 0.4, columnarJointSides: 6,
    },
  },
  {
    id: "limestone",
    name: "Limestone",
    description: "Pale sedimentary rock with smooth erosion patterns",
    params: {
      baseColor: "#d4cfc2", secondaryColor: "#b8b2a4",
      displacementStrength: 0.2, displacementFrequency: 1.2, displacementOctaves: 4,
      surfaceRoughness: 0.7, surfacePitting: 0.35,
      erosionStrength: 0.55, erosionSharpness: 0.6, erosionSmoothing: 0.35, erosionChannels: 0.55,
      layeringStrength: 0.3, layeringFrequency: 6,
      roughness: 0.82, baseColorVariation: 0.08,
      lichenStrength: 0.3, chemicalWeatheringStrength: 0.3, chemicalPittingStrength: 0.25,
    },
  },
  {
    id: "slate",
    name: "Slate",
    description: "Fine-grained metamorphic rock with flat cleavage planes",
    params: {
      baseColor: "#4a5058", secondaryColor: "#383e44",
      displacementStrength: 0.15, displacementFrequency: 3.2, displacementOctaves: 4,
      surfaceRoughness: 0.65, surfacePitting: 0.05,
      fractureStrength: 0.28, fractureDensity: 8, fractureSharpness: 1.5,
      layeringStrength: 0.65, layeringFrequency: 18, layeringThickness: 0.3,
      scaleY: 0.6, roughness: 0.72, metalness: 0.05, baseColorVariation: 0.05,
      micaStrength: 0.3, micaColor: "#a0a0b0",
    },
  },
  {
    id: "volcanic",
    name: "Volcanic",
    description: "Porous igneous rock with vesicular texture",
    params: {
      baseColor: "#2e2828", secondaryColor: "#1a1616",
      displacementStrength: 0.4, displacementFrequency: 3.5, displacementOctaves: 7,
      surfaceRoughness: 0.95, surfacePitting: 0.55, surfaceBumpScale: 0.06,
      erosionStrength: 0.08, roughness: 0.92, baseColorVariation: 0.1,
      emissiveStrength: 0.02,
    },
  },
  {
    id: "obsidian",
    name: "Obsidian",
    description: "Volcanic glass with conchoidal fractures and high sheen",
    params: {
      baseColor: "#0a0a10", secondaryColor: "#1a1a28",
      displacementStrength: 0.08, displacementFrequency: 1.0,
      surfaceRoughness: 0.15, surfacePitting: 0.0, surfaceBumpScale: 0.01,
      fractureStrength: 0.3, fractureType: "conchoidal",
      roughness: 0.12, metalness: 0.02, baseColorVariation: 0.03,
      clearcoatStrength: 0.6, clearcoatRoughness: 0.05,
      specularStrength: 1.8, iridescenceStrength: 0.1,
    },
  },
  {
    id: "marble",
    name: "Marble",
    description: "Metamorphic rock with elegant veining and translucent quality",
    params: {
      baseColor: "#e8e4e0", secondaryColor: "#d0ccc8",
      displacementStrength: 0.12, displacementFrequency: 1.0, displacementOctaves: 3,
      surfaceRoughness: 0.3, surfacePitting: 0.02, surfaceBumpScale: 0.01,
      roughness: 0.25, baseColorVariation: 0.05,
      veinStrength: 0.7, veinScale: 1.5, veinColor: "#6a6a6a",
      veinThickness: 0.05, veinWaviness: 0.4, veinBranching: 0.3,
      subsurfaceScattering: 0.2, subsurfaceColor: "#f0e8d8",
      surfacePolyshStrength: 0.6,
    },
  },
  {
    id: "quartzite",
    name: "Quartzite",
    description: "Hard metamorphic rock with crystalline sparkle",
    params: {
      baseColor: "#c8c0b0", secondaryColor: "#a8a090",
      displacementStrength: 0.2, displacementFrequency: 2.0,
      surfaceRoughness: 0.5, roughness: 0.45,
      quartzStrength: 0.6, quartzScale: 0.3, quartzColor: "#f0ece0",
      micaStrength: 0.35, micaDensity: 18,
      crystallineStrength: 0.25, crystallineSharpness: 0.8,
      specularStrength: 1.4,
    },
  },
  {
    id: "pumice",
    name: "Pumice",
    description: "Ultra-porous volcanic rock, extremely lightweight",
    params: {
      baseColor: "#b8b0a8", secondaryColor: "#989088",
      displacementStrength: 0.35, displacementFrequency: 4.0, displacementOctaves: 6,
      surfaceRoughness: 0.98, surfacePitting: 0.8, surfacePittingSize: 0.3, surfacePittingDepth: 0.7,
      roughness: 0.95, baseColorVariation: 0.1,
      scaleY: 0.85,
    },
  },
  {
    id: "gneiss",
    name: "Gneiss",
    description: "Banded metamorphic rock with foliated texture",
    params: {
      baseColor: "#6a6462", secondaryColor: "#4a4442",
      tertiaryColor: "#8a8682", tertiaryColorStrength: 0.4,
      displacementStrength: 0.25, displacementFrequency: 2.0,
      layeringStrength: 0.7, layeringFrequency: 10, layeringWarp: 0.5,
      layeringContrast: 0.6, layeringColorShift: 0.3,
      roughness: 0.78, baseColorVariation: 0.12,
      micaStrength: 0.15,
    },
  },
  {
    id: "schist",
    name: "Schist",
    description: "Foliated metamorphic rock with silvery sheen from mica",
    params: {
      baseColor: "#5a5852", secondaryColor: "#3a3832",
      displacementStrength: 0.22, displacementFrequency: 2.5,
      layeringStrength: 0.5, layeringFrequency: 14,
      roughness: 0.65, metalness: 0.06,
      micaStrength: 0.55, micaDensity: 20, micaColor: "#c0c0d0", micaMetalness: 0.7,
      anisotropy: 0.3, sheenStrength: 0.15, sheenColor: "#d0d0e0",
    },
  },
];
