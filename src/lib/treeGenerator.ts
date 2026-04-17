// ============================================================================
//  ProVeg Studio — Tree Generator v3 (Arbor-Terra Synthesis)
//  ---------------------------------------------------------------------------
//  Pipeline:
//    1. Sample attractor cloud inside the Crown Envelope (light field)
//    2. Grow a node-skeleton via Space Colonization (Runions)
//       - Apical dominance, phototropism, gravity, lean, photo-direction
//    3. Pipe-model radii (Da Vinci / Murray's law) from leaves -> root
//    4. Catmull-Rom path per branch for one continuous flowing tube
//    5. Continuous junction blending via metaball-style radius union
//       (NO collar geometry, NO RNG-shifting extras — math lives in the ring)
//    6. Foliage at consumed attractors + petiole-aware clusters
//    7. Roots (surface spread + secondaries), bark/fluting/buttress preserved
//
//  Param compatibility: TreeParams shape unchanged. All legacy keys still read.
//  New keys are additive with safe defaults.
// ============================================================================
import type { TreeParams } from "@/types/treeParams";

type Vec3 = [number, number, number];

// ───────────────────────────── math ─────────────────────────────────────────
const v3add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const v3sub = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const v3scale = (a: Vec3, s: number): Vec3 => [a[0] * s, a[1] * s, a[2] * s];
const v3len = (a: Vec3): number => Math.hypot(a[0], a[1], a[2]);
const v3lenSq = (a: Vec3): number => a[0] * a[0] + a[1] * a[1] + a[2] * a[2];
const v3normalize = (a: Vec3): Vec3 => { const l = v3len(a); return l > 1e-8 ? [a[0]/l, a[1]/l, a[2]/l] : [0,1,0]; };
const v3cross = (a: Vec3, b: Vec3): Vec3 => [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
const v3dot = (a: Vec3, b: Vec3): number => a[0]*b[0] + a[1]*b[1] + a[2]*b[2];
const v3lerp = (a: Vec3, b: Vec3, t: number): Vec3 => [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
const clamp = (v: number, lo: number, hi: number) => v < lo ? lo : v > hi ? hi : v;
const smoothstep = (e0: number, e1: number, x: number) => { const t = clamp((x - e0) / (e1 - e0), 0, 1); return t * t * (3 - 2 * t); };

function mulberry32(seed: number) {
  let s = seed | 0;
  return () => {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hexToRgb(hex: string): Vec3 {
  const h = hex.replace("#", "");
  return [parseInt(h.slice(0,2),16)/255, parseInt(h.slice(2,4),16)/255, parseInt(h.slice(4,6),16)/255];
}

function lerpColor(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}

function hash21(x: number, y: number): number {
  const n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
  return n - Math.floor(n);
}
function noise2(x: number, y: number): number {
  const ix = Math.floor(x), iy = Math.floor(y);
  const fx = x - ix, fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx), uy = fy * fy * (3 - 2 * fy);
  const a = hash21(ix, iy), b = hash21(ix + 1, iy);
  const c = hash21(ix, iy + 1), d = hash21(ix + 1, iy + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + d) * ux * uy;
}
function fbm2(x: number, y: number, octaves: number = 4): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) { v += amp * noise2(x * freq, y * freq); freq *= 2; amp *= 0.5; }
  return v;
}

// Catmull-Rom (centripetal) — produces one smooth curve through N points.
function catmullRom(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const t2 = t * t, t3 = t2 * t;
  const a = -0.5 * t3 + t2 - 0.5 * t;
  const b =  1.5 * t3 - 2.5 * t2 + 1.0;
  const c = -1.5 * t3 + 2.0 * t2 + 0.5 * t;
  const d =  0.5 * t3 - 0.5 * t2;
  return [
    a*p0[0] + b*p1[0] + c*p2[0] + d*p3[0],
    a*p0[1] + b*p1[1] + c*p2[1] + d*p3[1],
    a*p0[2] + b*p1[2] + c*p2[2] + d*p3[2],
  ];
}
function catmullRomTangent(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const t2 = t * t;
  const a = -1.5 * t2 + 2.0 * t - 0.5;
  const b =  4.5 * t2 - 5.0 * t;
  const c = -4.5 * t2 + 4.0 * t + 0.5;
  const d =  1.5 * t2 - 1.0 * t;
  return v3normalize([
    a*p0[0] + b*p1[0] + c*p2[0] + d*p3[0],
    a*p0[1] + b*p1[1] + c*p2[1] + d*p3[1],
    a*p0[2] + b*p1[2] + c*p2[2] + d*p3[2],
  ]);
}

// Stable orthonormal frame given a tangent (avoids gimbal flips along curve).
function stableFrame(tan: Vec3, prevUp: Vec3 | null): { right: Vec3; up: Vec3 } {
  const ref: Vec3 = prevUp ?? (Math.abs(tan[1]) > 0.99 ? [1, 0, 0] : [0, 1, 0]);
  const right = v3normalize(v3cross(tan, ref));
  const up = v3normalize(v3cross(right, tan));
  return { right, up };
}

// ───────────────────────────── species ──────────────────────────────────────
// Multipliers tuned for the new SCA-driven engine.
const SPECIES_MULS: Record<string, {
  attractorCount: number; envelopeShape: string; crownR: number; crownH: number;
  apical: number; gravity: number; photo: number; lean: number;
  pipeExp: number; tipRadius: number; trunkRoughness: number;
  leafSize: number; leafBunch: number; isConifer: boolean; isWillow: boolean;
}> = {
  PINE_CONIFER:        { attractorCount: 1.20, envelopeShape: "CONE",     crownR: 0.55, crownH: 1.00, apical: 1.45, gravity: 0.55, photo: 1.10, lean: 0.6, pipeExp: 2.30, tipRadius: 1.0, trunkRoughness: 1.10, leafSize: 0.55, leafBunch: 1.10, isConifer: true,  isWillow: false },
  SPRUCE_CONICAL:      { attractorCount: 1.30, envelopeShape: "CONE",     crownR: 0.50, crownH: 1.05, apical: 1.55, gravity: 0.45, photo: 1.05, lean: 0.4, pipeExp: 2.30, tipRadius: 1.0, trunkRoughness: 1.05, leafSize: 0.45, leafBunch: 1.20, isConifer: true,  isWillow: false },
  WILLOW_WEEPING:      { attractorCount: 1.10, envelopeShape: "UMBRELLA", crownR: 1.05, crownH: 0.95, apical: 0.65, gravity: 2.20, photo: 0.30, lean: 0.0, pipeExp: 2.45, tipRadius: 0.8, trunkRoughness: 0.95, leafSize: 0.65, leafBunch: 0.85, isConifer: false, isWillow: true  },
  BIRCH_UPRIGHT:       { attractorCount: 0.90, envelopeShape: "COLUMNAR", crownR: 0.65, crownH: 0.95, apical: 1.10, gravity: 0.85, photo: 0.95, lean: 0.3, pipeExp: 2.50, tipRadius: 0.9, trunkRoughness: 0.70, leafSize: 0.85, leafBunch: 0.95, isConifer: false, isWillow: false },
  ACACIA_SAVANNA:      { attractorCount: 1.00, envelopeShape: "UMBRELLA", crownR: 1.10, crownH: 0.55, apical: 0.45, gravity: 0.65, photo: 1.30, lean: 0.5, pipeExp: 2.60, tipRadius: 1.0, trunkRoughness: 1.00, leafSize: 0.50, leafBunch: 1.30, isConifer: false, isWillow: false },
  OAK_MAPLE:           { attractorCount: 1.05, envelopeShape: "SPHERE",   crownR: 1.00, crownH: 0.95, apical: 0.85, gravity: 1.05, photo: 0.90, lean: 0.4, pipeExp: 2.50, tipRadius: 1.0, trunkRoughness: 1.20, leafSize: 1.05, leafBunch: 1.10, isConifer: false, isWillow: false },
  BROADLEAF_DECIDUOUS: { attractorCount: 1.00, envelopeShape: "SPHERE",   crownR: 1.00, crownH: 1.00, apical: 1.00, gravity: 1.00, photo: 1.00, lean: 0.5, pipeExp: 2.49, tipRadius: 1.0, trunkRoughness: 1.00, leafSize: 1.00, leafBunch: 1.00, isConifer: false, isWillow: false },
};

// ───────────────────────────── public types ─────────────────────────────────
export interface TreeGeometry {
  wood:   { positions: number[]; normals: number[]; colors: number[]; indices: number[] };
  leaves: { positions: number[]; normals: number[]; colors: number[]; indices: number[] };
  meta:   { height: number; trunkTop: number; vertCount: number };
}

// ───────────────────────────── skeleton model ───────────────────────────────
interface Node {
  id: number;
  pos: Vec3;
  parent: number | null;
  children: number[];
  level: number;       // branching depth (0 = trunk)
  isApex: boolean;     // currently the active growing tip of a branch
  pathIdx: number;     // position along its branch (0,1,2,...)
  radius: number;      // computed by pipe model
  attractedFrom: Vec3[]; // attractors that shaped this growth direction
  consumed: Vec3[];    // attractors that were killed at this node (foliage seeds)
}

// ───────────────────────────── main entry ───────────────────────────────────
export function generateTreeGeometry(params: TreeParams, seed: number = 1337): TreeGeometry {
  const rng = mulberry32(seed);
  const getP = (k: string, alt: string, def: number | string | boolean) => params[k] ?? params[alt] ?? def;

  // -- Read params --------------------------------------------------------
  const age01 = getP("age01", "vegetation.instance.age01", 1.0) as number;
  const heightBase = getP("height", "vegetation.species.heightBase_m", 8) as number;
  const height = heightBase * (0.35 + 0.65 * age01);
  const baseRadius = (getP("baseRadius", "vegetation.trunk.baseRadius_m", 0.4) as number) * (0.55 + 0.45 * age01);
  const taperExp = getP("taperExponent", "vegetation.trunk.taperExponent", 0.7) as number;
  const flare = getP("baseFlare", "vegetation.trunk.baseFlare", 1.3) as number;
  const twistDeg = getP("twist", "vegetation.trunk.twist_deg", 0) as number;
  const trunkColorHex = getP("trunkColor", "vegetation.trunk.barkColor", "#5d4037") as string;
  const leafColorHex = getP("leafColor", "vegetation.leaves.colorBase", "#4a7c3f") as string;
  const leafColorVar = getP("leafColorVariation", "vegetation.leaves.colorVariation", 0.15) as number;
  const leafSize = getP("leafSize", "vegetation.leaves.size_m", 0.18) as number;
  const leafSizeVar = getP("leafSizeVariation", "vegetation.leaves.sizeVariation", 0.3) as number;
  const leafAspect = getP("leafAspectRatio", "vegetation.leaves.aspectRatio", 1.5) as number;
  const leafClusterSize = getP("leafClusterSize", "vegetation.leaves.clusterSize", 14) as number;
  const leafClusterSpread = getP("leafClusterSpread", "vegetation.leaves.clusterSpread", 1.0) as number;
  const leafOrientBias = getP("leafOrientationBias", "vegetation.leaves.orientationBias", 0.5) as number;
  const leafSunSeek = getP("leafSunSeeking", "vegetation.leaves.sunSeeking", 0.35) as number;
  const leafHangDeg = getP("leafHangAngle", "vegetation.leaves.hangAngle", 18) as number;
  const leafCurl = getP("leafCurl", "vegetation.leaves.curl", 0.1) as number;
  const leafSeasonalBlend = getP("leafSeasonalBlend", "vegetation.leaves.seasonalBlend", 0.0) as number;
  const leafAutumnHex = getP("leafAutumnColor", "vegetation.leaves.colorAutumn", "#c4722a") as string;
  const leafUndersideLighten = getP("leafUndersideLighten", "vegetation.leaves.undersideLighten", 0.15) as number;
  const deadLeafRatio = getP("deadLeafRatio", "vegetation.leaves.deadLeafRatio", 0.0) as number;
  const deadLeafHex = getP("deadLeafColor", "vegetation.leaves.deadLeafColor", "#8b6914") as string;

  const profileKey = (getP("speciesProfile", "vegetation.species.profile", "BROADLEAF_DECIDUOUS") as string);
  const sp = SPECIES_MULS[profileKey] ?? SPECIES_MULS.BROADLEAF_DECIDUOUS;

  const branchSeedCount = Math.max(2, Math.round((getP("branchCount", "vegetation.branching.mainBranchCount", 6) as number)));
  const apicalDom = clamp((getP("apicalDominance", "vegetation.branching.apicalDominance", 0.7) as number) * sp.apical, 0.2, 1.8);
  const angleMean = ((getP("branchAngle", "vegetation.branching.angleMean_deg", 40) as number) * Math.PI) / 180;
  const angleVar = ((getP("branchAngleVar", "vegetation.branching.angleVariance_deg", 12) as number) * Math.PI) / 180;
  const minBranchRadius = getP("minBranchRadius", "vegetation.branching.minBranchRadius", 0.005) as number;
  const crookedness = getP("trunkCrookedness", "vegetation.trunk.crookedness", 0.1) as number;
  const restLean = getP("restLean", "vegetation.wind.restLean", 0.05) as number;
  const trunkLeanAngle = ((getP("trunkLeanAngle", "vegetation.trunk.leanAngle", 0) as number) * Math.PI) / 180;
  const firstBranchHeight = getP("firstBranchHeight", "vegetation.branching.firstBranchHeight", 0.3) as number;

  const gravityResp = (getP("gravityResponse", "vegetation.branching.gravityResponse", 0.12) as number) * sp.gravity;
  const phototropism = (getP("phototropism", "vegetation.branching.phototropism", 0.15) as number) * sp.photo;
  const photoDir = (getP("phototropismDirection", "vegetation.branching.phototropismDirection", 0.0) as number) * Math.PI;

  const trunkOvality = getP("trunkOvality", "vegetation.trunk.ovality", 0.06) as number;
  const flutingStrength = getP("trunkFlutingStrength", "vegetation.trunk.flutingStrength", 0) as number;
  const flutingCount = getP("trunkFlutingCount", "vegetation.trunk.flutingCount", 4) as number;
  const buttressStrength = getP("buttressStrength", "vegetation.trunk.buttressStrength", 0) as number;
  const buttressCount = getP("buttressCount", "vegetation.trunk.buttressCount", 4) as number;
  const barkFurrowDepth = getP("barkFurrowDepth", "vegetation.trunk.barkFurrowDepth", 0.35) as number;
  const barkFurrowFreq = getP("barkFurrowFrequency", "vegetation.trunk.barkFurrowFrequency", 6.0) as number;
  const barkColorVar = getP("barkColorVariation", "vegetation.bark.colorVariation", 0.08) as number;
  const barkMossBlend = getP("barkMossBlend", "vegetation.trunk.barkMossBlend", 0.0) as number;
  const barkMossHex = getP("barkMossColor", "vegetation.trunk.barkMossColor", "#3a5a2a") as string;

  // Crown envelope — defaults to species shape if user hasn't overridden
  const crownShapeRaw = getP("crownShape", "vegetation.crown.shape", "AUTO") as string;
  const crownShape = (crownShapeRaw === "AUTO" || crownShapeRaw === undefined) ? sp.envelopeShape : crownShapeRaw;
  const crownRadiusRatio = (getP("crownRadiusRatio", "vegetation.crown.crownRadiusRatio", 0.55) as number) * sp.crownR;
  const crownHeightRatio = (getP("crownHeightRatio", "vegetation.crown.heightRatio", 0.7) as number) * sp.crownH;
  const crownAsymmetry = getP("crownAsymmetry", "vegetation.crown.asymmetry", 0.1) as number;
  const crownDensityFalloff = getP("crownDensityFalloff", "vegetation.crown.densityFalloff", 0.5) as number;
  const crownFlatTop = getP("crownFlatTop", "vegetation.crown.flatTop", 0) as number;
  const crownInnerVoid = getP("crownInnerVoidRadius", "vegetation.crown.innerVoidRadius", 0.3) as number;

  // SCA params — new but read with sensible legacy fallbacks
  const baseAttractors = Math.round((getP("attractorCount", "vegetation.branching.attractorCount", 220) as number) * sp.attractorCount * (0.4 + 0.6 * age01));
  const attractorCount = clamp(baseAttractors, 60, 1400);
  const skeletonIterations = clamp(getP("skeletonIterations", "vegetation.branching.maxIterations", 28) as number, 8, 80) as number;
  const stepLen = getP("skeletonStepLength", "vegetation.branching.stepLength", 0) as number;     // 0 -> auto
  const perceptionMul = getP("attractorPerception", "vegetation.branching.attractorPerception", 5.0) as number;
  const killMul = getP("attractorKill", "vegetation.branching.attractorKill", 1.6) as number;
  const pipeExp = (getP("pipeModelExponent", "vegetation.branching.pipeExponent", 0) as number) || sp.pipeExp;

  // Junction blending (continuous radius union — replaces the rejected "collar")
  const junctionBlendLen = getP("junctionBlendLength", "vegetation.branching.unionBlendLength", 0.22) as number;
  const junctionBlendStr = getP("junctionBlendStrength", "vegetation.branching.unionBlendStrength", 0.58) as number;
  const junctionAsymmetry = getP("junctionAsymmetry", "vegetation.branching.unionAsymmetry", 0.42) as number;

  // Roots
  const rootCount = Math.round(getP("rootCount", "vegetation.roots.rootCount", 5) as number);
  const rootVis = getP("rootVisibility", "vegetation.roots.visibility", 0.4) as number;
  const rootSpreadRadius = getP("rootSpreadRadius", "vegetation.roots.spreadRadius", 2.0) as number;
  const rootDepth = getP("rootDepth", "vegetation.roots.depth", 0.3) as number;
  const rootTaper = getP("rootTaper", "vegetation.roots.taper", 0.7) as number;
  const rootSecondaryCount = Math.round(getP("rootSecondaryCount", "vegetation.roots.secondaryRoots", 0) as number);
  const rootSecondaryLength = getP("rootSecondaryLength", "vegetation.roots.secondaryLength", 0.4) as number;
  const rootUndulation = getP("rootSurfaceUndulation", "vegetation.roots.surfaceUndulation", 0.3) as number;

  // Health
  const healthVigor = getP("healthVigor", "vegetation.health.vigor", 1.0) as number;
  const canopySparseness = getP("canopySparseness", "vegetation.health.sparseness", 0.0) as number;
  const deadBranchRatio = getP("deadBranchRatio", "vegetation.health.deadBranches", 0.0) as number;

  // Colors
  const trunkColor = hexToRgb(trunkColorHex);
  const leafColor = hexToRgb(leafColorHex);
  const autumnColor = hexToRgb(leafAutumnHex);
  const deadLeafColor = hexToRgb(deadLeafHex);
  const mossColor = hexToRgb(barkMossHex);

  // Output buffers
  const wood = { positions: [] as number[], normals: [] as number[], colors: [] as number[], indices: [] as number[] };
  const leaves = { positions: [] as number[], normals: [] as number[], colors: [] as number[], indices: [] as number[] };

  // ─────────────────────── 1. CROWN ENVELOPE FIELD ───────────────────────
  const crownCenterY = height * (firstBranchHeight + (1 - firstBranchHeight) * 0.55);
  const crownMaxR = Math.max(0.1, height * crownRadiusRatio);
  const crownMaxH = Math.max(0.5, height * crownHeightRatio);
  const crownOffX = (rng() - 0.5) * crownAsymmetry * crownMaxR * 2;
  const crownOffZ = (rng() - 0.5) * crownAsymmetry * crownMaxR * 2;

  function envelopeContains(p: Vec3): boolean {
    const dx = p[0] - crownOffX, dz = p[2] - crownOffZ, dy = p[1] - crownCenterY;
    const rh = crownMaxR, hh = crownMaxH * 0.5;
    if (crownFlatTop > 0 && dy > hh * (1 - crownFlatTop)) return false;
    if (crownShape === "CONE") {
      if (dy > hh || dy < -hh) return false;
      const t = (dy + hh) / (2 * hh);
      const r = rh * (1 - t * 0.7);
      return Math.hypot(dx, dz) < r;
    }
    if (crownShape === "COLUMNAR") {
      if (Math.abs(dy) > hh * 1.15) return false;
      return Math.hypot(dx, dz) < rh * 0.55;
    }
    if (crownShape === "UMBRELLA") {
      if (dy > hh * 0.35 || dy < -hh) return false;
      const t = clamp((dy + hh * 0.4) / (hh * 0.75), 0, 1);
      const r = rh * (0.35 + 0.65 * Math.sqrt(t));
      return Math.hypot(dx, dz) < r;
    }
    // SPHERE
    return (dx*dx)/(rh*rh) + (dy*dy)/(hh*hh) + (dz*dz)/(rh*rh) < 1.0;
  }

  // Sample attractors via rejection sampling within envelope, biased by density falloff.
  const attractors: Vec3[] = [];
  let attempts = 0;
  const maxAttempts = attractorCount * 20;
  while (attractors.length < attractorCount && attempts < maxAttempts) {
    attempts++;
    const p: Vec3 = [
      crownOffX + (rng() * 2 - 1) * crownMaxR,
      crownCenterY + (rng() * 2 - 1) * crownMaxH * 0.5,
      crownOffZ + (rng() * 2 - 1) * crownMaxR,
    ];
    if (!envelopeContains(p)) continue;
    // Inner void — keeps interior open so foliage shells the outside.
    const dx = p[0] - crownOffX, dz = p[2] - crownOffZ, dy = p[1] - crownCenterY;
    const radial = Math.sqrt(dx*dx + dz*dz) / crownMaxR;
    const vert = Math.abs(dy) / (crownMaxH * 0.5);
    const r3d = Math.sqrt(radial*radial * 0.6 + vert*vert * 0.4);
    if (r3d < crownInnerVoid) {
      if (rng() > 0.15) continue; // mostly empty inside
    }
    // Density falloff bias — outer shell denser
    const accept = Math.pow(r3d, crownDensityFalloff * 0.8 + 0.2);
    if (rng() > accept * 0.85 + 0.15) continue;
    attractors.push(p);
  }

  // ─────────────────── 2. SKELETON via SPACE COLONIZATION ─────────────────
  const stepSize = stepLen > 0 ? stepLen : Math.max(0.08, height / 40);
  const perception = stepSize * perceptionMul;
  const killDist = stepSize * killMul;

  // Initial trunk seed at origin, growing up + lean.
  const leanDir: Vec3 = v3normalize([
    Math.sin(trunkLeanAngle) + restLean * 0.3,
    Math.cos(trunkLeanAngle),
    (rng() - 0.5) * restLean * 0.2,
  ]);

  const nodes: Node[] = [];
  const newNode = (pos: Vec3, parent: number | null, level: number, pathIdx: number, isApex = true): Node => {
    const n: Node = { id: nodes.length, pos, parent, children: [], level, isApex, pathIdx, radius: 0, attractedFrom: [], consumed: [] };
    nodes.push(n);
    if (parent !== null) nodes[parent].children.push(n.id);
    return n;
  };

  // Pre-grow a small trunk stub up to firstBranchHeight (deterministic core).
  const stubHeight = Math.max(stepSize * 2, firstBranchHeight * height);
  let cursor: Vec3 = [0, 0, 0];
  let lastIdx = newNode(cursor, null, 0, 0).id;
  const stubSteps = Math.max(2, Math.round(stubHeight / stepSize));
  for (let i = 1; i <= stubSteps; i++) {
    const t = i / stubSteps;
    const wob: Vec3 = [
      (rng() - 0.5) * crookedness * stepSize * 0.6,
      stepSize,
      (rng() - 0.5) * crookedness * stepSize * 0.6,
    ];
    cursor = v3add(cursor, [
      wob[0] + leanDir[0] * stepSize * 0.05,
      wob[1] * (1 - 0.05) + leanDir[1] * stepSize * 0.05,
      wob[2] + leanDir[2] * stepSize * 0.05,
    ]);
    const n = newNode(cursor, lastIdx, 0, i);
    lastIdx = n.id;
  }

  // Active growing tips (apices). Each has a "preferred" axial direction.
  interface Apex { nodeId: number; level: number; axis: Vec3; pathIdx: number; }
  const apices: Apex[] = [{ nodeId: lastIdx, level: 0, axis: leanDir, pathIdx: stubSteps }];

  // Photo-tropism global pull (sun-direction in horizontal plane + up).
  const sunDir: Vec3 = v3normalize([Math.sin(photoDir) * 0.3, 1.0, Math.cos(photoDir) * 0.3]);

  // SCA loop
  const liveAttractors = new Set<number>();
  for (let i = 0; i < attractors.length; i++) liveAttractors.add(i);

  for (let iter = 0; iter < skeletonIterations && liveAttractors.size > 0 && apices.length > 0; iter++) {
    // For each active apex, accumulate pulling vectors from attractors within perception.
    const apexInfluences = new Map<number, { sum: Vec3; count: number; consumed: number[] }>();
    for (const a of apices) apexInfluences.set(a.nodeId, { sum: [0,0,0], count: 0, consumed: [] });

    // Bucket each live attractor onto its closest apex (Runions: closest node only).
    const toKill: number[] = [];
    liveAttractors.forEach((aIdx) => {
      const ap = attractors[aIdx];
      let bestApex = -1;
      let bestDist = perception;
      for (const apex of apices) {
        const d = v3len(v3sub(ap, nodes[apex.nodeId].pos));
        if (d < bestDist) { bestDist = d; bestApex = apex.nodeId; }
      }
      if (bestApex >= 0) {
        const inf = apexInfluences.get(bestApex)!;
        const dir = v3normalize(v3sub(ap, nodes[bestApex].pos));
        inf.sum = v3add(inf.sum, dir);
        inf.count++;
        if (bestDist < killDist) inf.consumed.push(aIdx);
      }
    });

    // Grow each apex by one step (or branch).
    const nextApices: Apex[] = [];
    for (const apex of apices) {
      const inf = apexInfluences.get(apex.nodeId)!;
      const isTrunkApex = apex.level === 0;

      // Direction = blend(attractor pull, axial bias, photo, gravity, jitter).
      let dir: Vec3 = [0, 0, 0];
      if (inf.count > 0) {
        dir = v3normalize(inf.sum);
      } else {
        // No attractors in range — keep going along axis but slowly fade.
        dir = apex.axis;
      }

      // Apical dominance: trunk apex strongly biased upward; lateral apices less.
      const apicalWeight = isTrunkApex ? apicalDom : Math.max(0.15, apicalDom - 0.55);
      dir = v3normalize([
        dir[0] * (1 - apicalWeight * 0.45) + apex.axis[0] * apicalWeight * 0.45,
        dir[1] * (1 - apicalWeight * 0.45) + apex.axis[1] * apicalWeight * 0.45,
        dir[2] * (1 - apicalWeight * 0.45) + apex.axis[2] * apicalWeight * 0.45,
      ]);

      // Phototropism (sun-seeking) and gravity (droop).
      const photoStrength = phototropism * (isTrunkApex ? 0.4 : 0.9);
      const gravityStrength = gravityResp * (isTrunkApex ? 0.15 : 0.55 + apex.level * 0.1);
      dir = v3normalize([
        dir[0] + sunDir[0] * photoStrength * 0.3,
        dir[1] + sunDir[1] * photoStrength * 0.3 - gravityStrength * 0.4,
        dir[2] + sunDir[2] * photoStrength * 0.3,
      ]);

      // Subtle jitter (controlled, not corruption-of-RNG-style)
      const jit = isTrunkApex ? crookedness * 0.18 : 0.12;
      dir = v3normalize([
        dir[0] + (rng() - 0.5) * jit,
        dir[1] + (rng() - 0.5) * jit * 0.4,
        dir[2] + (rng() - 0.5) * jit,
      ]);

      // Step forward
      const newPos: Vec3 = v3add(nodes[apex.nodeId].pos, v3scale(dir, stepSize));
      const newId = newNode(newPos, apex.nodeId, apex.level, apex.pathIdx + 1).id;

      // Mark consumed attractors at this node (foliage seeds).
      if (inf.consumed.length > 0) {
        for (const aIdx of inf.consumed) {
          nodes[newId].consumed.push(attractors[aIdx]);
          toKill.push(aIdx);
        }
      }

      nodes[apex.nodeId].isApex = false;

      // BIFURCATION: at the start of growth on the trunk apex, spawn lateral branches
      // proportional to branchSeedCount. This is the only randomness-controlled spawn
      // point — keeps RNG sequence stable.
      const isFirstSpawn = isTrunkApex && iter === 0;
      const spawnLateral = isFirstSpawn ? branchSeedCount :
        // sustained chance for lateral branching off trunk and lower-order nodes
        (apex.level < 3 && rng() < 0.18 + 0.05 * apex.level && inf.count > 0 ? 1 : 0);

      // Continue this apex
      nextApices.push({ nodeId: newId, level: apex.level, axis: dir, pathIdx: apex.pathIdx + 1 });

      // Spawn lateral apices
      for (let s = 0; s < spawnLateral; s++) {
        const azimuth = (s / Math.max(1, spawnLateral)) * Math.PI * 2 + rng() * 0.8;
        const tilt = angleMean + (rng() - 0.5) * angleVar;
        // Build orthonormal frame around current dir
        const ref: Vec3 = Math.abs(dir[1]) > 0.95 ? [1, 0, 0] : [0, 1, 0];
        const right = v3normalize(v3cross(dir, ref));
        const up = v3normalize(v3cross(right, dir));
        const lateral = v3normalize(v3add(
          v3scale(dir, Math.cos(tilt)),
          v3add(v3scale(right, Math.sin(tilt) * Math.cos(azimuth)), v3scale(up, Math.sin(tilt) * Math.sin(azimuth)))
        ));
        nextApices.push({ nodeId: newId, level: apex.level + 1, axis: lateral, pathIdx: 0 });
      }
    }

    for (const k of toKill) liveAttractors.delete(k);
    apices.length = 0;
    apices.push(...nextApices);

    // Cap total nodes to prevent runaway
    if (nodes.length > 4500) break;
  }

  // ─────────────────── 3. PIPE MODEL — radii from leaves to root ─────────
  // Walk topologically (children must be done before parent → DFS post-order).
  const tipRadius = minBranchRadius * sp.tipRadius;
  function computeRadius(nid: number): number {
    const n = nodes[nid];
    if (n.children.length === 0) {
      n.radius = tipRadius;
      return n.radius;
    }
    let sum = 0;
    for (const c of n.children) {
      const cr = computeRadius(c);
      sum += Math.pow(cr, pipeExp);
    }
    n.radius = Math.pow(sum, 1 / pipeExp);
    return n.radius;
  }
  computeRadius(0);

  // Normalize so the root radius equals baseRadius.
  const computedRoot = nodes[0].radius;
  if (computedRoot > 1e-6) {
    const scale = baseRadius / computedRoot;
    for (const n of nodes) n.radius *= scale;
  }
  // Ensure tips are at least min visible
  for (const n of nodes) if (n.children.length === 0) n.radius = Math.max(n.radius, minBranchRadius * 0.7);

  // ─────────────────── 4. BUILD BRANCH PATHS (Catmull-Rom ready) ──────────
  // A "branch" is a chain of nodes where each parent has only-this-child OR
  // where this node was spawned at the same level as parent. We split at
  // every junction so parent and each child are separate paths.
  interface Branch {
    nodes: number[];     // node ids in order
    level: number;
    parentNodeId: number | null;     // attachment parent in another branch
    parentBranchIdx: number;         // index of parent branch
    parentT: number;                 // parametric pos along parent (0..1)
  }
  const branches: Branch[] = [];

  function buildBranchFrom(startNid: number, level: number, parentNodeId: number | null, parentBranchIdx: number, parentT: number) {
    const nids: number[] = [startNid];
    let cur = startNid;
    while (true) {
      const n = nodes[cur];
      // Continue chain through children of same level if exactly one such child exists
      const sameLevelChildren = n.children.filter(c => nodes[c].level === level);
      if (sameLevelChildren.length === 1 && nodes[sameLevelChildren[0]].pathIdx > nodes[cur].pathIdx) {
        cur = sameLevelChildren[0];
        nids.push(cur);
      } else if (sameLevelChildren.length > 1) {
        // pick the longest descendant chain to continue main branch, others are branched
        let bestChild = sameLevelChildren[0];
        let bestDepth = -1;
        for (const c of sameLevelChildren) {
          let d = 0; let walk = c;
          while (true) {
            const w = nodes[walk];
            const slc = w.children.filter(cc => nodes[cc].level === level);
            if (slc.length === 0) break;
            walk = slc[0]; d++;
            if (d > 200) break;
          }
          if (d > bestDepth) { bestDepth = d; bestChild = c; }
        }
        cur = bestChild;
        nids.push(cur);
      } else {
        break;
      }
    }
    const branchIdx = branches.length;
    branches.push({ nodes: nids, level, parentNodeId, parentBranchIdx, parentT });
    // Recurse: for every node in this branch, every child whose level > current level → new branch
    for (let i = 0; i < nids.length; i++) {
      const n = nodes[nids[i]];
      const tHere = nids.length > 1 ? i / (nids.length - 1) : 0;
      for (const c of n.children) {
        if (nodes[c].level > level) {
          buildBranchFrom(c, nodes[c].level, n.id, branchIdx, tHere);
        }
      }
      // Also handle stray same-level children we didn't pick as the main chain
      if (i < nids.length - 1) continue;
      const sameLeftover = n.children.filter(c => nodes[c].level === level && !nids.includes(c));
      for (const c of sameLeftover) buildBranchFrom(c, level, n.id, branchIdx, tHere);
    }
  }
  buildBranchFrom(0, 0, null, -1, 0);

  // ─────────────────── 5. RENDER TUBES with continuous junction blending ──
  // Pre-compute child-attachment list per branch for the metaball blend.
  interface Attachment { parentT: number; childRadius: number; childDir: Vec3; }
  const branchAttachments: Attachment[][] = branches.map(() => []);
  for (let bi = 0; bi < branches.length; bi++) {
    const b = branches[bi];
    if (b.parentBranchIdx >= 0) {
      const childFirst = nodes[b.nodes[0]];
      const childNext = nodes[b.nodes[Math.min(1, b.nodes.length - 1)]];
      const dir = v3normalize(v3sub(childNext.pos, childFirst.pos));
      branchAttachments[b.parentBranchIdx].push({
        parentT: b.parentT,
        childRadius: childFirst.radius,
        childDir: dir,
      });
    }
  }

  // For each branch, sample a smooth Catmull-Rom path with N rings.
  function sampleBranch(b: Branch): { centers: Vec3[]; tangents: Vec3[]; radii: number[]; tValues: number[] } {
    const pts = b.nodes.map(id => nodes[id].pos);
    const radsRaw = b.nodes.map(id => nodes[id].radius);
    if (pts.length < 2) {
      return { centers: [pts[0], pts[0]], tangents: [[0,1,0],[0,1,0]], radii: [radsRaw[0], radsRaw[0]], tValues: [0,1] };
    }
    // Pad with phantom endpoints for Catmull-Rom
    const padStart: Vec3 = b.parentBranchIdx >= 0 && b.parentNodeId !== null
      ? nodes[b.parentNodeId].pos
      : v3sub(pts[0], v3sub(pts[1], pts[0]));
    const padEnd: Vec3 = v3add(pts[pts.length - 1], v3sub(pts[pts.length - 1], pts[pts.length - 2]));

    // Densify: subdivide each segment based on length
    const segs = pts.length - 1;
    const subdiv = b.level === 0 ? 4 : Math.max(2, 5 - b.level);
    const totalRings = segs * subdiv + 1;

    const centers: Vec3[] = [];
    const tangents: Vec3[] = [];
    const radii: number[] = [];
    const tValues: number[] = [];
    for (let i = 0; i < segs; i++) {
      const p0 = i === 0 ? padStart : pts[i - 1];
      const p1 = pts[i];
      const p2 = pts[i + 1];
      const p3 = i + 2 < pts.length ? pts[i + 2] : padEnd;
      const r1 = radsRaw[i];
      const r2 = radsRaw[i + 1];
      const lastSeg = i === segs - 1;
      const inner = lastSeg ? subdiv : subdiv;
      for (let k = 0; k < inner; k++) {
        const t = k / subdiv;
        centers.push(catmullRom(p0, p1, p2, p3, t));
        tangents.push(catmullRomTangent(p0, p1, p2, p3, t));
        radii.push(r1 + (r2 - r1) * t);
        tValues.push((i + t) / segs);
      }
    }
    // Final endpoint
    centers.push(pts[pts.length - 1]);
    tangents.push(v3normalize(v3sub(pts[pts.length - 1], pts[pts.length - 2])));
    radii.push(radsRaw[radsRaw.length - 1]);
    tValues.push(1);
    return { centers, tangents, radii, tValues };
  }

  // The ACTUAL tube renderer — applies bark/fluting/buttress/junction blend per ring.
  function emitTube(b: Branch, sampled: { centers: Vec3[]; tangents: Vec3[]; radii: number[]; tValues: number[] }, isDead: boolean) {
    const { centers, tangents, radii, tValues } = sampled;
    const ringCount = b.level === 0 ? 12 : Math.max(5, 10 - b.level);
    const baseIdx = wood.positions.length / 3;
    let prevUp: Vec3 | null = null;
    const attachments = branchAttachments[branches.indexOf(b)];

    for (let i = 0; i < centers.length; i++) {
      const center = centers[i];
      const tan = tangents[i];
      const tParam = tValues[i];
      const { right, up } = stableFrame(tan, prevUp);
      prevUp = up;

      // ─── continuous junction blending (replaces "collar" geometry) ───
      // For every child attachment near this t, swell the parent radius
      // anisotropically toward the child's outgoing direction.
      let baseR = radii[i];

      // Pipe-radius² accumulation for the metaball blend
      let unionRSq = baseR * baseR;
      const blendDirs: { dir: Vec3; weight: number; }[] = [];
      for (const att of attachments) {
        const dt = Math.abs(tParam - att.parentT);
        const window = junctionBlendLen;
        if (dt > window) continue;
        const w = (1 - dt / window) ** 2 * junctionBlendStr;
        unionRSq += (att.childRadius * att.childRadius) * w * 0.85;
        blendDirs.push({ dir: att.childDir, weight: w });
      }
      let blendedR = Math.sqrt(unionRSq);

      // Base flare (root collar)
      if (b.level === 0 && center[1] < height * 0.07) {
        const flareT = 1 - center[1] / (height * 0.07);
        blendedR *= 1 + (flare - 1) * flareT * flareT;
      }

      const twistRad = b.level === 0 ? (tParam * twistDeg * Math.PI / 180) : 0;

      for (let j = 0; j <= ringCount; j++) {
        const angle = (j / ringCount) * Math.PI * 2 + twistRad;
        const cosA = Math.cos(angle), sinA = Math.sin(angle);

        // Anisotropic junction swell — push outward in directions facing child branches
        let aniso = 0;
        if (blendDirs.length > 0) {
          const ringDir: Vec3 = v3add(v3scale(right, cosA), v3scale(up, sinA));
          for (const bd of blendDirs) {
            const align = Math.max(0, v3dot(ringDir, bd.dir));
            aniso += align * bd.weight * junctionAsymmetry * baseR * 0.6;
          }
        }

        let rx = blendedR + aniso, rz = blendedR + aniso;

        // Trunk ovality
        if (b.level === 0 && trunkOvality > 0) {
          rx *= 1 + trunkOvality * 0.5;
          rz *= 1 - trunkOvality * 0.5;
        }
        // Buttress (root flare with N folds)
        if (b.level === 0 && buttressStrength > 0 && center[1] < height * 0.12) {
          const butPhase = angle * buttressCount * 0.5;
          const butEnv = Math.pow(Math.max(0, Math.cos(butPhase)), 3);
          const butT = Math.pow(1 - center[1] / (height * 0.12), 2);
          const add = buttressStrength * butEnv * butT * baseRadius * 0.45;
          rx += add; rz += add;
        }
        // Fluting
        if (b.level === 0 && flutingStrength > 0) {
          const f = Math.sin(angle * flutingCount) * flutingStrength * 0.04 * baseR;
          rx += f; rz += f;
        }
        // Bark furrows
        const furrowScale = b.level <= 1 ? 1.0 : 0.25;
        const barkN1 = fbm2(angle * barkFurrowFreq + seed * 0.1, center[1] * 3.5, 3);
        const furrow = barkN1 * barkFurrowDepth * baseR * 0.04 * furrowScale;

        const finalR = Math.sqrt(rx * rx * cosA * cosA + rz * rz * sinA * sinA) + furrow;
        const normal = v3add(v3scale(right, cosA), v3scale(up, sinA));
        const vertex = v3add(center, v3scale(normal, finalR));

        wood.positions.push(vertex[0], vertex[1], vertex[2]);
        wood.normals.push(normal[0], normal[1], normal[2]);

        // Color
        const furrowDark = 1 - barkN1 * barkFurrowDepth * 0.18 * furrowScale;
        const darkening = isDead ? 0.55 : (1 - b.level * 0.018);
        const cv = (rng() - 0.5) * barkColorVar * (b.level === 0 ? 1 : 0.4);
        let cr = trunkColor[0] * furrowDark * darkening + cv;
        let cg = trunkColor[1] * furrowDark * darkening + cv;
        let cb = trunkColor[2] * furrowDark * darkening + cv;

        if (barkMossBlend > 0 && b.level <= 2) {
          const mossChance = barkMossBlend * clamp(sinA * 0.5 + 0.5, 0, 1) * clamp(1 - center[1] / height * 0.5, 0, 1);
          const mossNoise = fbm2(angle * 4 + seed * 0.3, center[1] * 2, 3);
          if (mossNoise > 1 - mossChance) {
            const mf = clamp((mossNoise - (1 - mossChance)) / mossChance, 0, 1);
            cr = cr * (1 - mf) + mossColor[0] * mf;
            cg = cg * (1 - mf) + mossColor[1] * mf;
            cb = cb * (1 - mf) + mossColor[2] * mf;
          }
        }

        wood.colors.push(clamp(cr, 0, 1), clamp(cg, 0, 1), clamp(cb, 0, 1));
      }
    }

    // Indices
    const ringStride = ringCount + 1;
    for (let i = 0; i < centers.length - 1; i++) {
      for (let j = 0; j < ringCount; j++) {
        const a = baseIdx + i * ringStride + j;
        const b2 = a + ringStride;
        wood.indices.push(a, b2, a + 1, a + 1, b2, b2 + 1);
      }
    }
  }

  // ─────────────────── 6. FOLIAGE — at consumed attractors + tips ─────────
  function addLeafCard(center: Vec3, right: Vec3, up: Vec3, normal: Vec3, size: number, isDead: boolean, isUnder: boolean) {
    const baseIdx = leaves.positions.length / 3;
    const w = size, h = size * leafAspect;
    const curlAmount = leafCurl * (rng() * 0.5 + 0.5);
    const tip = v3add(center, v3add(v3scale(up, h * 0.5), v3scale(normal, -curlAmount * h * 0.2)));
    const left = v3add(center, v3add(v3scale(right, -w * 0.5), v3scale(up, h * 0.05)));
    const rt = v3add(center, v3add(v3scale(right, w * 0.5), v3scale(up, h * 0.05)));
    const base = v3add(center, v3add(v3scale(up, -h * 0.35), v3scale(normal, curlAmount * h * 0.1)));
    const midUL = v3add(center, v3add(v3scale(right, -w * 0.35), v3scale(up, h * 0.28)));
    const midUR = v3add(center, v3add(v3scale(right, w * 0.35), v3scale(up, h * 0.28)));
    const verts = [tip, midUL, left, base, rt, midUR];
    for (const v of verts) {
      leaves.positions.push(v[0], v[1], v[2]);
      leaves.normals.push(normal[0], normal[1], normal[2]);
    }
    let baseColor = leafColor;
    if (isDead) baseColor = deadLeafColor;
    else if (leafSeasonalBlend > 0) baseColor = lerpColor(leafColor, autumnColor, leafSeasonalBlend);
    for (let j = 0; j < 6; j++) {
      const vr = (rng() - 0.5) * leafColorVar;
      const underMul = (j >= 2 && j <= 4 && isUnder) ? (1 + leafUndersideLighten) : 1.0;
      leaves.colors.push(
        clamp((baseColor[0] + vr) * underMul, 0, 1),
        clamp((baseColor[1] + vr * 0.5) * underMul, 0, 1),
        clamp((baseColor[2] + vr) * underMul, 0, 1),
      );
    }
    leaves.indices.push(
      baseIdx, baseIdx + 1, baseIdx + 5,
      baseIdx + 1, baseIdx + 2, baseIdx + 3,
      baseIdx + 1, baseIdx + 3, baseIdx + 5,
      baseIdx + 5, baseIdx + 3, baseIdx + 4,
    );
  }

  function addLeafCluster(pos: Vec3, dir: Vec3, level: number) {
    if (rng() < canopySparseness) return;
    const speciesBunch = sp.leafBunch;
    const count = Math.max(4, Math.round(leafClusterSize * speciesBunch * (0.55 + 0.45 * age01) * healthVigor));
    const clusterRadius = leafSize * sp.leafSize * 4 * leafClusterSpread;
    for (let i = 0; i < count; i++) {
      const phi = rng() * Math.PI * 2;
      const cosTheta = rng() * 2 - 1;
      const r = Math.pow(rng(), 0.5) * clusterRadius;
      const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
      const center: Vec3 = [
        pos[0] + r * sinTheta * Math.cos(phi),
        pos[1] + r * sinTheta * Math.sin(phi) * 0.7 + r * 0.1,
        pos[2] + r * cosTheta,
      ];
      const yaw = rng() * Math.PI * 2;
      const hangRad = (leafHangDeg * Math.PI / 180) * (0.5 + rng() * 0.5);
      const basePitch = Math.PI * 0.5 - hangRad;
      const seekUp = leafSunSeek * (0.5 + rng() * 0.5);
      const normal: Vec3 = v3normalize([
        Math.cos(yaw) * Math.cos(basePitch) * (1 - leafOrientBias),
        Math.sin(basePitch) * (1 - seekUp) + seekUp,
        Math.sin(yaw) * Math.cos(basePitch) * (1 - leafOrientBias),
      ]);
      const isUnder = normal[1] < 0;
      const { right, up } = stableFrame(normal, null);
      const s = leafSize * sp.leafSize * (1 - leafSizeVar * 0.5 + rng() * leafSizeVar);
      addLeafCard(center, right, up, normal, s, rng() < deadLeafRatio, isUnder);
    }
  }

  // ─────────────────── 7. EMIT EVERYTHING ─────────────────────────────────
  for (const b of branches) {
    const isDead = b.level > 1 && rng() < deadBranchRatio;
    const sampled = sampleBranch(b);
    emitTube(b, sampled, isDead);

    // Foliage: along the upper portion of mid-to-terminal branches, denser at tips.
    if (!isDead && b.level >= 1) {
      const isTerminal = b.nodes.length <= 4 || b.level >= 3;
      const lastNode = nodes[b.nodes[b.nodes.length - 1]];
      const consumed = lastNode.consumed;
      const tipPos = lastNode.pos;
      const tipDir = sampled.tangents[sampled.tangents.length - 1];

      // Place a cluster at every consumed attractor (light-finding leaves).
      for (const cp of consumed) {
        addLeafCluster(cp, tipDir, b.level);
      }
      // Also seed clusters along the terminal portion of the branch.
      if (isTerminal) {
        addLeafCluster(tipPos, tipDir, b.level);
        if (b.nodes.length >= 2) {
          const midPos = nodes[b.nodes[Math.floor(b.nodes.length * 0.7)]].pos;
          addLeafCluster(midPos, tipDir, b.level);
        }
      }
    }
  }

  // ─────────────────── 8. ROOTS (preserved from prior renderer) ───────────
  function emitSimpleTube(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, r0: number, r1: number) {
    // Quick low-poly tube for roots
    const segs = 6, ring = 6;
    const baseIdx = wood.positions.length / 3;
    let prevUp: Vec3 | null = null;
    for (let i = 0; i <= segs; i++) {
      const t = i / segs;
      const u = 1 - t;
      const c: Vec3 = [
        u*u*u*p0[0] + 3*u*u*t*p1[0] + 3*u*t*t*p2[0] + t*t*t*p3[0],
        u*u*u*p0[1] + 3*u*u*t*p1[1] + 3*u*t*t*p2[1] + t*t*t*p3[1],
        u*u*u*p0[2] + 3*u*u*t*p1[2] + 3*u*t*t*p2[2] + t*t*t*p3[2],
      ];
      const tan = v3normalize([
        3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]),
        3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]),
        3*u*u*(p1[2]-p0[2]) + 6*u*t*(p2[2]-p1[2]) + 3*t*t*(p3[2]-p2[2]),
      ]);
      const { right, up } = stableFrame(tan, prevUp); prevUp = up;
      const r = r0 + (r1 - r0) * t;
      for (let j = 0; j <= ring; j++) {
        const a = (j / ring) * Math.PI * 2;
        const ca = Math.cos(a), sa = Math.sin(a);
        const n = v3add(v3scale(right, ca), v3scale(up, sa));
        const v = v3add(c, v3scale(n, r));
        wood.positions.push(v[0], v[1], v[2]);
        wood.normals.push(n[0], n[1], n[2]);
        wood.colors.push(trunkColor[0] * 0.85, trunkColor[1] * 0.85, trunkColor[2] * 0.85);
      }
    }
    for (let i = 0; i < segs; i++) {
      for (let j = 0; j < ring; j++) {
        const a = baseIdx + i * (ring + 1) + j;
        const b = a + ring + 1;
        wood.indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }

  if (rootCount > 0 && rootVis > 0.001) {
    for (let r = 0; r < rootCount; r++) {
      const rootAngle = (r / rootCount) * Math.PI * 2 + rng() * 0.4;
      const rootLen = baseRadius * rootSpreadRadius * rootVis * (0.7 + rng() * 0.6);
      const rootRad = baseRadius * 0.32 * rootVis;
      const rootStart: Vec3 = [Math.cos(rootAngle) * baseRadius * 0.5, -0.02, Math.sin(rootAngle) * baseRadius * 0.5];
      const rootEnd: Vec3 = [Math.cos(rootAngle) * (baseRadius + rootLen), -rootLen * rootDepth - 0.1, Math.sin(rootAngle) * (baseRadius + rootLen)];
      const rp1 = v3lerp(rootStart, rootEnd, 0.3);
      rp1[1] = -0.03 + rootUndulation * 0.05 * Math.sin(rng() * Math.PI * 2);
      const rp2 = v3lerp(rootStart, rootEnd, 0.65);
      rp2[1] = rootEnd[1] * 0.4 + rootUndulation * 0.04 * Math.sin(rng() * Math.PI * 2);
      const perpX = -Math.sin(rootAngle), perpZ = Math.cos(rootAngle);
      rp1[0] += perpX * rootUndulation * 0.1 * (rng() - 0.5);
      rp1[2] += perpZ * rootUndulation * 0.1 * (rng() - 0.5);
      rp2[0] += perpX * rootUndulation * 0.15 * (rng() - 0.5);
      rp2[2] += perpZ * rootUndulation * 0.15 * (rng() - 0.5);
      const rootEndRad = rootRad * (1 - rootTaper) * 0.3;
      emitSimpleTube(rootStart, rp1, rp2, rootEnd, rootRad, rootEndRad);
      if (rootSecondaryCount > 0) {
        for (let sr = 0; sr < rootSecondaryCount; sr++) {
          const st = 0.3 + rng() * 0.5;
          const u = 1 - st;
          const sPos: Vec3 = [
            u*u*u*rootStart[0] + 3*u*u*st*rp1[0] + 3*u*st*st*rp2[0] + st*st*st*rootEnd[0],
            u*u*u*rootStart[1] + 3*u*u*st*rp1[1] + 3*u*st*st*rp2[1] + st*st*st*rootEnd[1],
            u*u*u*rootStart[2] + 3*u*u*st*rp1[2] + 3*u*st*st*rp2[2] + st*st*st*rootEnd[2],
          ];
          const sAngle = rootAngle + (rng() - 0.5) * 1.2;
          const sLen = rootLen * rootSecondaryLength * (0.4 + rng() * 0.6);
          const sEnd: Vec3 = [sPos[0] + Math.cos(sAngle) * sLen, sPos[1] - sLen * 0.2, sPos[2] + Math.sin(sAngle) * sLen];
          const sp1 = v3lerp(sPos, sEnd, 0.33);
          const sp2 = v3lerp(sPos, sEnd, 0.66);
          sp1[1] += 0.02 * rootUndulation;
          emitSimpleTube(sPos, sp1, sp2, sEnd, rootRad * 0.3, rootRad * 0.05);
        }
      }
    }
  }

  return {
    wood,
    leaves,
    meta: {
      height,
      trunkTop: height,
      vertCount: wood.positions.length / 3 + leaves.positions.length / 3,
    },
  };
}
