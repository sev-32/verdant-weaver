export type RockParams = Record<string, number | string | boolean>;

export type RockPresetId = "granite" | "sandstone" | "basalt" | "limestone" | "slate" | "volcanic" | "obsidian" | "marble" | "quartzite" | "pumice" | "gneiss" | "schist" | "conglomerate" | "chalk" | "flint" | "travertine" | "tuff" | "dolomite" | "serpentinite" | "mudstone" | "jasper" | "mountain-wall" | "cliff-face" | "sea-stack";

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
  scaleXYZ: [number, number, number];
  mirrorX: boolean;
  mirrorZ: boolean;
  visible: boolean;
  locked: boolean;
  label: string;
}

// ─────────────────────────────────────────────────────────────────────────
// Manual Shape Builder
// Compose primitives + metaballs into a base shape, then let the rock
// engine deform / texture it. Fidelity sliders control how strongly the
// procedural pipeline is allowed to deviate from the manual silhouette.
// ─────────────────────────────────────────────────────────────────────────
export type BuilderShapeKind =
  | "box"
  | "sphere"
  | "cylinder"
  | "cone"
  | "metaball";

export interface BuilderShape {
  id: string;
  kind: BuilderShapeKind;
  /** "subtract" carves volume away (CSG difference). Metaballs ignore this. */
  op: "add" | "subtract";
  position: [number, number, number];
  /** Euler radians */
  rotation: [number, number, number];
  /** Half-size (box) / radii (sphere/cylinder/cone) per axis */
  scale: [number, number, number];
  /** Metaball field radius (only used when kind==='metaball') */
  blobRadius: number;
  /** Metaball influence weight (positive = bulge, negative = pit) */
  blobStrength: number;
  visible: boolean;
  label: string;
}

export const DEFAULT_BUILDER_SHAPE: Omit<BuilderShape, "id" | "label"> = {
  kind: "sphere",
  op: "add",
  position: [0, 0, 0],
  rotation: [0, 0, 0],
  scale: [1, 1, 1],
  blobRadius: 0.8,
  blobStrength: 1.0,
  visible: true,
};

export const DEFAULT_ROCK_PARAMS: RockParams = {
  // ═══════════════════════════════════════
  // SHAPE & GEOMETRY
  // ═══════════════════════════════════════
  rockType: "boulder", // boulder | cliff | pillar | arch | spire | slab | outcrop | mountain-wall | cave | stack | tor | pinnacle | mesa | butte | hoodoo
  scale: 1.5,
  scaleX: 1.0,
  scaleY: 1.0,
  scaleZ: 1.0,
  subdivisions: 5,
  seed: 42,
  groundEmbed: 0.15,
  rotation: 0,

  // ═══════════════════════════════════════
  // MANUAL SHAPE BUILDER
  // When enabled, the icosphere is replaced by the SDF of the user-built
  // composition (primitives + metaballs). Fidelity sliders control how
  // much the procedural pipeline is allowed to deviate from that base.
  // ═══════════════════════════════════════
  builderEnabled: false,
  /** 0 = full procedural freedom, 1 = silhouette is locked */
  builderSilhouetteFidelity: 0.55,
  /** 0 = no surface noise, 1 = full surface displacement */
  builderSurfaceFidelity: 1.0,
  /** 0 = no erosion changes, 1 = full erosion influence */
  builderErosionFidelity: 1.0,
  /** Metaball blend smoothness (k for smin) */
  builderMetaballSmoothness: 0.35,
  /** Show wireframe overlay of builder primitives in viewport */
  builderShowOverlay: true,
  /** Resolution multiplier for surface sampling (icosphere subs already drives this) */
  builderSampleResolution: 1.0,

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
  // Advanced shape
  flattenTop: 0.0,
  flattenBottom: 0.0,
  concavity: 0.0,
  overhangStrength: 0.0,
  overhangHeight: 0.5,
  overhangCurve: 0.3,
  archWidth: 0.0,
  archHeight: 0.5,
  archThickness: 0.3,
  hollowStrength: 0.0,
  hollowDepth: 0.5,
  hollowRadius: 0.4,
  shelfCount: 0,
  shelfHeight: 0.2,
  shelfDepth: 0.1,
  pinnacleSharpness: 0.0,
  pinnacleCount: 1,
  mushroomCap: 0.0,
  mushroomNeck: 0.5,

  // ═══════════════════════════════════════
  // TERRAIN / MOUNTAIN
  // ═══════════════════════════════════════
  terrainMode: false,
  terrainWidth: 10.0,
  terrainDepth: 10.0,
  terrainHeight: 3.0,
  terrainResolution: 128,
  terrainRidgeStrength: 0.0,
  terrainRidgeFrequency: 2.0,
  terrainRidgeSharpness: 0.5,
  terrainRidgeLacunarity: 2.2,
  terrainValleyDepth: 0.0,
  terrainValleyWidth: 0.5,
  terrainPeakCount: 1,
  terrainPeakSharpness: 0.5,
  terrainPeakHeight: 1.0,
  terrainErosionStrength: 0.0,
  terrainErosionThermal: 0.0,
  terrainErosionHydraulic: 0.0,
  terrainSedimentDeposit: 0.0,
  terrainTerraceStrength: 0.0,
  terrainTerraceCount: 5,
  terrainTerraceSharpness: 0.5,
  terrainCliffStrength: 0.0,
  terrainCliffAngle: 75,
  terrainCliffNoise: 0.3,
  terrainCliffFaceDetail: 0.5,
  terrainStrataStrength: 0.0,
  terrainStrataLayers: 8,
  terrainStrataWarp: 0.2,
  terrainStrataColors: 3,
  terrainStrataColor1: "#8a7a60",
  terrainStrataColor2: "#6a5a40",
  terrainStrataColor3: "#4a3a28",
  terrainOverhangEnabled: false,
  terrainCaveEnabled: false,
  terrainCaveDepth: 2.0,
  terrainCaveRadius: 0.8,
  terrainCaveNoise: 0.3,
  terrainScreeStrength: 0.0,
  terrainScreeSize: 0.3,
  terrainScreeAngle: 35,
  terrainTalus: 0.0,
  terrainTalusAngle: 30,
  terrainSnowLine: 0.0,
  terrainSnowLineHeight: 0.7,
  terrainTreeLine: 0.0,
  terrainTreeLineHeight: 0.5,
  terrainGrassLine: 0.0,
  terrainGrassLineHeight: 0.3,

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
  displacementRidged: false,
  displacementRidgedOffset: 1.0,
  displacementRidgedGain: 2.0,
  displacementBillowed: false,
  displacementSwiss: false,
  displacementSwissWarp: 0.3,
  displacementVoronoiBlend: 0.0,
  displacementVoronoiScale: 2.0,
  displacementRadialFalloff: 0.0,
  displacementAxialBias: 0.0,
  displacementAxialAxis: "y",
  // Secondary displacement
  secondaryDisplacementStrength: 0.0,
  secondaryDisplacementFrequency: 4.0,
  secondaryDisplacementOctaves: 3,
  // Micro displacement
  microDisplacementStrength: 0.0,
  microDisplacementFrequency: 12.0,
  microDisplacementOctaves: 2,
  // Directional displacement
  directionalDisplacementStrength: 0.0,
  directionalDisplacementX: 0.0,
  directionalDisplacementY: 1.0,
  directionalDisplacementZ: 0.0,
  directionalDisplacementFalloff: 0.5,

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
  surfaceChiselMarks: 0.0,
  surfaceChiselScale: 4.0,
  surfaceChiselDepth: 0.3,
  surfaceToolMarks: 0.0,
  surfaceToolMarkAngle: 0.0,
  surfaceConchoidal: 0.0,
  surfaceConchoidalScale: 3.0,
  surfaceGloss: 0.0,
  surfaceGlossPatches: 0.3,
  surfaceExfoliation: 0.0,
  surfaceExfoliationLayers: 3,
  surfaceExfoliationDepth: 0.1,
  surfaceSpalling: 0.0,
  surfaceSpallingSize: 0.4,
  surfaceSpallingDepth: 0.2,

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
  erosionWindDirection: 0.0,
  erosionWindStrength: 0.0,
  erosionWindAbrasion: 0.0,
  erosionSolutionPockets: 0.0,
  erosionSolutionScale: 3.0,
  erosionTidalNotch: 0.0,
  erosionTidalHeight: 0.3,
  erosionTidalWidth: 0.2,
  erosionGlacial: 0.0,
  erosionGlacialScratch: 0.0,
  erosionGlacialPolish: 0.0,
  erosionKarst: 0.0,
  erosionKarstScale: 2.0,
  erosionKarstDepth: 0.5,
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
  fractureType: "voronoi",  // voronoi | linear | conchoidal | columnar | radial | dendritic | polygonal
  fractureSecondary: 0.0,
  fractureSecondaryScale: 6.0,
  fractureFill: 0.0,
  fractureFillColor: "#a89870",
  fractureFillRoughness: 0.6,
  fractureWeathering: 0.0,
  fractureStaining: 0.0,
  fractureStainColor: "#5a4a38",
  // Columnar jointing (basalt)
  columnarJointStrength: 0.0,
  columnarJointSides: 6,
  columnarJointScale: 0.8,
  columnarJointRegularity: 0.7,
  columnarJointHeight: 1.0,
  columnarJointTaper: 0.0,
  // Exfoliation joints
  exfoliationJointStrength: 0.0,
  exfoliationJointLayers: 4,
  exfoliationJointSpacing: 0.2,
  exfoliationJointCurve: 0.5,

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
  layeringFault: 0.0,
  layeringFaultOffset: 0.2,
  layeringFaultAngle: 45,
  layeringFold: 0.0,
  layeringFoldAmplitude: 0.3,
  layeringFoldWavelength: 2.0,
  layeringCrossBedding: 0.0,
  layeringCrossBeddingAngle: 30,
  layeringGradedBedding: 0.0,
  layeringUncFormity: 0.0,
  layeringDifferentialErosion: 0.0,

  // ═══════════════════════════════════════
  // FOLIATION (metamorphic)
  // ═══════════════════════════════════════
  foliationStrength: 0.0,
  foliationAngle: 0,
  foliationWaviness: 0.2,
  foliationSpacing: 0.5,
  foliationType: "schistosity", // schistosity | gneissic | phyllitic | slaty
  foliationColor: "#4a4a52",
  foliationContrast: 0.3,
  foliationMica: 0.0,
  foliationGarnet: 0.0,
  foliationGarnetColor: "#8b2020",
  foliationGarnetSize: 0.3,

  // ═══════════════════════════════════════
  // MATERIAL / PBR
  // ═══════════════════════════════════════
  baseColor: "#7a7a72",
  baseColorVariation: 0.15,
  secondaryColor: "#5a5852",
  tertiaryColor: "#8a8678",
  tertiaryColorStrength: 0.0,
  quaternaryColor: "#9a9488",
  quaternaryColorStrength: 0.0,
  colorNoiseScale: 5.0,
  colorNoiseStrength: 0.1,
  metalness: 0.02,
  roughness: 0.88,
  roughnessVariation: 0.0,
  roughnessNoiseScale: 4.0,
  metalnessVariation: 0.0,
  emissiveStrength: 0.0,
  emissiveColor: "#ff4400",
  emissivePulse: 0.0,
  emissivePulseSpeed: 1.0,
  subsurfaceScattering: 0.0,
  subsurfaceColor: "#d4a870",
  subsurfaceRadius: 0.5,
  anisotropy: 0.0,
  anisotropyAngle: 0.0,
  clearcoatStrength: 0.0,
  clearcoatRoughness: 0.3,
  sheenStrength: 0.0,
  sheenColor: "#ffffff",
  iridescenceStrength: 0.0,
  iridescenceIOR: 1.5,
  iridescenceThickness: 0.3,
  specularStrength: 1.0,
  specularColor: "#ffffff",
  transmissionStrength: 0.0,
  transmissionColor: "#ffffff",
  ior: 1.5,
  thicknessFactor: 0.0,
  normalMapStrength: 1.0,
  displacementMapStrength: 0.0,
  aoStrength: 1.0,
  aoRadius: 0.5,
  cavityStrength: 0.0,
  cavityWidth: 0.5,

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
  crystallineClusterCount: 1,
  crystallineClusterSpread: 0.5,
  crystallineGrowthDirection: 0.0,
  crystallineTransparency: 0.0,
  crystallineInternalFractures: 0.0,

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
  quartzSmoky: 0.0,
  quartzRose: 0.0,
  quartzAmethyst: 0.0,
  quartzCitrine: 0.0,
  quartzPhantom: 0.0,
  quartzRutilated: 0.0,

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
  micaType: "muscovite", // muscovite | biotite | lepidolite | phlogopite
  micaAlignment: 0.5,
  micaSparkle: 0.0,

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
  veinType: "calcite", // calcite | quartz | pyrite | gold | copper | iron
  veinParallel: 0.0,
  veinParallelAngle: 0,
  veinNetworkDensity: 0.0,
  veinStockwork: 0.0,
  veinBoudinage: 0.0,
  veinPtygmatic: 0.0,
  veinFilled: true,
  veinFillRoughness: 0.3,

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
  rustBleed: 0.0,
  rustBleedDirection: 0.0,
  rustManganese: 0.0,
  rustManganeseColor: "#1a1a1a",
  rustDesertVarnish: 0.0,
  rustDesertVarnishColor: "#3a2a1a",

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
  waterFlowChannel: 0.0,
  waterFlowDirection: 0.0,
  waterFlowMoss: 0.0,
  waterSplash: 0.0,
  waterSplashRadius: 0.5,
  waterPooling: 0.0,
  waterPoolColor: "#2a4a3a",
  waterPoolReflection: 0.5,

  // ═══════════════════════════════════════
  // SALT / MINERAL CRUST
  // ═══════════════════════════════════════
  saltCrustStrength: 0.0,
  saltCrustColor: "#e8e8e0",
  saltCrustScale: 6.0,
  saltCrustThreshold: 0.6,
  saltCrystals: 0.0,
  saltCrystalSize: 0.3,
  calciteCrust: 0.0,
  calciteCrustColor: "#f0e8d0",
  gypsumCrust: 0.0,
  gypsumRosette: 0.0,

  // ═══════════════════════════════════════
  // MOSS (multiple types)
  // ═══════════════════════════════════════
  mossColor: "#3a5a28",
  mossSecondaryColor: "#2a4a1e",
  mossThreshold: 0.6,
  mossCoverage: 0.0,
  mossType: "clump",        // clump | sheet | drape | stringy | cushion | feather | sphagnum | haircap | peat
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
  mossFruitingBodies: 0.0,
  mossFruitingColor: "#6a4a28",
  mossDeadPatches: 0.0,
  mossDeadColor: "#7a6a48",
  mossBlending: 0.5,
  mossOvergrowth: 0.0,

  // ═══════════════════════════════════════
  // LICHEN (multiple types)
  // ═══════════════════════════════════════
  lichenStrength: 0.0,
  lichenColor: "#b8c86a",
  lichenSecondaryColor: "#98a84a",
  lichenScale: 4.0,
  lichenThreshold: 0.5,
  lichenType: "crustose",   // crustose | foliose | fruticose | map | powdery | areolate | bullate | umbilicate
  lichenCircularity: 0.5,
  lichenEdgeColor: "#c8d878",
  lichenEdgeWidth: 0.1,
  lichenAge: 0.5,
  lichenDensity: 0.5,
  lichenElevation: 0.3,
  lichenPreferExposed: 0.5,
  lichenSoredia: 0.0,
  lichenApothecia: 0.0,
  lichenApotheciaColor: "#3a2a1a",
  lichenMultiSpecies: 0.0,
  lichenSpecies2Color: "#d8a848",
  lichenSpecies3Color: "#888888",
  lichenCompetition: 0.3,

  // ═══════════════════════════════════════
  // ALGAE
  // ═══════════════════════════════════════
  algaeStrength: 0.0,
  algaeColor: "#1a3a12",
  algaeScale: 3.0,
  algaeWetness: 0.5,
  algaeThreshold: 0.4,
  algaeSliminess: 0.3,
  algaeType: "green", // green | red | brown | blue-green | diatom
  algaeBiofilm: 0.0,
  algaeStreaks: 0.0,
  algaeStreakDirection: 0.0,

  // ═══════════════════════════════════════
  // FUNGUS / MUSHROOMS
  // ═══════════════════════════════════════
  fungusStrength: 0.0,
  fungusColor: "#c8a868",
  fungusType: "bracket", // bracket | crust | cup | jelly | coral
  fungusSize: 0.3,
  fungusDensity: 0.3,
  fungusPreferDead: 0.5,
  fungusPreferShade: 0.5,
  fungusMycelium: 0.0,
  fungusMyceliumColor: "#e8e0d0",
  fungusGlow: 0.0,
  fungusGlowColor: "#88ff88",

  // ═══════════════════════════════════════
  // VINES / IVY / ROOTS
  // ═══════════════════════════════════════
  vineStrength: 0.0,
  vineType: "ivy", // ivy | creeper | tendril | root | aerial-root | liana
  vineColor: "#2a5a18",
  vineDensity: 0.3,
  vineThickness: 0.1,
  vineBranching: 0.3,
  vineLeafDensity: 0.5,
  vineLeafColor: "#3a6a28",
  vineLeafSize: 0.3,
  vineGrowthDirection: 0.5, // 0=down 1=up
  vineAge: 0.5,
  vineDead: 0.0,
  vineDeadColor: "#5a4a2a",
  vineRootExposure: 0.0,
  vineFlowers: 0.0,
  vineFlowerColor: "#d84888",
  vineBerries: 0.0,
  vineBerryColor: "#2828a8",

  // ═══════════════════════════════════════
  // SNOW / ICE / FROST
  // ═══════════════════════════════════════
  snowStrength: 0.0,
  snowColor: "#f0f0f8",
  snowThreshold: 0.5,
  snowSharpness: 0.3,
  snowDrift: 0.2,
  snowDriftDirection: 0.0,
  snowMelt: 0.0,
  snowMeltDrip: 0.0,
  snowDirty: 0.0,
  snowDirtyColor: "#c8c0b0",
  snowIcicles: 0.0,
  snowIcicleLength: 0.3,
  iceStrength: 0.0,
  iceColor: "#c8d8f0",
  iceThickness: 0.3,
  iceTranslucency: 0.5,
  iceCracking: 0.0,
  iceBubbles: 0.0,
  frostStrength: 0.0,
  frostScale: 8.0,
  frostColor: "#e0e8f0",
  frostPattern: "fern", // fern | needle | rime | hoar
  frostThickness: 0.2,

  // ═══════════════════════════════════════
  // DUST / SEDIMENT / ASH
  // ═══════════════════════════════════════
  dustStrength: 0.0,
  dustColor: "#b8a890",
  dustThreshold: 0.4,
  dustGravity: 0.7,
  dustThickness: 0.3,
  dustWindBlown: 0.0,
  dustWindDirection: 0.0,
  sedimentStrength: 0.0,
  sedimentColor: "#8a7a60",
  sedimentHeight: 0.3,
  sedimentGrainSize: 0.5,
  sedimentLayering: 0.0,
  ashStrength: 0.0,
  ashColor: "#505050",
  ashCoverage: 0.3,
  ashThickness: 0.2,
  ashVolcanic: false,
  mudStrength: 0.0,
  mudColor: "#5a4a32",
  mudCracking: 0.0,
  mudCrackScale: 3.0,
  mudWet: 0.5,
  sandStrength: 0.0,
  sandColor: "#d8c8a0",
  sandGrainSize: 0.5,
  sandRipples: 0.0,
  sandRippleScale: 5.0,
  sandWindBlown: 0.0,

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
  ageWearEdges: 0.0,
  ageStaining: 0.0,
  ageMineralDeposit: 0.0,
  ageMineralColor: "#e0d8c0",

  // ═══════════════════════════════════════
  // ENVIRONMENT INTERACTION
  // ═══════════════════════════════════════
  groundMossCoverage: 0.0,
  groundMossHeight: 0.1,
  buriedDepth: 0.0,
  soilLine: 0.0,
  soilColor: "#4a3828",
  soilSplash: 0.0,
  soilSplashHeight: 0.2,
  rootExposure: 0.0,
  rootColor: "#3a2a18",
  waterlineHeight: 0.0,
  waterlineTide: 0.0,
  barnacleStrength: 0.0,
  barnacleScale: 0.3,
  barnacleColor: "#c8c0b0",
  seaweedStrength: 0.0,
  seaweedColor: "#1a4a18",
  coralStrength: 0.0,
  coralColor: "#e8a888",
  coralType: "encrusting", // encrusting | branching | brain | fan

  // ═══════════════════════════════════════
  // CSG MERGE SETTINGS
  // ═══════════════════════════════════════
  csgEnabled: false,
  csgMode: "union", // union | intersection | difference | blend
  csgCrackWidth: 0.08,
  csgCrackDepth: 0.15,
  csgCrackNoise: 0.5,
  csgDisplacementStrength: 0.2,
  csgMossAtSeam: 0.0,
  csgMossAtSeamColor: "#3a5a28",
  csgBlendRadius: 0.3,
  csgSeamRoughness: 0.9,
  csgSeamDarkening: 0.2,
  csgSnapToSurface: false,
  csgAutoOverlap: 0.1,
  csgMergeNormals: true,
  csgSeamWeathering: 0.0,
  csgSeamMineralDeposit: 0.0,
  csgSeamMineralColor: "#c8b890",
  csgFractureAtSeam: 0.0,
  csgFractureAtSeamDepth: 0.1,
  csgStacking: false,
  csgStackGravity: true,
  csgPenetration: 0.0,
  csgSmoothUnion: 0.0,

  // ═══════════════════════════════════════
  // SCENE MANAGEMENT
  // ═══════════════════════════════════════
  sceneScatterEnabled: false,
  sceneScatterCount: 10,
  sceneScatterRadius: 5.0,
  sceneScatterMinScale: 0.3,
  sceneScatterMaxScale: 1.5,
  sceneScatterRandomRotation: true,
  sceneScatterSeed: 42,
  sceneScatterAvoidOverlap: true,
  sceneScatterSizeVariation: 0.5,
  sceneScatterShapeVariation: 0.3,
  sceneArrayEnabled: false,
  sceneArrayCountX: 3,
  sceneArrayCountZ: 3,
  sceneArraySpacingX: 2.5,
  sceneArraySpacingZ: 2.5,
  sceneArrayJitter: 0.0,
  sceneClusterEnabled: false,
  sceneClusterCount: 3,
  sceneClusterTightness: 0.5,
  sceneClusterSizeDropoff: 0.3,
  sceneFocalPoint: false,
  sceneFocalX: 0,
  sceneFocalZ: 0,
  sceneGravitySettle: false,

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
  toneMappingType: "aces",   // aces | reinhard | cineon | linear | agx | neutral
  fogDensity: 0.02,
  fogColor: "#1a1a2e",
  fogNear: 5.0,
  fogFar: 50.0,
  fogType: "exponential", // exponential | linear
  enableSSAO: false,
  ssaoRadius: 0.5,
  ssaoIntensity: 1.0,
  ssaoSamples: 16,
  ssaoBias: 0.025,
  enableBloom: false,
  bloomThreshold: 0.9,
  bloomStrength: 0.3,
  bloomRadius: 0.5,
  enableDOF: false,
  dofFocalLength: 5.0,
  dofAperture: 0.025,
  dofBokehScale: 3.0,
  enableVignette: false,
  vignetteIntensity: 0.5,
  vignetteOffset: 0.5,
  enableChromaticAberration: false,
  chromaticAberrationOffset: 0.002,
  enableFilmGrain: false,
  filmGrainIntensity: 0.3,
  enableColorGrading: false,
  colorGradingLift: 0.0,
  colorGradingGamma: 1.0,
  colorGradingGain: 1.0,
  colorGradingSaturation: 1.0,
  colorGradingContrast: 1.0,
  colorTemperature: 6500,
  colorTint: 0.0,
  antialiasType: "msaa",     // msaa | fxaa | smaa | taa | none
  shadowBias: -0.001,
  shadowNormalBias: 0.002,
  shadowRadius: 1.0,
  shadowMapType: "pcfsoft", // basic | pcf | pcfsoft | vsm
  envMapIntensity: 1.0,
  envMapRotation: 0,
  groundReflection: 0.0,
  groundReflectionBlur: 0.5,
  gridOpacity: 0.25,
  gridSize: 30,
  gridDivisions: 30,
  showAxesHelper: false,
  showStats: false,
  maxTextureSize: 2048,
  anisotropicFiltering: 4,
  logarithmicDepthBuffer: false,
  gammaCorrection: true,
  enableSSR: false,
  ssrMaxDistance: 10.0,
  ssrThickness: 0.018,
  enableGodRays: false,
  godRayIntensity: 0.5,
  godRayDecay: 0.95,
  enableMotionBlur: false,
  motionBlurIntensity: 0.5,
  renderScale: 1.0,
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
      erosionKarst: 0.2,
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
      foliationStrength: 0.5, foliationType: "slaty",
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
      surfaceConchoidal: 0.5,
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
      foliationStrength: 0.6, foliationType: "gneissic",
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
      foliationStrength: 0.7, foliationType: "schistosity", foliationMica: 0.5,
    },
  },
  {
    id: "conglomerate",
    name: "Conglomerate",
    description: "Sedimentary rock with rounded pebbles in a matrix",
    params: {
      baseColor: "#8a7a68", secondaryColor: "#6a5a48",
      tertiaryColor: "#a89878", tertiaryColorStrength: 0.3,
      displacementStrength: 0.3, displacementFrequency: 3.0, displacementOctaves: 4,
      surfaceRoughness: 0.88, surfacePitting: 0.15,
      roughness: 0.9, baseColorVariation: 0.25,
      colorNoiseScale: 2.0, colorNoiseStrength: 0.2,
    },
  },
  {
    id: "chalk",
    name: "Chalk",
    description: "Soft white limestone with smooth texture",
    params: {
      baseColor: "#f0ece4", secondaryColor: "#e0dcd4",
      displacementStrength: 0.15, displacementFrequency: 1.0, displacementOctaves: 3,
      surfaceRoughness: 0.95, surfacePitting: 0.1,
      roughness: 0.98, baseColorVariation: 0.04,
      erosionStrength: 0.4, erosionSmoothing: 0.4,
      dustStrength: 0.2,
    },
  },
  {
    id: "flint",
    name: "Flint",
    description: "Hard cryptocrystalline quartz with conchoidal fracture",
    params: {
      baseColor: "#2a2a2e", secondaryColor: "#1a1a22",
      displacementStrength: 0.1, displacementFrequency: 1.5,
      surfaceRoughness: 0.2, roughness: 0.18,
      fractureStrength: 0.4, fractureType: "conchoidal",
      clearcoatStrength: 0.4, specularStrength: 1.5,
      surfaceConchoidal: 0.6, surfaceConchoidalScale: 2.5,
    },
  },
  {
    id: "travertine",
    name: "Travertine",
    description: "Banded calcium carbonate with porous texture",
    params: {
      baseColor: "#d8c8a8", secondaryColor: "#c8b898",
      displacementStrength: 0.18, displacementFrequency: 1.5,
      surfaceRoughness: 0.6, surfacePitting: 0.4, surfacePittingSize: 0.6,
      layeringStrength: 0.6, layeringFrequency: 15, layeringWarp: 0.15,
      roughness: 0.55, baseColorVariation: 0.08,
      calciteCrust: 0.3,
    },
  },
  {
    id: "tuff",
    name: "Tuff",
    description: "Consolidated volcanic ash with embedded fragments",
    params: {
      baseColor: "#a89888", secondaryColor: "#887868",
      displacementStrength: 0.25, displacementFrequency: 2.5, displacementOctaves: 5,
      surfaceRoughness: 0.92, surfacePitting: 0.35,
      roughness: 0.9, baseColorVariation: 0.15,
      ashVolcanic: true, ashStrength: 0.1,
    },
  },
  {
    id: "dolomite",
    name: "Dolomite",
    description: "Carbonate mineral rock with sugary texture",
    params: {
      baseColor: "#c8c0b0", secondaryColor: "#b0a898",
      displacementStrength: 0.2, displacementFrequency: 1.8,
      surfaceRoughness: 0.75, surfaceGranularity: 0.5, surfaceGranularityScale: 15,
      roughness: 0.8, baseColorVariation: 0.06,
      layeringStrength: 0.3, layeringFrequency: 8,
    },
  },
  {
    id: "serpentinite",
    name: "Serpentinite",
    description: "Dark green metamorphic rock with waxy lustre",
    params: {
      baseColor: "#2a4a28", secondaryColor: "#1a3a18",
      tertiaryColor: "#4a6a48", tertiaryColorStrength: 0.3,
      displacementStrength: 0.2, displacementFrequency: 2.0,
      surfaceRoughness: 0.45, roughness: 0.4,
      veinStrength: 0.4, veinColor: "#e8e0c8", veinThickness: 0.03,
      sheenStrength: 0.2, sheenColor: "#88a888",
      surfacePolyshStrength: 0.3,
    },
  },
  {
    id: "mudstone",
    name: "Mudstone",
    description: "Fine-grained sedimentary rock, smooth and uniform",
    params: {
      baseColor: "#6a5a48", secondaryColor: "#5a4a38",
      displacementStrength: 0.15, displacementFrequency: 1.2, displacementOctaves: 3,
      surfaceRoughness: 0.85, roughness: 0.9,
      erosionStrength: 0.3, erosionSmoothing: 0.3,
      mudCracking: 0.3, mudCrackScale: 4.0,
    },
  },
  {
    id: "jasper",
    name: "Jasper",
    description: "Opaque chalcedony with rich banded patterns",
    params: {
      baseColor: "#8b2020", secondaryColor: "#6a1818",
      tertiaryColor: "#c8a048", tertiaryColorStrength: 0.4,
      displacementStrength: 0.1, displacementFrequency: 1.0,
      surfaceRoughness: 0.3, roughness: 0.25,
      layeringStrength: 0.5, layeringFrequency: 20, layeringWarp: 0.4,
      clearcoatStrength: 0.3, specularStrength: 1.3,
      surfacePolyshStrength: 0.5,
    },
  },
  {
    id: "mountain-wall",
    name: "Mountain Wall",
    description: "Massive cliff face with strata, overhangs and scree",
    params: {
      terrainMode: true, terrainWidth: 12, terrainDepth: 3, terrainHeight: 8,
      terrainCliffStrength: 0.7, terrainCliffAngle: 80,
      terrainStrataStrength: 0.5, terrainStrataLayers: 12,
      terrainScreeStrength: 0.4, terrainOverhangEnabled: true,
      baseColor: "#7a7268", secondaryColor: "#5a5248",
      displacementStrength: 0.4, displacementFrequency: 1.5,
      erosionStrength: 0.3, roughness: 0.88,
      layeringStrength: 0.4, layeringFrequency: 10,
    },
  },
  {
    id: "cliff-face",
    name: "Cliff Face",
    description: "Sheer vertical rock face with fractures and staining",
    params: {
      rockType: "cliff", scaleY: 2.5, scaleX: 2.0,
      baseColor: "#8a8278", secondaryColor: "#6a6258",
      displacementStrength: 0.3, displacementFrequency: 2.0,
      fractureStrength: 0.3, fractureDensity: 6,
      waterStainStrength: 0.3, waterStainDrip: 0.4,
      rustStrength: 0.15, rustDrip: 0.3,
      erosionStrength: 0.2, roughness: 0.85,
    },
  },
  {
    id: "sea-stack",
    name: "Sea Stack",
    description: "Isolated coastal rock column shaped by waves",
    params: {
      rockType: "stack", scaleY: 1.8,
      baseColor: "#6a6258", secondaryColor: "#4a4238",
      displacementStrength: 0.25, displacementFrequency: 2.5,
      erosionStrength: 0.5, erosionSmoothing: 0.2,
      erosionTidalNotch: 0.4, erosionTidalHeight: 0.3,
      waterlineHeight: 0.3, barnacleStrength: 0.3,
      seaweedStrength: 0.2, waterStainStrength: 0.2,
      roughness: 0.82, saltCrustStrength: 0.15,
    },
  },
];
