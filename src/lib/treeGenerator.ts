import type { TreeParams } from "@/types/treeParams";

type Vec3 = [number, number, number];

function v3add(a: Vec3, b: Vec3): Vec3 { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function v3sub(a: Vec3, b: Vec3): Vec3 { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
function v3scale(a: Vec3, s: number): Vec3 { return [a[0]*s, a[1]*s, a[2]*s]; }
function v3len(a: Vec3): number { return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); }
function v3normalize(a: Vec3): Vec3 {
  const l = v3len(a);
  return l > 1e-8 ? [a[0]/l, a[1]/l, a[2]/l] : [0, 1, 0];
}
function v3cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}
function v3lerp(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}
function v3dot(a: Vec3, b: Vec3): number { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }

function bezierPoint(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const u = 1 - t;
  const uu = u * u, uuu = uu * u;
  const tt = t * t, ttt = tt * t;
  return [
    uuu*p0[0] + 3*uu*t*p1[0] + 3*u*tt*p2[0] + ttt*p3[0],
    uuu*p0[1] + 3*uu*t*p1[1] + 3*u*tt*p2[1] + ttt*p3[1],
    uuu*p0[2] + 3*uu*t*p1[2] + 3*u*tt*p2[2] + ttt*p3[2],
  ];
}

function bezierTangent(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, t: number): Vec3 {
  const u = 1 - t;
  return v3normalize([
    3*u*u*(p1[0]-p0[0]) + 6*u*t*(p2[0]-p1[0]) + 3*t*t*(p3[0]-p2[0]),
    3*u*u*(p1[1]-p0[1]) + 6*u*t*(p2[1]-p1[1]) + 3*t*t*(p3[1]-p2[1]),
    3*u*u*(p1[2]-p0[2]) + 6*u*t*(p2[2]-p1[2]) + 3*t*t*(p3[2]-p2[2]),
  ]);
}

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
  const r = parseInt(h.substring(0, 2), 16) / 255;
  const g = parseInt(h.substring(2, 4), 16) / 255;
  const b = parseInt(h.substring(4, 6), 16) / 255;
  return [r, g, b];
}

function hash21(x: number, y: number): number {
  let n = Math.sin(x * 127.1 + y * 311.7) * 43758.5453;
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
  for (let i = 0; i < octaves; i++) {
    v += amp * noise2(x * freq, y * freq);
    freq *= 2; amp *= 0.5;
  }
  return v;
}

function clamp(v: number, lo: number, hi: number): number {
  return v < lo ? lo : v > hi ? hi : v;
}

function lerpColor(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0]+(b[0]-a[0])*t, a[1]+(b[1]-a[1])*t, a[2]+(b[2]-a[2])*t];
}

// Species profile multipliers
const SPECIES_MULS: Record<string, Record<string, number>> = {
  PINE_CONIFER:       { branchCount: 1.35, branchProb: 1.08, apical: 1.28, angle: 0.72, angleVar: 0.62, lengthRatio: 0.82, lengthDecay: 0.94, radiusDecay: 0.93, gravity: 0.5, photo: 0.3 },
  SPRUCE_CONICAL:     { branchCount: 1.42, branchProb: 1.12, apical: 1.36, angle: 0.62, angleVar: 0.52, lengthRatio: 0.74, lengthDecay: 0.92, radiusDecay: 0.90, gravity: 0.4, photo: 0.2 },
  WILLOW_WEEPING:     { branchCount: 1.18, branchProb: 1.04, apical: 0.76, angle: 1.22, angleVar: 1.18, lengthRatio: 1.14, lengthDecay: 0.90, radiusDecay: 0.95, gravity: 2.0, photo: 0.1 },
  BIRCH_UPRIGHT:      { branchCount: 0.88, branchProb: 0.92, apical: 1.10, angle: 0.84, angleVar: 0.75, lengthRatio: 0.90, lengthDecay: 0.96, radiusDecay: 0.90, gravity: 0.8, photo: 0.5 },
  ACACIA_SAVANNA:     { branchCount: 0.86, branchProb: 1.08, apical: 0.52, angle: 1.34, angleVar: 1.35, lengthRatio: 1.24, lengthDecay: 0.86, radiusDecay: 0.92, gravity: 0.6, photo: 0.4 },
  OAK_MAPLE:          { branchCount: 1.08, branchProb: 1.00, apical: 0.92, angle: 1.08, angleVar: 1.08, lengthRatio: 1.08, lengthDecay: 0.98, radiusDecay: 1.00, gravity: 1.0, photo: 0.5 },
  BROADLEAF_DECIDUOUS:{ branchCount: 1.00, branchProb: 1.00, apical: 1.00, angle: 1.00, angleVar: 1.00, lengthRatio: 1.00, lengthDecay: 1.00, radiusDecay: 1.00, gravity: 1.0, photo: 1.0 },
};

export interface TreeGeometry {
  wood: { positions: number[]; normals: number[]; colors: number[]; indices: number[] };
  leaves: { positions: number[]; normals: number[]; colors: number[]; indices: number[] };
  meta: { height: number; trunkTop: number; vertCount: number };
}

export function generateTreeGeometry(params: TreeParams, seed: number = 1337): TreeGeometry {
  const rng = mulberry32(seed);
  const getP = (k: string, alt: string, def: number | string | boolean) =>
    params[k] ?? params[alt] ?? def;

  // Read params
  const age01 = getP("age01", "vegetation.instance.age01", 1.0) as number;
  const height = (getP("height", "vegetation.species.heightBase_m", 8) as number) * (0.3 + 0.7 * age01);
  const baseRadius = getP("baseRadius", "vegetation.trunk.baseRadius_m", 0.4) as number;
  const taper = getP("taperExponent", "vegetation.trunk.taperExponent", 0.7) as number;
  const flare = getP("baseFlare", "vegetation.trunk.baseFlare", 1.3) as number;
  const twistDeg = getP("twist", "vegetation.trunk.twist_deg", 0) as number;
  const trunkColorHex = getP("trunkColor", "vegetation.trunk.barkColor", "#5d4037") as string;
  const leafColorHex = getP("leafColor", "vegetation.leaves.colorBase", "#4a7c3f") as string;
  const leafColorVar = getP("leafColorVariation", "vegetation.leaves.colorVariation", 0.15) as number;
  const leafSize = getP("leafSize", "vegetation.leaves.size_m", 0.08) as number;
  const leafSizeVar = getP("leafSizeVariation", "vegetation.leaves.sizeVariation", 0.3) as number;
  const leafAspect = getP("leafAspectRatio", "vegetation.leaves.aspectRatio", 1.5) as number;
  const leafClusterSize = getP("leafClusterSize", "vegetation.leaves.clusterSize", 12) as number;
  const leafClusterSpread = getP("leafClusterSpread", "vegetation.leaves.clusterSpread", 1.0) as number;
  const leafOrientBias = getP("leafOrientationBias", "vegetation.leaves.orientationBias", 0.5) as number;
  const leafSunSeek = getP("leafSunSeeking", "vegetation.leaves.sunSeeking", 0.3) as number;
  const leafHangDeg = getP("leafHangAngle", "vegetation.leaves.hangAngle", 15) as number;
  const leafCurl = getP("leafCurl", "vegetation.leaves.curl", 0.1) as number;
  const leafTranslucency = getP("leafTranslucency", "vegetation.leaves.translucency", 0.3) as number;
  const leafSeasonalBlend = getP("leafSeasonalBlend", "vegetation.leaves.seasonalBlend", 0.0) as number;
  const leafAutumnHex = getP("leafAutumnColor", "vegetation.leaves.colorAutumn", "#c4722a") as string;
  const leafUndersideLighten = getP("leafUndersideLighten", "vegetation.leaves.undersideLighten", 0.15) as number;
  const deadLeafRatio = getP("deadLeafRatio", "vegetation.leaves.deadLeafRatio", 0.0) as number;
  const deadLeafHex = getP("deadLeafColor", "vegetation.leaves.deadLeafColor", "#8b6914") as string;

  const profile = getP("speciesProfile", "vegetation.species.profile", "BROADLEAF_DECIDUOUS") as string;
  const sp = SPECIES_MULS[profile] ?? SPECIES_MULS.BROADLEAF_DECIDUOUS;

  const rawBranchCount = Math.round((getP("branchCount", "vegetation.branching.mainBranchCount", 6) as number) * sp.branchCount * (0.5 + 0.5 * age01));
  const maxOrder = getP("maxOrder", "vegetation.branching.maxOrder", 5) as number;
  const branchProb = (getP("branchProbability", "vegetation.branching.probability", 0.65) as number) * sp.branchProb;
  const apicalDom = (getP("apicalDominance", "vegetation.branching.apicalDominance", 0.7) as number) * sp.apical;
  const angleMean = ((getP("branchAngle", "vegetation.branching.angleMean_deg", 35) as number) * sp.angle * Math.PI) / 180;
  const angleVar = ((getP("branchAngleVar", "vegetation.branching.angleVariance_deg", 12) as number) * sp.angleVar * Math.PI) / 180;
  const branchLenRatio = (getP("branchLength", "vegetation.branching.lengthRatio", 0.55) as number) * sp.lengthRatio;
  const lengthDecay = (getP("lengthDecay", "vegetation.branching.lengthDecay", 0.72) as number) * sp.lengthDecay;
  const radiusDecay = (getP("radiusDecay", "vegetation.branching.radiusDecay", 0.65) as number) * sp.radiusDecay;
  const knotCount = getP("trunkKnotCount", "vegetation.trunk.gestureKnotCount", 2) as number;
  const knotStrength = getP("trunkKnotStrength", "vegetation.trunk.gestureKnotStrength", 0.25) as number;
  const rootCount = Math.round(getP("rootCount", "vegetation.roots.rootCount", 5) as number);
  const rootVis = getP("rootVisibility", "vegetation.roots.visibility", 0.4) as number;
  const restLean = getP("restLean", "vegetation.wind.restLean", 0.22) as number;

  // New params
  const gravityResponse = (getP("gravityResponse", "vegetation.branching.gravityResponse", 0.12) as number) * (sp.gravity ?? 1.0);
  const phototropism = (getP("phototropism", "vegetation.branching.phototropism", 0.15) as number) * (sp.photo ?? 1.0);
  const branchDroop = getP("branchDroop", "vegetation.branching.branchDroop", 0.08) as number;
  const droopIncrease = getP("droopIncrease", "vegetation.branching.droopIncrease", 0.04) as number;
  const branchCurvature = getP("branchCurvature", "vegetation.branching.curvature", 0.15) as number;
  const trunkOvality = getP("trunkOvality", "vegetation.trunk.ovality", 0.06) as number;
  const flutingStrength = getP("trunkFlutingStrength", "vegetation.trunk.flutingStrength", 0) as number;
  const flutingCount = getP("trunkFlutingCount", "vegetation.trunk.flutingCount", 4) as number;
  const buttressStrength = getP("buttressStrength", "vegetation.trunk.buttressStrength", 0) as number;
  const buttressCount = getP("buttressCount", "vegetation.trunk.buttressCount", 4) as number;
  const barkFurrowDepth = getP("barkFurrowDepth", "vegetation.trunk.barkFurrowDepth", 0.35) as number;
  const barkFurrowFreq = getP("barkFurrowFrequency", "vegetation.trunk.barkFurrowFrequency", 6.0) as number;
  const barkColorVar = getP("barkColorVariation", "vegetation.bark.colorVariation", 0.08) as number;
  const crownShape = getP("crownShape", "vegetation.crown.shape", "SPHERE") as string;
  const crownRadiusRatio = getP("crownRadiusRatio", "vegetation.crown.crownRadiusRatio", 0.42) as number;
  const crownHeightRatio = getP("crownHeightRatio", "vegetation.crown.heightRatio", 0.65) as number;
  const crownAsymmetry = getP("crownAsymmetry", "vegetation.crown.asymmetry", 0.1) as number;
  const crownDensityFalloff = getP("crownDensityFalloff", "vegetation.crown.densityFalloff", 0.5) as number;
  const crownFlatTop = getP("crownFlatTop", "vegetation.crown.flatTop", 0) as number;
  const crownOpenness = getP("crownOpenness", "vegetation.crown.openness", 0.15) as number;
  const breakProbability = getP("breakProbability", "vegetation.branching.breakProbability", 0) as number;
  const breakSeverity = getP("breakSeverity", "vegetation.branching.breakSeverity", 0.5) as number;
  const firstBranchHeight = getP("firstBranchHeight", "vegetation.branching.firstBranchHeight", 0.25) as number;
  const rootSpreadRadius = getP("rootSpreadRadius", "vegetation.roots.spreadRadius", 2.0) as number;
  const rootDepth = getP("rootDepth", "vegetation.roots.depth", 0.3) as number;
  const rootTaper = getP("rootTaper", "vegetation.roots.taper", 0.7) as number;
  const rootSecondaryCount = Math.round(getP("rootSecondaryCount", "vegetation.roots.secondaryRoots", 0) as number);
  const rootSecondaryLength = getP("rootSecondaryLength", "vegetation.roots.secondaryLength", 0.4) as number;
  const rootUndulation = getP("rootSurfaceUndulation", "vegetation.roots.surfaceUndulation", 0.3) as number;
  const healthVigor = getP("healthVigor", "vegetation.health.vigor", 1.0) as number;
  const canopySparseness = getP("canopySparseness", "vegetation.health.sparseness", 0.0) as number;
  const deadBranchRatio = getP("deadBranchRatio", "vegetation.health.deadBranches", 0.0) as number;
  const barkMossBlend = getP("barkMossBlend", "vegetation.trunk.barkMossBlend", 0.0) as number;
  const barkMossHex = getP("barkMossColor", "vegetation.trunk.barkMossColor", "#3a5a2a") as string;
  const crookedness = getP("trunkCrookedness", "vegetation.trunk.crookedness", 0.1) as number;
  const epicormicDensity = getP("epicormicDensity", "vegetation.branching.epicormicDensity", 0) as number;
  const forkProbability = getP("forkProbability", "vegetation.branching.forkProbability", 0.1) as number;

  const trunkColor = hexToRgb(trunkColorHex);
  const leafColor = hexToRgb(leafColorHex);
  const autumnColor = hexToRgb(leafAutumnHex);
  const deadLeafColor = hexToRgb(deadLeafHex);
  const mossColor = hexToRgb(barkMossHex);

  const wood = { positions: [] as number[], normals: [] as number[], colors: [] as number[], indices: [] as number[] };
  const leaves = { positions: [] as number[], normals: [] as number[], colors: [] as number[], indices: [] as number[] };

  const trunkTopY = height * 0.55;
  const segments = 16;
  const rings = 22;
  // Minimum radius at trunk top so it doesn't taper to a point
  const trunkTopMinRadius = baseRadius * 0.18;

  // Generate knot positions along trunk
  const knots: { t: number; dx: number; dz: number; amp: number; width: number }[] = [];
  for (let i = 0; i < knotCount; i++) {
    knots.push({
      t: 0.15 + rng() * 0.7,
      dx: (rng() - 0.5) * 2,
      dz: (rng() - 0.5) * 2,
      amp: knotStrength * (0.5 + rng() * 0.5),
      width: 0.06 + rng() * 0.15,
    });
  }

  // Crookedness - random offsets along the trunk
  const crookOffsets: { t: number; dx: number; dz: number }[] = [];
  const crookCount = Math.floor(crookedness * 8);
  for (let i = 0; i < crookCount; i++) {
    crookOffsets.push({
      t: 0.1 + rng() * 0.8,
      dx: (rng() - 0.5) * crookedness * baseRadius * 2,
      dz: (rng() - 0.5) * crookedness * baseRadius * 2,
    });
  }

  // Lean direction
  const leanX = restLean * (0.5 + rng() * 0.5);
  const leanZ = restLean * (rng() - 0.5) * 0.3;

  // Crown center for shaping
  const crownCenterY = trunkTopY + height * crownHeightRatio * 0.3;
  const crownMaxR = height * crownRadiusRatio;
  const crownMaxH = height * crownHeightRatio;
  // Random asymmetry offsets
  const crownOffX = (rng() - 0.5) * crownAsymmetry * crownMaxR * 2;
  const crownOffZ = (rng() - 0.5) * crownAsymmetry * crownMaxR * 2;

  /** Evaluate how "inside" the crown envelope a point is (0=outside, 1=center) */
  function crownDensity(pos: Vec3): number {
    const dx = pos[0] - crownOffX - leanX * 0.5;
    const dz = pos[2] - crownOffZ;
    const dy = pos[1] - crownCenterY;
    const rh = crownMaxR || 1;
    const hh = crownMaxH * 0.5 || 1;

    let dist: number;
    if (crownShape === "CONE") {
      const coneT = clamp((dy + hh) / (2 * hh), 0, 1);
      const coneR = rh * (1 - coneT * 0.7);
      dist = Math.sqrt(dx * dx + dz * dz) / coneR;
      if (dy > hh || dy < -hh) return 0;
    } else if (crownShape === "COLUMNAR") {
      dist = Math.sqrt(dx * dx + dz * dz) / (rh * 0.5);
      if (Math.abs(dy) > hh * 1.2) return 0;
    } else if (crownShape === "UMBRELLA") {
      const umbT = clamp((dy + hh * 0.3) / (hh * 0.7), 0, 1);
      const umbR = rh * (0.3 + 0.7 * Math.sqrt(umbT));
      dist = Math.sqrt(dx * dx + dz * dz) / umbR;
      if (dy > hh * 0.3 || dy < -hh) return 0;
    } else {
      // SPHERE/ELLIPSOID
      dist = Math.sqrt(dx * dx / (rh * rh) + dy * dy / (hh * hh) + dz * dz / (rh * rh));
    }

    if (crownFlatTop > 0 && dy > hh * (1 - crownFlatTop)) {
      return 0;
    }

    if (dist > 1) return 0;
    return Math.pow(1 - dist, crownDensityFalloff);
  }

  function tangentFrame(tan: Vec3): { right: Vec3; up: Vec3 } {
    const ref: Vec3 = Math.abs(tan[1]) > 0.99 ? [1, 0, 0] : [0, 1, 0];
    const right = v3normalize(v3cross(tan, ref));
    const up = v3normalize(v3cross(right, tan));
    return { right, up };
  }

  // --- TRUNK ---
  const trunkBaseVert = wood.positions.length / 3;
  for (let r = 0; r <= rings; r++) {
    const t = r / rings;
    const y = t * trunkTopY;

    // Centerline with knot bends + crookedness
    let cx = t * t * leanX;
    let cz = t * t * leanZ;
    for (const k of knots) {
      const d = (t - k.t) / k.width;
      const g = Math.exp(-d * d * 0.5);
      cx += k.dx * k.amp * g;
      cz += k.dz * k.amp * g;
    }
    for (const c of crookOffsets) {
      const d = (t - c.t) / 0.15;
      const g = Math.exp(-d * d * 0.5);
      cx += c.dx * g;
      cz += c.dz * g;
    }

    // Radius with taper and flare
    // Radius with taper and flare - ensure minimum radius at top
    let radius = baseRadius * Math.pow(Math.max(0.001, 1 - t), taper);
    radius = Math.max(radius, trunkTopMinRadius * (1 - t * 0.3)); // never taper to a point
    if (t < 0.1) {
      radius *= 1 + (flare - 1) * Math.pow(1 - t / 0.1, 2);
    }

    const twistRad = (t * twistDeg * Math.PI) / 180;

    for (let s = 0; s <= segments; s++) {
      const theta = (s / segments) * Math.PI * 2 + twistRad;
      const cosT = Math.cos(theta);
      const sinT = Math.sin(theta);

      // Ovality
      let rx = radius * (1 + trunkOvality * 0.5);
      let rz = radius * (1 - trunkOvality * 0.5);

      // Buttress flares at base
      if (buttressStrength > 0 && t < 0.15) {
        const buttressPhase = theta * buttressCount * 0.5;
        const buttressEnv = Math.pow(Math.max(0, Math.cos(buttressPhase)), 3);
        const buttressT = Math.pow(1 - t / 0.15, 2);
        rx += buttressStrength * buttressEnv * buttressT * baseRadius * 0.5;
        rz += buttressStrength * buttressEnv * buttressT * baseRadius * 0.5;
      }

      // Fluting
      if (flutingStrength > 0) {
        const flute = Math.sin(theta * flutingCount) * flutingStrength * 0.05 * radius;
        rx += flute;
        rz += flute;
      }

      // Deep bark furrows
      const barkN1 = fbm2(theta * barkFurrowFreq + seed * 0.1, y * 3.5, 4);
      const barkN2 = fbm2(theta * barkFurrowFreq * 2.3 + 7.7, y * 6.1 + 3.3, 3);
      const furrow = (barkN1 * 0.7 + barkN2 * 0.3) * barkFurrowDepth * radius * 0.08;
      const barkDisp = furrow;

      const px = cosT * rx + barkDisp * cosT + cx;
      const py = y;
      const pz = sinT * rz + barkDisp * sinT + cz;

      const nx = cosT * (1 + barkDisp * 0.5);
      const nz = sinT * (1 + barkDisp * 0.5);
      const nl = Math.sqrt(nx * nx + nz * nz) || 1;

      wood.positions.push(px, py, pz);
      wood.normals.push(nx / nl, 0, nz / nl);

      // Bark color with variation, moss, and furrow darkening
      const furrowDark = 1 - barkN1 * barkFurrowDepth * 0.3;
      const cv = (rng() - 0.5) * barkColorVar;
      let cr = trunkColor[0] * furrowDark + cv;
      let cg = trunkColor[1] * furrowDark + cv;
      let cb = trunkColor[2] * furrowDark + cv;

      // Moss blending (more on north-facing / upper side)
      if (barkMossBlend > 0) {
        const mossChance = barkMossBlend * clamp(sinT * 0.5 + 0.5, 0, 1) * clamp(1 - t * 0.5, 0, 1);
        const mossNoise = fbm2(theta * 4 + seed * 0.3, y * 2, 3);
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

  // Trunk indices
  for (let r = 0; r < rings; r++) {
    for (let s = 0; s < segments; s++) {
      const a = trunkBaseVert + r * (segments + 1) + s;
      const b = a + segments + 1;
      wood.indices.push(a, b, a + 1, a + 1, b, b + 1);
    }
  }

  // --- BRANCHES ---
  function addTube(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, r0: number, r1: number, order: number, isDead: boolean = false) {
    const tubeSeg = Math.max(4, 10 - order);
    const tubeRing = Math.max(5, 10 - order);
    const baseIdx = wood.positions.length / 3;

    for (let i = 0; i <= tubeSeg; i++) {
      const t = i / tubeSeg;
      const pos = bezierPoint(p0, p1, p2, p3, t);
      const tan = bezierTangent(p0, p1, p2, p3, t);
      const { right, up } = tangentFrame(tan);
      const rad = r0 + (r1 - r0) * Math.pow(t, 0.7); // Non-linear taper for more natural look

      for (let j = 0; j <= tubeRing; j++) {
        const angle = (j / tubeRing) * Math.PI * 2;
        const nx = Math.cos(angle);
        const nz = Math.sin(angle);

        // Bark bump on branches
        const bumpScale = order <= 1 ? 0.6 : 0.3;
        const bump = fbm2(angle * 4 + pos[1] * 3, pos[0] * 2 + pos[2] * 2, 2) * bumpScale * 0.02 * rad;
        const radFinal = rad + bump;

        const normal = v3add(v3scale(right, nx), v3scale(up, nz));
        const vertex = v3add(pos, v3scale(normal, radFinal));

        wood.positions.push(vertex[0], vertex[1], vertex[2]);
        wood.normals.push(normal[0], normal[1], normal[2]);

        const darkening = isDead ? 0.6 : (1 - order * 0.04);
        const cVar = (rng() - 0.5) * barkColorVar * 0.5;
        const heightDark = 1 - clamp(pos[1] / height, 0, 0.3) * 0.15;
        wood.colors.push(
          clamp(trunkColor[0] * darkening * heightDark + cVar, 0, 1),
          clamp(trunkColor[1] * darkening * heightDark + cVar + (isDead ? -0.02 : 0), 0, 1),
          clamp(trunkColor[2] * darkening * heightDark + cVar, 0, 1)
        );
      }
    }

    for (let i = 0; i < tubeSeg; i++) {
      for (let j = 0; j < tubeRing; j++) {
        const a = baseIdx + i * (tubeRing + 1) + j;
        const b = a + tubeRing + 1;
        wood.indices.push(a, b, a + 1, a + 1, b, b + 1);
      }
    }
  }

  /** Create a diamond/elliptical leaf card instead of a flat quad */
  function addLeafCard(center: Vec3, right: Vec3, up: Vec3, normal: Vec3, size: number, isDead: boolean, isUnder: boolean) {
    const baseIdx = leaves.positions.length / 3;
    const w = size;
    const h = size * leafAspect;

    // Diamond shape: 5 vertices (center, tip, left, bottom, right) for more natural look
    // Or 6 vertices for an elongated leaf with midrib curve
    const curlAmount = leafCurl * (rng() * 0.5 + 0.5);

    // Leaf vertices: elongated diamond with slight curl
    // tip (top)
    const tip = v3add(center, v3add(v3scale(up, h * 0.5), v3scale(normal, -curlAmount * h * 0.2)));
    // widest left
    const left = v3add(center, v3add(v3scale(right, -w * 0.5), v3scale(up, h * 0.05)));
    // widest right
    const rt = v3add(center, v3add(v3scale(right, w * 0.5), v3scale(up, h * 0.05)));
    // base (bottom)
    const base = v3add(center, v3add(v3scale(up, -h * 0.35), v3scale(normal, curlAmount * h * 0.1)));
    // mid-upper left
    const midUL = v3add(center, v3add(v3scale(right, -w * 0.35), v3scale(up, h * 0.28)));
    // mid-upper right
    const midUR = v3add(center, v3add(v3scale(right, w * 0.35), v3scale(up, h * 0.28)));

    // Push 6 vertices
    const verts = [tip, midUL, left, base, rt, midUR];
    for (const v of verts) {
      leaves.positions.push(v[0], v[1], v[2]);
      leaves.normals.push(normal[0], normal[1], normal[2]);
    }

    // Color with seasonal blending
    let baseColor = leafColor;
    if (isDead) {
      baseColor = deadLeafColor;
    } else if (leafSeasonalBlend > 0) {
      baseColor = lerpColor(leafColor, autumnColor, leafSeasonalBlend);
    }

    for (let j = 0; j < 6; j++) {
      const vr = (rng() - 0.5) * leafColorVar;
      const underMul = (j >= 2 && j <= 4 && isUnder) ? (1 + leafUndersideLighten) : 1.0;
      leaves.colors.push(
        clamp((baseColor[0] + vr) * underMul, 0, 1),
        clamp((baseColor[1] + vr * 0.5) * underMul, 0, 1),
        clamp((baseColor[2] + vr) * underMul, 0, 1)
      );
    }

    // 4 triangles forming diamond
    leaves.indices.push(
      baseIdx + 0, baseIdx + 1, baseIdx + 5,  // tip triangle
      baseIdx + 1, baseIdx + 2, baseIdx + 3,  // left triangle
      baseIdx + 1, baseIdx + 3, baseIdx + 5,  // center triangle
      baseIdx + 5, baseIdx + 3, baseIdx + 4,  // right triangle
    );
  }

  function addLeafCluster(pos: Vec3, dir: Vec3, order: number, branchLength: number) {
    // Sparse if health is low
    if (rng() < canopySparseness) return;

    const count = Math.max(3, Math.round(leafClusterSize * (0.5 + 0.5 * age01) * healthVigor));
    const clusterRadius = leafSize * 3.5 * leafClusterSpread * (1 + (maxOrder - order) * 0.25);

    // Check if inside crown
    const density = crownDensity(pos);
    if (density < crownOpenness) return;

    const effectiveCount = Math.round(count * density);

    for (let i = 0; i < effectiveCount; i++) {
      // Random offset in cluster sphere, biased upward
      const phi = rng() * Math.PI * 2;
      const cosTheta = rng() * 2 - 1;
      const r = Math.pow(rng(), 0.5) * clusterRadius;
      const sinTheta = Math.sqrt(1 - cosTheta * cosTheta);
      const rx = r * sinTheta * Math.cos(phi);
      const ry = r * sinTheta * Math.sin(phi) * 0.7 + r * 0.2; // bias upward
      const rz = r * cosTheta;
      const center: Vec3 = [pos[0] + rx, pos[1] + ry, pos[2] + rz];

      // Orientation: mix between random and upward-seeking
      const yaw = rng() * Math.PI * 2;
      const hangRad = (leafHangDeg * Math.PI / 180) * (0.5 + rng() * 0.5);
      const basePitch = Math.PI * 0.5 - hangRad; // mostly horizontal with hang

      // Sun-seeking bias: normals point more upward
      const seekUp = leafSunSeek * (0.5 + rng() * 0.5);

      let normal: Vec3 = [
        Math.cos(yaw) * Math.cos(basePitch) * (1 - leafOrientBias),
        Math.sin(basePitch) * (1 - seekUp) + seekUp,
        Math.sin(yaw) * Math.cos(basePitch) * (1 - leafOrientBias),
      ];
      normal = v3normalize(normal);
      const isUnder = normal[1] < 0;

      const { right, up } = tangentFrame(normal);

      const s = leafSize * (1 - leafSizeVar * 0.5 + rng() * leafSizeVar);

      const isDead = rng() < deadLeafRatio;

      addLeafCard(center, right, up, normal, s, isDead, isUnder);
    }
  }

  function generateBranch(
    startPos: Vec3, startDir: Vec3, length: number, radius: number,
    order: number, depth: number
  ) {
    if (order > maxOrder || depth > 32 || length < 0.08 || radius < 0.002) return;

    const isDead = rng() < deadBranchRatio;
    const isBroken = rng() < breakProbability;

    // Gravity + phototropism
    const gravBend = -gravityResponse * order * 0.08;
    const droopAmount = branchDroop + droopIncrease * order;
    const isConifer = profile.includes("PINE") || profile.includes("SPRUCE");
    const isWillow = profile.includes("WILLOW");

    const dir = v3normalize([
      startDir[0] + (rng() - 0.5) * 0.12 + phototropism * 0.02,
      startDir[1] + gravBend - droopAmount + (isWillow ? -0.15 * order : 0),
      startDir[2] + (rng() - 0.5) * 0.12,
    ]);

    let effectiveLength = length;
    if (isBroken) {
      effectiveLength *= (1 - breakSeverity * (0.3 + rng() * 0.7));
    }

    const p0 = startPos;
    const p3: Vec3 = v3add(p0, v3scale(dir, effectiveLength));

    // Curved control points with curvature parameter
    const curveMag = branchCurvature * effectiveLength;
    const p1 = v3lerp(p0, p3, 0.33);
    const p2 = v3lerp(p0, p3, 0.66);

    // Natural curvature: slight S-curve with gravity
    p1[0] += (rng() - 0.5) * curveMag * 0.6;
    p1[1] += (rng() - 0.3) * curveMag * 0.3 - droopAmount * effectiveLength * 0.15;
    p1[2] += (rng() - 0.5) * curveMag * 0.6;
    p2[0] += (rng() - 0.5) * curveMag * 0.8;
    p2[1] += (rng() - 0.5) * curveMag * 0.2 - droopAmount * effectiveLength * 0.25;
    p2[2] += (rng() - 0.5) * curveMag * 0.8;

    const r1 = radius * (isBroken ? 0.5 : 0.25);
    addTube(p0, p1, p2, p3, radius, r1, order, isDead);

    // Add leaves at terminal or near-terminal branches (not on dead/broken)
    if (!isDead && !isBroken && order >= maxOrder - 1) {
      // Multiple leaf clusters along the branch
      const leafPoints = order >= maxOrder ? 1 : 2;
      for (let lp = 0; lp < leafPoints; lp++) {
        const lt = 0.5 + lp * 0.3;
        const leafPos = bezierPoint(p0, p1, p2, p3, lt);
        addLeafCluster(leafPos, dir, order, effectiveLength);
      }
      // Always at tip
      addLeafCluster(p3, dir, order, effectiveLength);
    }

    if (isBroken) return; // No children on broken branches

    // Spawn child branches
    const childBudget = Math.max(1, Math.round(
      (isConifer ? 5 - order * 0.4 : 4 - order * 0.5) * (0.6 + 0.4 * age01) * healthVigor
    ));

    for (let c = 0; c < childBudget; c++) {
      if (rng() > branchProb) continue;

      const tAttach = 0.2 + rng() * 0.6;
      const attachPos = bezierPoint(p0, p1, p2, p3, tAttach);
      const attachTan = bezierTangent(p0, p1, p2, p3, tAttach);

      const tiltAngle = angleMean + (rng() - 0.5) * angleVar;
      const azimuth = rng() * Math.PI * 2;

      const { right, up } = tangentFrame(attachTan);

      // Phototropism: bias branches toward light (upward)
      const photoUp = phototropism * 0.1;

      const childDir = v3normalize(v3add(
        v3scale(attachTan, Math.cos(tiltAngle)),
        v3add(
          v3scale(right, Math.sin(tiltAngle) * Math.cos(azimuth)),
          v3add(
            v3scale(up, Math.sin(tiltAngle) * Math.sin(azimuth)),
            [0, photoUp, 0]
          )
        )
      ));

      const childLen = effectiveLength * lengthDecay * (0.65 + rng() * 0.35);
      const childRad = radius * radiusDecay * (0.65 + rng() * 0.35);

      generateBranch(attachPos, childDir, childLen, childRad, order + 1, depth + 1);
    }

    // Forking
    if (rng() < forkProbability && order < maxOrder - 1) {
      const forkT = 0.5 + rng() * 0.3;
      const forkPos = bezierPoint(p0, p1, p2, p3, forkT);
      const forkTan = bezierTangent(p0, p1, p2, p3, forkT);
      const { right: fr } = tangentFrame(forkTan);
      const forkDir = v3normalize(v3add(forkTan, v3scale(fr, (rng() - 0.5) * 0.6)));
      generateBranch(forkPos, forkDir, effectiveLength * 0.5, radius * 0.6, order, depth + 1);
    }

    // Apical continuation
    if (rng() < apicalDom * 0.6 && order < maxOrder && !isDead) {
      const contDir = v3normalize(v3add(dir, [
        (rng() - 0.5) * 0.08 + phototropism * 0.03,
        isConifer ? 0.12 : 0.04,
        (rng() - 0.5) * 0.08,
      ]));
      const contLen = effectiveLength * 0.55;
      const contRad = r1 * 0.85;
      generateBranch(p3, contDir, contLen, contRad, order, depth + 1);
    }
  }

  // --- SPAWN MAIN BRANCHES ---
  const isConifer = profile.includes("PINE") || profile.includes("SPRUCE");
  for (let i = 0; i < rawBranchCount; i++) {
    const hNorm = i / rawBranchCount;
    let t: number;
    if (isConifer) {
      t = firstBranchHeight * 0.6 + hNorm * (1 - firstBranchHeight * 0.6) * 0.85;
    } else if (profile.includes("WILLOW")) {
      t = firstBranchHeight + hNorm * (0.85 - firstBranchHeight);
    } else if (profile.includes("ACACIA")) {
      t = firstBranchHeight * 1.5 + hNorm * (0.9 - firstBranchHeight * 1.5);
    } else {
      t = firstBranchHeight + hNorm * (0.85 - firstBranchHeight);
    }

    const y = t * trunkTopY;
    const az = (i / rawBranchCount) * Math.PI * 2 + rng() * 0.4;
    const trunkR = baseRadius * Math.pow(Math.max(0.001, 1 - t), taper);

    // Apply trunk centerline offset at this height
    let tcx = t * t * leanX;
    let tcz = t * t * leanZ;
    for (const k of knots) {
      const d = (t - k.t) / k.width;
      const g = Math.exp(-d * d * 0.5);
      tcx += k.dx * k.amp * g;
      tcz += k.dz * k.amp * g;
    }

    const startPos: Vec3 = [
      Math.cos(az) * trunkR + tcx,
      y,
      Math.sin(az) * trunkR + tcz,
    ];

    let tiltBase = angleMean;
    if (isConifer) tiltBase *= 0.7;
    const dir = v3normalize([
      Math.cos(az) * Math.sin(tiltBase),
      Math.cos(tiltBase) * (isConifer ? 0.3 + 0.5 * (1 - hNorm) : 0.45 + phototropism * 0.1),
      Math.sin(az) * Math.sin(tiltBase),
    ]);

    const branchLen = height * branchLenRatio * (0.4 + 0.6 * (isConifer ? 1 - hNorm * 0.6 : 1 - hNorm * 0.3));
    const branchRad = trunkR * 0.38 * (0.6 + 0.4 * (1 - hNorm));

    generateBranch(startPos, dir, branchLen, branchRad, 1, 0);
  }

  // --- LEADER ---
  const leaderDir: Vec3 = v3normalize([
    leanX * 0.3 + (rng() - 0.5) * 0.08,
    1,
    leanZ * 0.3 + (rng() - 0.5) * 0.08,
  ]);
  const leaderLen = height * 0.4 * apicalDom;
  const leaderRad = Math.max(trunkTopMinRadius, baseRadius * Math.pow(0.4, taper) * 0.5);
  // Compute trunk top centerline using same formula as trunk ring at t=1.0
  let trunkTopCx = 1.0 * leanX; // t=1.0 so t*t = 1.0
  let trunkTopCz = 1.0 * leanZ;
  for (const k of knots) {
    const d = (1.0 - k.t) / k.width;
    const g = Math.exp(-d * d * 0.5);
    trunkTopCx += k.dx * k.amp * g;
    trunkTopCz += k.dz * k.amp * g;
  }
  for (const c of crookOffsets) {
    const d = (1.0 - c.t) / 0.15;
    const g = Math.exp(-d * d * 0.5);
    trunkTopCx += c.dx * g;
    trunkTopCz += c.dz * g;
  }
  const trunkTop: Vec3 = [trunkTopCx, trunkTopY, trunkTopCz];
  generateBranch(trunkTop, leaderDir, leaderLen, leaderRad, 1, 0);

  // --- EPICORMIC SHOOTS ---
  if (epicormicDensity > 0) {
    const epicCount = Math.round(epicormicDensity * rawBranchCount * 0.5);
    for (let i = 0; i < epicCount; i++) {
      const t = 0.15 + rng() * 0.5;
      const y = t * trunkTopY;
      const az = rng() * Math.PI * 2;
      const trunkR = baseRadius * Math.pow(Math.max(0.001, 1 - t), taper);
      let ecx = t * t * leanX;
      let ecz = t * t * leanZ;
      const pos: Vec3 = [Math.cos(az) * trunkR + ecx, y, Math.sin(az) * trunkR + ecz];
      const dir: Vec3 = v3normalize([Math.cos(az) * 0.6, 0.5, Math.sin(az) * 0.6]);
      const epicLen = height * 0.08 * (0.5 + rng() * 0.5);
      generateBranch(pos, dir, epicLen, baseRadius * 0.03, maxOrder - 1, 0);
    }
  }

  // --- ROOTS ---
  if (rootCount > 0 && rootVis > 0.001) {
    for (let r = 0; r < rootCount; r++) {
      const rootAngle = (r / rootCount) * Math.PI * 2 + rng() * 0.4;
      const rootLen = baseRadius * rootSpreadRadius * rootVis * (0.7 + rng() * 0.6);
      const rootRad = baseRadius * 0.38 * rootVis;

      const rootStart: Vec3 = [
        Math.cos(rootAngle) * baseRadius * 0.55,
        -0.02,
        Math.sin(rootAngle) * baseRadius * 0.55,
      ];

      // Undulating root path
      const rootEnd: Vec3 = [
        Math.cos(rootAngle) * (baseRadius + rootLen),
        -rootLen * rootDepth - 0.1,
        Math.sin(rootAngle) * (baseRadius + rootLen),
      ];

      const rp1 = v3lerp(rootStart, rootEnd, 0.3);
      rp1[1] = -0.03 + rootUndulation * 0.05 * Math.sin(rng() * Math.PI * 2);
      const rp2 = v3lerp(rootStart, rootEnd, 0.65);
      rp2[1] = rootEnd[1] * 0.4 + rootUndulation * 0.04 * Math.sin(rng() * Math.PI * 2);
      // Slight lateral wiggle
      const perpX = -Math.sin(rootAngle);
      const perpZ = Math.cos(rootAngle);
      rp1[0] += perpX * rootUndulation * 0.1 * (rng() - 0.5);
      rp1[2] += perpZ * rootUndulation * 0.1 * (rng() - 0.5);
      rp2[0] += perpX * rootUndulation * 0.15 * (rng() - 0.5);
      rp2[2] += perpZ * rootUndulation * 0.15 * (rng() - 0.5);

      const rootEndRad = rootRad * (1 - rootTaper) * 0.3;
      addTube(rootStart, rp1, rp2, rootEnd, rootRad, rootEndRad, 2);

      // Secondary roots branching off
      if (rootSecondaryCount > 0) {
        for (let sr = 0; sr < rootSecondaryCount; sr++) {
          const st = 0.3 + rng() * 0.5;
          const sPos = bezierPoint(rootStart, rp1, rp2, rootEnd, st);
          const sAngle = rootAngle + (rng() - 0.5) * 1.2;
          const sLen = rootLen * rootSecondaryLength * (0.4 + rng() * 0.6);
          const sEnd: Vec3 = [
            sPos[0] + Math.cos(sAngle) * sLen,
            sPos[1] - sLen * 0.2,
            sPos[2] + Math.sin(sAngle) * sLen,
          ];
          const sp1 = v3lerp(sPos, sEnd, 0.33);
          const sp2 = v3lerp(sPos, sEnd, 0.66);
          sp1[1] += 0.02 * rootUndulation;
          addTube(sPos, sp1, sp2, sEnd, rootRad * 0.3, rootRad * 0.05, 3);
        }
      }
    }
  }

  return {
    wood,
    leaves,
    meta: { height, trunkTop: trunkTopY, vertCount: wood.positions.length / 3 + leaves.positions.length / 3 },
  };
}
