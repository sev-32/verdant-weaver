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

// Species profile multipliers
const SPECIES_MULS: Record<string, Record<string, number>> = {
  PINE_CONIFER:       { branchCount: 1.35, branchProb: 1.08, apical: 1.28, angle: 0.72, angleVar: 0.62, lengthRatio: 0.82, lengthDecay: 0.94, radiusDecay: 0.93 },
  SPRUCE_CONICAL:     { branchCount: 1.42, branchProb: 1.12, apical: 1.36, angle: 0.62, angleVar: 0.52, lengthRatio: 0.74, lengthDecay: 0.92, radiusDecay: 0.90 },
  WILLOW_WEEPING:     { branchCount: 1.18, branchProb: 1.04, apical: 0.76, angle: 1.22, angleVar: 1.18, lengthRatio: 1.14, lengthDecay: 0.90, radiusDecay: 0.95 },
  BIRCH_UPRIGHT:      { branchCount: 0.88, branchProb: 0.92, apical: 1.10, angle: 0.84, angleVar: 0.75, lengthRatio: 0.90, lengthDecay: 0.96, radiusDecay: 0.90 },
  ACACIA_SAVANNA:     { branchCount: 0.86, branchProb: 1.08, apical: 0.52, angle: 1.34, angleVar: 1.35, lengthRatio: 1.24, lengthDecay: 0.86, radiusDecay: 0.92 },
  OAK_MAPLE:          { branchCount: 1.08, branchProb: 1.00, apical: 0.92, angle: 1.08, angleVar: 1.08, lengthRatio: 1.08, lengthDecay: 0.98, radiusDecay: 1.00 },
  BROADLEAF_DECIDUOUS:{ branchCount: 1.00, branchProb: 1.00, apical: 1.00, angle: 1.00, angleVar: 1.00, lengthRatio: 1.00, lengthDecay: 1.00, radiusDecay: 1.00 },
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
  const leafClusterSize = getP("leafClusterSize", "vegetation.leaves.clusterSize", 12) as number;
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
  const windStr = getP("windStrength", "vegetation.wind.gustStrength", 0.6) as number;
  const restLean = getP("restLean", "vegetation.wind.restLean", 0.22) as number;

  const trunkColor = hexToRgb(trunkColorHex);
  const leafColor = hexToRgb(leafColorHex);

  const wood = { positions: [] as number[], normals: [] as number[], colors: [] as number[], indices: [] as number[] };
  const leaves = { positions: [] as number[], normals: [] as number[], colors: [] as number[], indices: [] as number[] };

  const trunkTopY = height * 0.6;
  const segments = 14;
  const rings = 18;

  // Generate knot positions along trunk
  const knots: { t: number; dx: number; dz: number; amp: number; width: number }[] = [];
  for (let i = 0; i < knotCount; i++) {
    knots.push({
      t: 0.2 + rng() * 0.6,
      dx: (rng() - 0.5) * 2,
      dz: (rng() - 0.5) * 2,
      amp: knotStrength * (0.5 + rng() * 0.5),
      width: 0.08 + rng() * 0.12,
    });
  }

  // Lean direction
  const leanX = restLean * (0.5 + rng() * 0.5);
  const leanZ = restLean * (rng() - 0.5) * 0.3;

  // --- TRUNK ---
  const trunkBaseVert = wood.positions.length / 3;
  for (let r = 0; r <= rings; r++) {
    const t = r / rings;
    const y = t * trunkTopY;

    // Centerline with knot bends
    let cx = t * t * leanX;
    let cz = t * t * leanZ;
    for (const k of knots) {
      const d = (t - k.t) / k.width;
      const g = Math.exp(-d * d * 0.5);
      cx += k.dx * k.amp * g;
      cz += k.dz * k.amp * g;
    }

    // Radius with taper and flare
    let radius = baseRadius * Math.pow(Math.max(0.001, 1 - t), taper);
    if (t < 0.1) {
      radius *= 1 + (flare - 1) * Math.pow(1 - t / 0.1, 2);
    }

    const twistRad = (t * twistDeg * Math.PI) / 180;

    for (let s = 0; s <= segments; s++) {
      const theta = (s / segments) * Math.PI * 2 + twistRad;
      const barkNoise = fbm2(theta * 3, y * 2.5, 3) * 0.015 * radius;
      const r2 = radius + barkNoise;
      const nx = Math.cos(theta);
      const nz = Math.sin(theta);

      wood.positions.push(nx * r2 + cx, y, nz * r2 + cz);
      wood.normals.push(nx, 0, nz);

      const cVar = (rng() - 0.5) * 0.04;
      wood.colors.push(trunkColor[0] + cVar, trunkColor[1] + cVar, trunkColor[2] + cVar);
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
  function tangentFrame(tan: Vec3): { right: Vec3; up: Vec3 } {
    const ref: Vec3 = Math.abs(tan[1]) > 0.99 ? [1, 0, 0] : [0, 1, 0];
    const right = v3normalize(v3cross(tan, ref));
    const up = v3normalize(v3cross(right, tan));
    return { right, up };
  }

  function addTube(p0: Vec3, p1: Vec3, p2: Vec3, p3: Vec3, r0: number, r1: number, order: number) {
    const tubeSeg = Math.max(3, 8 - order);
    const tubeRing = Math.max(4, 8 - order);
    const baseIdx = wood.positions.length / 3;

    for (let i = 0; i <= tubeSeg; i++) {
      const t = i / tubeSeg;
      const pos = bezierPoint(p0, p1, p2, p3, t);
      const tan = bezierTangent(p0, p1, p2, p3, t);
      const { right, up } = tangentFrame(tan);
      const rad = r0 + (r1 - r0) * t;

      for (let j = 0; j <= tubeRing; j++) {
        const angle = (j / tubeRing) * Math.PI * 2;
        const nx = Math.cos(angle);
        const nz = Math.sin(angle);
        const normal = v3add(v3scale(right, nx), v3scale(up, nz));
        const vertex = v3add(pos, v3scale(normal, rad));

        wood.positions.push(vertex[0], vertex[1], vertex[2]);
        wood.normals.push(normal[0], normal[1], normal[2]);

        const darkening = 1 - order * 0.06;
        const cVar = (rng() - 0.5) * 0.03;
        wood.colors.push(
          trunkColor[0] * darkening + cVar,
          trunkColor[1] * darkening + cVar,
          trunkColor[2] * darkening + cVar
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

  function addLeafCluster(pos: Vec3, dir: Vec3, order: number) {
    const count = Math.max(3, Math.round(leafClusterSize * (0.5 + 0.5 * age01)));
    const clusterRadius = leafSize * 4 * (1 + (maxOrder - order) * 0.3);

    for (let i = 0; i < count; i++) {
      const baseIdx = leaves.positions.length / 3;

      // Random offset in cluster sphere
      const rx = (rng() - 0.5) * 2 * clusterRadius;
      const ry = (rng() - 0.3) * 2 * clusterRadius;
      const rz = (rng() - 0.5) * 2 * clusterRadius;
      const center: Vec3 = [pos[0] + rx, pos[1] + ry, pos[2] + rz];

      // Random orientation
      const yaw = rng() * Math.PI * 2;
      const pitch = (rng() - 0.5) * Math.PI * 0.6;
      const normal: Vec3 = [
        Math.cos(yaw) * Math.cos(pitch),
        Math.sin(pitch) + 0.3,
        Math.sin(yaw) * Math.cos(pitch),
      ];
      const n = v3normalize(normal);
      const { right, up } = tangentFrame(n);

      const s = leafSize * (0.6 + rng() * 0.8);
      const v0 = v3add(center, v3add(v3scale(right, -s), v3scale(up, -s)));
      const v1 = v3add(center, v3add(v3scale(right, s), v3scale(up, -s)));
      const v2 = v3add(center, v3add(v3scale(right, s), v3scale(up, s)));
      const v3p = v3add(center, v3add(v3scale(right, -s), v3scale(up, s)));

      leaves.positions.push(
        v0[0], v0[1], v0[2], v1[0], v1[1], v1[2],
        v2[0], v2[1], v2[2], v3p[0], v3p[1], v3p[2]
      );
      for (let j = 0; j < 4; j++) leaves.normals.push(n[0], n[1], n[2]);

      const cv = leafColorVar;
      for (let j = 0; j < 4; j++) {
        const vr = (rng() - 0.5) * cv;
        leaves.colors.push(leafColor[0] + vr, leafColor[1] + vr * 0.5, leafColor[2] + vr);
      }

      leaves.indices.push(baseIdx, baseIdx + 1, baseIdx + 2, baseIdx, baseIdx + 2, baseIdx + 3);
    }
  }

  function generateBranch(
    startPos: Vec3, startDir: Vec3, length: number, radius: number,
    order: number, depth: number
  ) {
    if (order > maxOrder || depth > 32 || length < 0.12 || radius < 0.003) return;

    const gravityBend = -0.08 * order;
    const isConifer = profile.includes("PINE") || profile.includes("SPRUCE");
    const isWillow = profile.includes("WILLOW");

    const dir = v3normalize([
      startDir[0] + (rng() - 0.5) * 0.15,
      startDir[1] + gravityBend + (isWillow ? -0.12 * order : 0),
      startDir[2] + (rng() - 0.5) * 0.15,
    ]);

    const p0 = startPos;
    const p3: Vec3 = v3add(p0, v3scale(dir, length));
    const p1 = v3lerp(p0, p3, 0.33);
    const p2 = v3lerp(p0, p3, 0.66);

    // Add some randomness to control points
    p1[0] += (rng() - 0.5) * length * 0.08;
    p1[2] += (rng() - 0.5) * length * 0.08;
    p2[0] += (rng() - 0.5) * length * 0.12;
    p2[1] += (rng() - 0.5) * length * 0.06;
    p2[2] += (rng() - 0.5) * length * 0.12;

    const r1 = radius * 0.3;
    addTube(p0, p1, p2, p3, radius, r1, order);

    // Add leaves at terminal or near-terminal branches
    if (order >= maxOrder - 1) {
      addLeafCluster(p3, dir, order);
    }

    // Spawn child branches
    const childBudget = Math.max(1, Math.round(
      (isConifer ? 5 - order * 0.5 : 4 - order * 0.6) * (0.6 + 0.4 * age01)
    ));

    for (let c = 0; c < childBudget; c++) {
      if (rng() > branchProb) continue;

      const tAttach = 0.25 + rng() * 0.55;
      const attachPos = bezierPoint(p0, p1, p2, p3, tAttach);
      const attachTan = bezierTangent(p0, p1, p2, p3, tAttach);

      const tiltAngle = angleMean + (rng() - 0.5) * angleVar;
      const azimuth = rng() * Math.PI * 2;

      const { right, up } = tangentFrame(attachTan);
      const childDir = v3normalize(v3add(
        v3scale(attachTan, Math.cos(tiltAngle)),
        v3add(
          v3scale(right, Math.sin(tiltAngle) * Math.cos(azimuth)),
          v3scale(up, Math.sin(tiltAngle) * Math.sin(azimuth))
        )
      ));

      const childLen = length * lengthDecay * (0.7 + rng() * 0.3);
      const childRad = radius * radiusDecay * (0.7 + rng() * 0.3);

      generateBranch(attachPos, childDir, childLen, childRad, order + 1, depth + 1);
    }

    // Apical continuation
    if (rng() < apicalDom * 0.6 && order < maxOrder) {
      const contDir = v3normalize(v3add(dir, [
        (rng() - 0.5) * 0.1,
        isConifer ? 0.15 : 0.05,
        (rng() - 0.5) * 0.1,
      ]));
      const contLen = length * 0.6;
      const contRad = r1 * 0.9;
      generateBranch(p3, contDir, contLen, contRad, order, depth + 1);
    }
  }

  // --- SPAWN MAIN BRANCHES ---
  const isConifer = profile.includes("PINE") || profile.includes("SPRUCE");
  for (let i = 0; i < rawBranchCount; i++) {
    const hNorm = i / rawBranchCount;
    let t: number;
    if (isConifer) {
      t = 0.15 + hNorm * 0.8;
    } else if (profile.includes("WILLOW")) {
      t = 0.3 + hNorm * 0.55;
    } else if (profile.includes("ACACIA")) {
      t = 0.4 + hNorm * 0.5;
    } else {
      t = 0.25 + hNorm * 0.6;
    }

    const y = t * trunkTopY;
    const az = (i / rawBranchCount) * Math.PI * 2 + rng() * 0.4;
    const trunkR = baseRadius * Math.pow(Math.max(0.001, 1 - t), taper);
    const startPos: Vec3 = [
      Math.cos(az) * trunkR + t * t * leanX,
      y,
      Math.sin(az) * trunkR + t * t * leanZ,
    ];

    let tiltBase = angleMean;
    if (isConifer) tiltBase *= 0.7;
    const dir = v3normalize([
      Math.cos(az) * Math.sin(tiltBase),
      Math.cos(tiltBase) * (isConifer ? 0.3 + 0.5 * (1 - hNorm) : 0.5),
      Math.sin(az) * Math.sin(tiltBase),
    ]);

    const branchLen = height * branchLenRatio * (0.4 + 0.6 * (isConifer ? 1 - hNorm * 0.6 : 1 - hNorm * 0.3));
    const branchRad = trunkR * 0.4 * (0.6 + 0.4 * (1 - hNorm));

    generateBranch(startPos, dir, branchLen, branchRad, 1, 0);
  }

  // --- LEADER ---
  const leaderDir: Vec3 = v3normalize([
    leanX * 0.3 + (rng() - 0.5) * 0.1,
    1,
    leanZ * 0.3 + (rng() - 0.5) * 0.1,
  ]);
  const leaderLen = height * 0.35 * apicalDom;
  const leaderRad = baseRadius * Math.pow(0.4, taper) * 0.5;
  const trunkTop: Vec3 = [trunkTopY * leanX * 0.6, trunkTopY, trunkTopY * leanZ * 0.6];
  generateBranch(trunkTop, leaderDir, leaderLen, leaderRad, 1, 0);

  // --- ROOTS ---
  if (rootCount > 0 && rootVis > 0.001) {
    for (let r = 0; r < rootCount; r++) {
      const rootAngle = (r / rootCount) * Math.PI * 2 + rng() * 0.4;
      const rootLen = baseRadius * 3 * rootVis * (0.7 + rng() * 0.6);
      const rootRad = baseRadius * 0.35 * rootVis;

      const rootStart: Vec3 = [Math.cos(rootAngle) * baseRadius * 0.6, -0.02, Math.sin(rootAngle) * baseRadius * 0.6];
      const rootEnd: Vec3 = [
        Math.cos(rootAngle) * (baseRadius + rootLen),
        -rootLen * 0.3 - 0.1,
        Math.sin(rootAngle) * (baseRadius + rootLen),
      ];
      const rp1 = v3lerp(rootStart, rootEnd, 0.33);
      rp1[1] = -0.05;
      const rp2 = v3lerp(rootStart, rootEnd, 0.66);
      rp2[1] = rootEnd[1] * 0.5;

      addTube(rootStart, rp1, rp2, rootEnd, rootRad, rootRad * 0.2, 2);
    }
  }

  return {
    wood,
    leaves,
    meta: { height, trunkTop: trunkTopY, vertCount: wood.positions.length / 3 + leaves.positions.length / 3 },
  };
}
