import type { RockParams } from "@/types/rockParams";

type Vec3 = [number, number, number];

function v3add(a: Vec3, b: Vec3): Vec3 { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function v3scale(a: Vec3, s: number): Vec3 { return [a[0]*s, a[1]*s, a[2]*s]; }
function v3len(a: Vec3): number { return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); }
function v3normalize(a: Vec3): Vec3 {
  const l = v3len(a);
  return l > 1e-8 ? [a[0]/l, a[1]/l, a[2]/l] : [0, 1, 0];
}
function v3cross(a: Vec3, b: Vec3): Vec3 {
  return [a[1]*b[2]-a[2]*b[1], a[2]*b[0]-a[0]*b[2], a[0]*b[1]-a[1]*b[0]];
}
function v3dot(a: Vec3, b: Vec3): number { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }

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
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}

// 3D noise
function hash31(x: number, y: number, z: number): number {
  let n = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453;
  return n - Math.floor(n);
}

function noise3(x: number, y: number, z: number): number {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  const fx = x - ix, fy = y - iy, fz = z - iz;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const uz = fz * fz * (3 - 2 * fz);

  const n000 = hash31(ix, iy, iz);
  const n100 = hash31(ix+1, iy, iz);
  const n010 = hash31(ix, iy+1, iz);
  const n110 = hash31(ix+1, iy+1, iz);
  const n001 = hash31(ix, iy, iz+1);
  const n101 = hash31(ix+1, iy, iz+1);
  const n011 = hash31(ix, iy+1, iz+1);
  const n111 = hash31(ix+1, iy+1, iz+1);

  const x0 = n000 + (n100 - n000) * ux;
  const x1 = n010 + (n110 - n010) * ux;
  const x2 = n001 + (n101 - n001) * ux;
  const x3 = n011 + (n111 - n011) * ux;

  const y0 = x0 + (x1 - x0) * uy;
  const y1 = x2 + (x3 - x2) * uy;

  return y0 + (y1 - y0) * uz;
}

function fbm3(x: number, y: number, z: number, octaves: number, lacunarity: number, persistence: number): number {
  let v = 0, amp = 0.5, freq = 1;
  for (let i = 0; i < octaves; i++) {
    v += amp * noise3(x * freq, y * freq, z * freq);
    freq *= lacunarity;
    amp *= persistence;
  }
  return v;
}

// Voronoi for fractures
function voronoi3(x: number, y: number, z: number): { dist1: number; dist2: number } {
  const ix = Math.floor(x), iy = Math.floor(y), iz = Math.floor(z);
  let d1 = 999, d2 = 999;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dz = -1; dz <= 1; dz++) {
        const cx = ix + dx + hash31(ix+dx, iy+dy, iz+dz);
        const cy = iy + dy + hash31(ix+dx+37, iy+dy+91, iz+dz+53);
        const cz = iz + dz + hash31(ix+dx+71, iy+dy+13, iz+dz+29);
        const dist = Math.sqrt((x-cx)**2 + (y-cy)**2 + (z-cz)**2);
        if (dist < d1) { d2 = d1; d1 = dist; }
        else if (dist < d2) { d2 = dist; }
      }
    }
  }
  return { dist1: d1, dist2: d2 };
}

// Icosphere generation
function createIcosphere(subdivisions: number): { positions: Vec3[]; indices: number[] } {
  const t = (1 + Math.sqrt(5)) / 2;
  const verts: Vec3[] = [
    v3normalize([-1, t, 0]), v3normalize([1, t, 0]),
    v3normalize([-1, -t, 0]), v3normalize([1, -t, 0]),
    v3normalize([0, -1, t]), v3normalize([0, 1, t]),
    v3normalize([0, -1, -t]), v3normalize([0, 1, -t]),
    v3normalize([t, 0, -1]), v3normalize([t, 0, 1]),
    v3normalize([-t, 0, -1]), v3normalize([-t, 0, 1]),
  ];
  let faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ];

  const midCache: Record<string, number> = {};
  function getMid(a: number, b: number): number {
    const key = Math.min(a,b) + "_" + Math.max(a,b);
    if (midCache[key] !== undefined) return midCache[key];
    const mid = v3normalize([
      (verts[a][0] + verts[b][0]) / 2,
      (verts[a][1] + verts[b][1]) / 2,
      (verts[a][2] + verts[b][2]) / 2,
    ]);
    const idx = verts.length;
    verts.push(mid);
    midCache[key] = idx;
    return idx;
  }

  for (let s = 0; s < subdivisions; s++) {
    const newFaces: number[][] = [];
    for (const [a, b, c] of faces) {
      const ab = getMid(a, b);
      const bc = getMid(b, c);
      const ca = getMid(c, a);
      newFaces.push([a, ab, ca], [b, bc, ab], [c, ca, bc], [ab, bc, ca]);
    }
    faces = newFaces;
  }

  const indices: number[] = [];
  for (const [a, b, c] of faces) indices.push(a, b, c);
  return { positions: verts, indices };
}

export interface RockGeometry {
  positions: number[];
  normals: number[];
  colors: number[];
  uvs: number[];
  tangents: number[];
  indices: number[];
  meta: { vertCount: number; triCount: number; bounds: Vec3 };
}

export function generateRockGeometry(params: RockParams, seedOverride?: number): RockGeometry {
  const seed = (seedOverride ?? (params.seed as number)) || 42;
  const rng = mulberry32(seed);

  const scale = (params.scale as number) || 1.5;
  const sx = (params.scaleX as number) || 1.0;
  const sy = (params.scaleY as number) || 1.0;
  const sz = (params.scaleZ as number) || 1.0;
  const subs = Math.min(6, Math.max(2, (params.subdivisions as number) || 5));

  const dispStr = (params.displacementStrength as number) ?? 0.35;
  const dispFreq = (params.displacementFrequency as number) ?? 1.8;
  const dispOct = (params.displacementOctaves as number) ?? 6;
  const dispLac = (params.displacementLacunarity as number) ?? 2.1;
  const dispPers = (params.displacementPersistence as number) ?? 0.48;

  const erosStr = (params.erosionStrength as number) ?? 0.25;
  const erosSharp = (params.erosionSharpness as number) ?? 1.4;
  const erosDir = (params.erosionDirection as number) ?? 0.7;
  const erosChan = (params.erosionChannels as number) ?? 0.3;
  const erosSmooth = (params.erosionSmoothing as number) ?? 0.15;

  const fracStr = (params.fractureStrength as number) ?? 0.0;
  const fracDens = (params.fractureDensity as number) ?? 3;
  const fracSharp = (params.fractureSharpness as number) ?? 2.0;
  const fracDepth = (params.fractureDepth as number) ?? 0.12;

  const layerStr = (params.layeringStrength as number) ?? 0.0;
  const layerFreq = (params.layeringFrequency as number) ?? 8;
  const layerWarp = (params.layeringWarp as number) ?? 0.2;

  const pitting = (params.surfacePitting as number) ?? 0.15;

  const baseColorHex = (params.baseColor as string) || "#7a7a72";
  const secColorHex = (params.secondaryColor as string) || "#5a5852";
  const colorVar = (params.baseColorVariation as number) ?? 0.15;
  const mossColor = hexToRgb((params.mossColor as string) || "#3a5a28");
  const mossCoverage = (params.mossCoverage as number) ?? 0.0;
  const mossThreshold = (params.mossThreshold as number) ?? 0.6;
  const groundEmbed = (params.groundEmbed as number) ?? 0.15;

  const crystStr = (params.crystallineStrength as number) ?? 0.0;
  const crystScale = (params.crystallineScale as number) ?? 0.3;

  const baseColor = hexToRgb(baseColorHex);
  const secColor = hexToRgb(secColorHex);

  // Phase offset for seed variation
  const px = rng() * 100;
  const py = rng() * 100;
  const pz = rng() * 100;

  // Generate icosphere
  const ico = createIcosphere(subs);
  const verts = ico.positions.map(v => [...v] as Vec3);

  // Apply displacement
  for (let i = 0; i < verts.length; i++) {
    const v = verts[i];
    const n = v3normalize(v);

    // Anisotropic scaling
    let sv: Vec3 = [v[0] * sx, v[1] * sy, v[2] * sz];

    // FBM displacement
    const nx = (sv[0] + px) * dispFreq;
    const ny = (sv[1] + py) * dispFreq;
    const nz = (sv[2] + pz) * dispFreq;
    let disp = fbm3(nx, ny, nz, dispOct, dispLac, dispPers) - 0.5;

    // Erosion: smooth tops, roughen sides
    const upDot = n[1]; // how much it faces up
    if (erosStr > 0) {
      const gravityFactor = erosDir * Math.max(0, upDot);
      const smoothFactor = erosSmooth * gravityFactor;
      disp *= 1 - smoothFactor;

      // Water channel erosion on sides
      if (erosChan > 0 && upDot < 0.3) {
        const chanNoise = noise3(sv[0] * 4 + px, sv[1] * 8, sv[2] * 4 + pz);
        const chan = Math.pow(chanNoise, erosSharp) * erosChan * erosStr;
        disp -= chan;
      }

      // General erosion rounding
      disp -= erosStr * Math.pow(Math.max(0, upDot), erosSharp) * 0.3;
    }

    // Fracture lines (Voronoi edge detection)
    if (fracStr > 0) {
      const vor = voronoi3(sv[0] * fracDens + px, sv[1] * fracDens + py, sv[2] * fracDens + pz);
      const edge = 1 - Math.pow(Math.min(1, (vor.dist2 - vor.dist1) * fracSharp), 0.5);
      disp -= edge * fracDepth * fracStr;
    }

    // Sedimentary layering
    if (layerStr > 0) {
      const warp = noise3(sv[0] * 2 + px, sv[1] * 2, sv[2] * 2 + pz) * layerWarp;
      const layer = Math.sin((sv[1] + warp) * layerFreq * Math.PI) * 0.5 + 0.5;
      disp += (layer - 0.5) * layerStr * 0.08;
    }

    // Crystalline faceting
    if (crystStr > 0) {
      const vor = voronoi3(sv[0] / crystScale + px, sv[1] / crystScale + py, sv[2] / crystScale + pz);
      disp += (vor.dist1 - 0.5) * crystStr * 0.15;
    }

    // Surface pitting (small cavities)
    if (pitting > 0) {
      const pit = noise3(sv[0] * 12 + px, sv[1] * 12 + py, sv[2] * 12 + pz);
      if (pit > 0.65) {
        disp -= (pit - 0.65) * pitting * 0.4;
      }
    }

    // Apply displacement
    const finalScale = scale * (1 + disp * dispStr);
    verts[i] = [
      n[0] * finalScale * sx,
      n[1] * finalScale * sy,
      n[2] * finalScale * sz,
    ];

    // Embed in ground
    if (groundEmbed > 0) {
      verts[i][1] += scale * groundEmbed;
    }
  }

  // Compute normals
  const normals: Vec3[] = verts.map(() => [0, 0, 0] as Vec3);
  for (let i = 0; i < ico.indices.length; i += 3) {
    const ia = ico.indices[i], ib = ico.indices[i+1], ic = ico.indices[i+2];
    const a = verts[ia], b = verts[ib], c = verts[ic];
    const ab: Vec3 = [b[0]-a[0], b[1]-a[1], b[2]-a[2]];
    const ac: Vec3 = [c[0]-a[0], c[1]-a[1], c[2]-a[2]];
    const fn = v3cross(ab, ac);
    normals[ia] = v3add(normals[ia], fn);
    normals[ib] = v3add(normals[ib], fn);
    normals[ic] = v3add(normals[ic], fn);
  }
  for (let i = 0; i < normals.length; i++) normals[i] = v3normalize(normals[i]);

  // Compute vertex colors, UVs, and tangents
  const positions: number[] = [];
  const normalsFlat: number[] = [];
  const colors: number[] = [];
  const uvs: number[] = [];
  const tangents: number[] = [];

  for (let i = 0; i < verts.length; i++) {
    const v = verts[i];
    const n = normals[i];
    positions.push(v[0], v[1], v[2]);
    normalsFlat.push(n[0], n[1], n[2]);

    // Triplanar UV projection - blend based on normal direction
    const absN: Vec3 = [Math.abs(n[0]), Math.abs(n[1]), Math.abs(n[2])];
    let u: number, uv_v: number;
    if (absN[1] > absN[0] && absN[1] > absN[2]) {
      // Top/bottom face → project XZ
      u = v[0] * 0.5;
      uv_v = v[2] * 0.5;
    } else if (absN[0] > absN[2]) {
      // Side X face → project YZ
      u = v[2] * 0.5;
      uv_v = v[1] * 0.5;
    } else {
      // Side Z face → project XY
      u = v[0] * 0.5;
      uv_v = v[1] * 0.5;
    }
    uvs.push(u, uv_v);

    // Compute tangent (aligned to dominant UV direction)
    let tangent: Vec3;
    if (absN[1] > absN[0] && absN[1] > absN[2]) {
      tangent = v3normalize(v3cross(n, [0, 0, 1]));
    } else if (absN[0] > absN[2]) {
      tangent = v3normalize(v3cross(n, [0, 1, 0]));
    } else {
      tangent = v3normalize(v3cross(n, [0, 1, 0]));
    }
    // w component = handedness
    tangents.push(tangent[0], tangent[1], tangent[2], 1.0);

    // Color based on height, slope, noise
    const heightNorm = (v[1] + scale) / (scale * 2);
    const slope = n[1];
    const colorNoise = noise3(v[0] * 3 + px, v[1] * 3 + py, v[2] * 3 + pz);

    const blend = Math.min(1, Math.max(0, heightNorm * 0.5 + colorNoise * 0.5));
    let r = baseColor[0] + (secColor[0] - baseColor[0]) * blend;
    let g = baseColor[1] + (secColor[1] - baseColor[1]) * blend;
    let b = baseColor[2] + (secColor[2] - baseColor[2]) * blend;

    const cv = (rng() - 0.5) * colorVar;
    r += cv; g += cv * 0.8; b += cv * 0.6;

    if (layerStr > 0) {
      const warp = noise3(v[0] * 2 + px, v[1] * 2, v[2] * 2 + pz) * layerWarp;
      const layer = Math.sin((v[1] / scale + warp) * layerFreq * Math.PI) * 0.5 + 0.5;
      const darken = layer * layerStr * 0.12;
      r -= darken; g -= darken; b -= darken * 0.8;
    }

    if (mossCoverage > 0 && slope > mossThreshold) {
      const mossNoise = noise3(v[0] * 5 + px, v[1] * 5 + py, v[2] * 5 + pz);
      const mf = Math.min(1, mossCoverage * mossNoise * 2 * (slope - mossThreshold) / (1 - mossThreshold));
      r += (mossColor[0] - r) * mf;
      g += (mossColor[1] - g) * mf;
      b += (mossColor[2] - b) * mf;
    }

    const crevice = 1 - Math.max(0, (noise3(v[0] * 8, v[1] * 8, v[2] * 8) - 0.3) * 0.3);
    r *= crevice; g *= crevice; b *= crevice;

    colors.push(
      Math.max(0, Math.min(1, r)),
      Math.max(0, Math.min(1, g)),
      Math.max(0, Math.min(1, b)),
    );
  }

  const bounds: Vec3 = [0, 0, 0];
  for (const v of verts) {
    bounds[0] = Math.max(bounds[0], Math.abs(v[0]));
    bounds[1] = Math.max(bounds[1], Math.abs(v[1]));
    bounds[2] = Math.max(bounds[2], Math.abs(v[2]));
  }

  return {
    positions,
    normals: normalsFlat,
    colors,
    uvs,
    tangents,
    indices: ico.indices,
    meta: {
      vertCount: verts.length,
      triCount: ico.indices.length / 3,
      bounds,
    },
  };
}
