/**
 * CSG-style rock merging with procedural cracks at contact seams.
 * 
 * We approximate CSG union by:
 * 1. Detecting vertices inside the other rock's bounding sphere
 * 2. Pushing overlapping vertices outward along averaged normals
 * 3. Generating procedural crack displacement at contact boundaries
 * 4. Adding moss/darkening at seam regions
 */

import type { RockGeometry } from "./rockGenerator";
import type { RockParams } from "@/types/rockParams";

type Vec3 = [number, number, number];

function v3sub(a: Vec3, b: Vec3): Vec3 { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
function v3add(a: Vec3, b: Vec3): Vec3 { return [a[0]+b[0], a[1]+b[1], a[2]+b[2]]; }
function v3scale(a: Vec3, s: number): Vec3 { return [a[0]*s, a[1]*s, a[2]*s]; }
function v3len(a: Vec3): number { return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); }
function v3normalize(a: Vec3): Vec3 {
  const l = v3len(a);
  return l > 1e-8 ? [a[0]/l, a[1]/l, a[2]/l] : [0, 1, 0];
}
function v3dot(a: Vec3, b: Vec3): number { return a[0]*b[0]+a[1]*b[1]+a[2]*b[2]; }

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

interface MergedRock {
  geometry: RockGeometry;
  /** Offset applied to this rock's positions */
  offset: Vec3;
}

interface BoundingSphere {
  center: Vec3;
  radius: number;
}

function computeBoundingSphere(geo: RockGeometry, offset: Vec3): BoundingSphere {
  let cx = 0, cy = 0, cz = 0;
  const count = geo.positions.length / 3;
  for (let i = 0; i < count; i++) {
    cx += geo.positions[i*3] + offset[0];
    cy += geo.positions[i*3+1] + offset[1];
    cz += geo.positions[i*3+2] + offset[2];
  }
  cx /= count; cy /= count; cz /= count;
  let maxR = 0;
  for (let i = 0; i < count; i++) {
    const dx = geo.positions[i*3] + offset[0] - cx;
    const dy = geo.positions[i*3+1] + offset[1] - cy;
    const dz = geo.positions[i*3+2] + offset[2] - cz;
    maxR = Math.max(maxR, dx*dx + dy*dy + dz*dz);
  }
  return { center: [cx, cy, cz], radius: Math.sqrt(maxR) };
}

/**
 * Merge multiple rock geometries with CSG-like contact seam effects.
 * Returns a single combined geometry with procedural cracks at overlaps.
 */
export function mergeRockGeometries(
  rocks: { geometry: RockGeometry; offset: Vec3 }[],
  params: RockParams
): RockGeometry {
  if (rocks.length === 0) {
    return { positions: [], normals: [], colors: [], uvs: [], tangents: [], roughnessMap: [], metalnessMap: [], indices: [], meta: { vertCount: 0, triCount: 0, bounds: [0,0,0] } };
  }
  if (rocks.length === 1) {
    // Apply offset to single rock
    const r = rocks[0];
    const pos = [...r.geometry.positions];
    const count = pos.length / 3;
    for (let i = 0; i < count; i++) {
      pos[i*3] += r.offset[0];
      pos[i*3+1] += r.offset[1];
      pos[i*3+2] += r.offset[2];
    }
    return { ...r.geometry, positions: pos };
  }

  const crackWidth = (params.csgCrackWidth as number) ?? 0.08;
  const crackDepth = (params.csgCrackDepth as number) ?? 0.15;
  const crackNoise = (params.csgCrackNoise as number) ?? 0.5;
  const dispStrength = (params.csgDisplacementStrength as number) ?? 0.2;
  const mossAtSeam = (params.csgMossAtSeam as number) ?? 0.0;
  const blendRadius = (params.csgBlendRadius as number) ?? 0.3;
  const seamDarkening = (params.csgSeamDarkening as number) ?? 0.2;

  // Compute bounding spheres
  const spheres = rocks.map(r => computeBoundingSphere(r.geometry, r.offset));

  // Process each rock, applying CSG effects at contact zones
  const allPositions: number[] = [];
  const allNormals: number[] = [];
  const allColors: number[] = [];
  const allUVs: number[] = [];
  const allTangents: number[] = [];
  const allRoughness: number[] = [];
  const allMetalness: number[] = [];
  const allIndices: number[] = [];
  let vertexOffset = 0;

  for (let ri = 0; ri < rocks.length; ri++) {
    const rock = rocks[ri];
    const geo = rock.geometry;
    const off = rock.offset;
    const count = geo.positions.length / 3;

    for (let vi = 0; vi < count; vi++) {
      let px = geo.positions[vi*3] + off[0];
      let py = geo.positions[vi*3+1] + off[1];
      let pz = geo.positions[vi*3+2] + off[2];
      let nx = geo.normals[vi*3];
      let ny = geo.normals[vi*3+1];
      let nz = geo.normals[vi*3+2];
      let cr = geo.colors[vi*3];
      let cg = geo.colors[vi*3+1];
      let cb = geo.colors[vi*3+2];
      let rough = geo.roughnessMap[vi];
      let metal = geo.metalnessMap[vi];

      const pos: Vec3 = [px, py, pz];
      const norm: Vec3 = [nx, ny, nz];

      // Check proximity to other rocks
      let minContactDist = Infinity;
      for (let rj = 0; rj < rocks.length; rj++) {
        if (ri === rj) continue;
        const otherSphere = spheres[rj];
        const toCenter = v3sub(pos, otherSphere.center);
        const distToSurface = v3len(toCenter) - otherSphere.radius;

        if (distToSurface < blendRadius) {
          minContactDist = Math.min(minContactDist, distToSurface);
        }
      }

      if (minContactDist < blendRadius) {
        const contactFactor = 1.0 - Math.max(0, minContactDist) / blendRadius;
        const cf = Math.pow(contactFactor, 0.5);

        // Crack displacement — push vertices outward at contact zone
        const crackNoiseVal = noise3(px * 8 + 42, py * 8 + 17, pz * 8 + 91);
        const crackDisp = (crackNoiseVal - 0.5) * crackDepth * cf;
        const noiseOffset = (noise3(px * 12, py * 12, pz * 12) - 0.5) * crackNoise * cf * 0.1;

        px += norm[0] * (crackDisp + dispStrength * cf * 0.5) + noiseOffset;
        py += norm[1] * (crackDisp + dispStrength * cf * 0.5) + noiseOffset;
        pz += norm[2] * (crackDisp + dispStrength * cf * 0.5) + noiseOffset;

        // Darken seam
        const darken = 1.0 - seamDarkening * cf;
        cr *= darken;
        cg *= darken;
        cb *= darken;

        // Add roughness at seam
        rough = Math.min(1, rough + 0.15 * cf);

        // Moss at seam
        if (mossAtSeam > 0 && ny > 0.3) {
          const mossNoise = noise3(px * 5 + 77, py * 5 + 33, pz * 5 + 55);
          const mf = Math.min(1, mossAtSeam * cf * mossNoise * 2);
          cr += (0.22 - cr) * mf;
          cg += (0.35 - cg) * mf;
          cb += (0.16 - cb) * mf;
          rough = Math.min(1, rough + 0.1 * mf);
        }

        // Crack lines — sharp dark lines at seam boundaries
        if (Math.abs(minContactDist) < crackWidth) {
          const crackLine = 1.0 - Math.abs(minContactDist) / crackWidth;
          const crackSharp = Math.pow(crackLine, 2.0);
          cr *= (1.0 - crackSharp * 0.6);
          cg *= (1.0 - crackSharp * 0.6);
          cb *= (1.0 - crackSharp * 0.6);
          // Inset the crack
          px -= norm[0] * crackSharp * crackDepth * 0.5;
          py -= norm[1] * crackSharp * crackDepth * 0.5;
          pz -= norm[2] * crackSharp * crackDepth * 0.5;
        }
      }

      allPositions.push(px, py, pz);
      allNormals.push(nx, ny, nz);
      allColors.push(Math.max(0, Math.min(1, cr)), Math.max(0, Math.min(1, cg)), Math.max(0, Math.min(1, cb)));
      allUVs.push(geo.uvs[vi*2], geo.uvs[vi*2+1]);
      allTangents.push(geo.tangents[vi*4], geo.tangents[vi*4+1], geo.tangents[vi*4+2], geo.tangents[vi*4+3]);
      allRoughness.push(Math.max(0, Math.min(1, rough)));
      allMetalness.push(Math.max(0, Math.min(1, metal)));
    }

    // Offset indices
    for (let ii = 0; ii < geo.indices.length; ii++) {
      allIndices.push(geo.indices[ii] + vertexOffset);
    }
    vertexOffset += count;
  }

  // Compute bounds
  const bounds: Vec3 = [0, 0, 0];
  const totalVerts = allPositions.length / 3;
  for (let i = 0; i < totalVerts; i++) {
    bounds[0] = Math.max(bounds[0], Math.abs(allPositions[i*3]));
    bounds[1] = Math.max(bounds[1], Math.abs(allPositions[i*3+1]));
    bounds[2] = Math.max(bounds[2], Math.abs(allPositions[i*3+2]));
  }

  return {
    positions: allPositions,
    normals: allNormals,
    colors: allColors,
    uvs: allUVs,
    tangents: allTangents,
    roughnessMap: allRoughness,
    metalnessMap: allMetalness,
    indices: allIndices,
    meta: {
      vertCount: totalVerts,
      triCount: allIndices.length / 3,
      bounds,
    },
  };
}
