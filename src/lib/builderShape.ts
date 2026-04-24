import type { BuilderShape } from "@/types/rockParams";

type Vec3 = [number, number, number];

function vsub(a: Vec3, b: Vec3): Vec3 { return [a[0]-b[0], a[1]-b[1], a[2]-b[2]]; }
function vlen(a: Vec3): number { return Math.sqrt(a[0]*a[0]+a[1]*a[1]+a[2]*a[2]); }

/** Apply inverse rotation (Euler XYZ) to put a world point into the shape's local frame. */
function toLocal(p: Vec3, shape: BuilderShape): Vec3 {
  const [tx, ty, tz] = shape.position;
  let x = p[0] - tx, y = p[1] - ty, z = p[2] - tz;
  const [rx, ry, rz] = shape.rotation;
  // Inverse rotation: apply -Z, -Y, -X
  const cz = Math.cos(-rz), sz = Math.sin(-rz);
  let nx = x * cz - y * sz; let ny = x * sz + y * cz; x = nx; y = ny;
  const cy = Math.cos(-ry), sy = Math.sin(-ry);
  nx = x * cy + z * sy; let nz = -x * sy + z * cy; x = nx; z = nz;
  const cx = Math.cos(-rx), sx = Math.sin(-rx);
  ny = y * cx - z * sx; nz = y * sx + z * cx; y = ny; z = nz;
  return [x, y, z];
}

/** Box SDF (axis-aligned in local space) */
function sdBox(p: Vec3, half: Vec3): number {
  const dx = Math.abs(p[0]) - half[0];
  const dy = Math.abs(p[1]) - half[1];
  const dz = Math.abs(p[2]) - half[2];
  const ox = Math.max(dx, 0), oy = Math.max(dy, 0), oz = Math.max(dz, 0);
  const outside = Math.sqrt(ox*ox + oy*oy + oz*oz);
  const inside = Math.min(0, Math.max(dx, Math.max(dy, dz)));
  return outside + inside;
}

/** Ellipsoid SDF (approximate but smooth) */
function sdEllipsoid(p: Vec3, r: Vec3): number {
  const k0 = vlen([p[0]/r[0], p[1]/r[1], p[2]/r[2]]);
  const k1 = vlen([p[0]/(r[0]*r[0]), p[1]/(r[1]*r[1]), p[2]/(r[2]*r[2])]);
  return k1 === 0 ? -Math.min(r[0], r[1], r[2]) : k0 * (k0 - 1) / k1;
}

/** Cylinder along Y axis with radius r (xz) and half-height h (y) */
function sdCylinder(p: Vec3, r: Vec3): number {
  // Use scale.x as radius (xz-radius averaged), scale.y as half-height
  const radius = (r[0] + r[2]) * 0.5;
  const half = r[1];
  const dxz = Math.sqrt(p[0]*p[0] + p[2]*p[2]) - radius;
  const dy = Math.abs(p[1]) - half;
  const ox = Math.max(dxz, 0), oy = Math.max(dy, 0);
  return Math.sqrt(ox*ox + oy*oy) + Math.min(0, Math.max(dxz, dy));
}

/** Cone (apex up) — base at -h, apex at +h, base radius r */
function sdCone(p: Vec3, r: Vec3): number {
  const radius = (r[0] + r[2]) * 0.5;
  const half = r[1];
  // map y from [-h, h] -> [1, 0] for taper factor
  const yt = Math.max(0, Math.min(1, (half - p[1]) / (2 * half || 1e-6)));
  const localR = radius * yt;
  const dxz = Math.sqrt(p[0]*p[0] + p[2]*p[2]) - localR;
  const dy = Math.abs(p[1]) - half;
  const ox = Math.max(dxz, 0), oy = Math.max(dy, 0);
  return Math.sqrt(ox*ox + oy*oy) + Math.min(0, Math.max(dxz, dy));
}

/** Smooth-min (polynomial) for soft union */
function smin(a: number, b: number, k: number): number {
  if (k <= 0) return Math.min(a, b);
  const h = Math.max(0, k - Math.abs(a - b)) / k;
  return Math.min(a, b) - h * h * h * k * (1 / 6);
}

/** Smooth-max for subtraction */
function smax(a: number, b: number, k: number): number {
  return -smin(-a, -b, k);
}

function sdPrimitive(localP: Vec3, shape: BuilderShape): number {
  switch (shape.kind) {
    case "box":      return sdBox(localP, shape.scale);
    case "sphere":   return sdEllipsoid(localP, shape.scale);
    case "cylinder": return sdCylinder(localP, shape.scale);
    case "cone":     return sdCone(localP, shape.scale);
    default:         return Number.POSITIVE_INFINITY;
  }
}

/**
 * Combined SDF for the builder composition.
 * - Hard primitives are smooth-unioned together (k = smoothness * 0.4).
 * - Subtract primitives are smooth-subtracted from the union.
 * - Metaballs are summed as a separate scalar field; the iso-surface is
 *   converted to a signed distance approximation and smooth-unioned in.
 * Returns negative inside, positive outside.
 */
export function builderSDF(p: Vec3, shapes: BuilderShape[], smoothness: number): number {
  const k = Math.max(0, smoothness) * 0.4;
  let dAdd = Number.POSITIVE_INFINITY;
  let dSub = Number.POSITIVE_INFINITY;
  let metaField = 0;
  let metaCount = 0;
  let metaScale = 0;

  for (const s of shapes) {
    if (!s.visible) continue;
    if (s.kind === "metaball") {
      const local = toLocal(p, s);
      const dist = vlen(local);
      const r = Math.max(0.05, s.blobRadius);
      // Wyvill kernel — bounded support
      const t = dist / r;
      if (t < 1) {
        const w = (1 - t * t);
        metaField += s.blobStrength * w * w * w;
        metaScale = Math.max(metaScale, r);
      }
      metaCount++;
    } else {
      const local = toLocal(p, s);
      const d = sdPrimitive(local, s);
      if (s.op === "subtract") {
        dSub = Math.min(dSub, d);
      } else {
        dAdd = (dAdd === Number.POSITIVE_INFINITY) ? d : smin(dAdd, d, k);
      }
    }
  }

  // Convert metaball iso-surface (field >= 0.5) into a pseudo-SDF value
  let dMeta = Number.POSITIVE_INFINITY;
  if (metaCount > 0 && metaScale > 0) {
    dMeta = (0.5 - metaField) * metaScale;
    dAdd = (dAdd === Number.POSITIVE_INFINITY) ? dMeta : smin(dAdd, dMeta, k);
  }

  if (dAdd === Number.POSITIVE_INFINITY) return Number.POSITIVE_INFINITY;
  if (dSub !== Number.POSITIVE_INFINITY) return smax(dAdd, -dSub, k);
  return dAdd;
}

/**
 * Ray-march from origin along a unit direction until SDF crosses zero.
 * Returns the hit distance (radius from origin) or null if no surface found.
 */
export function builderRayHit(
  dir: Vec3,
  shapes: BuilderShape[],
  smoothness: number,
  maxDist = 6,
  maxSteps = 96,
): number | null {
  // Start a little inside the bounding region to handle origin-inside case.
  // First check if origin is inside — if so, march outward.
  const startSign = Math.sign(builderSDF([0, 0, 0], shapes, smoothness));
  let t = startSign < 0 ? 0.001 : 0.0;
  for (let i = 0; i < maxSteps; i++) {
    const p: Vec3 = [dir[0] * t, dir[1] * t, dir[2] * t];
    const d = builderSDF(p, shapes, smoothness);
    // Looking for outward boundary — distance becomes ~0 from inside
    if (startSign < 0) {
      if (d > -1e-3) return t;
      t += Math.max(0.01, -d);
    } else {
      if (d < 1e-3) return t;
      t += Math.max(0.01, d);
    }
    if (t > maxDist) return null;
  }
  return t > 0 ? t : null;
}

/** Compute the SDF gradient (analytic via finite differences) for normals. */
export function builderSDFGradient(p: Vec3, shapes: BuilderShape[], smoothness: number, eps = 0.01): Vec3 {
  const dx = builderSDF([p[0]+eps, p[1], p[2]], shapes, smoothness) - builderSDF([p[0]-eps, p[1], p[2]], shapes, smoothness);
  const dy = builderSDF([p[0], p[1]+eps, p[2]], shapes, smoothness) - builderSDF([p[0], p[1]-eps, p[2]], shapes, smoothness);
  const dz = builderSDF([p[0], p[1], p[2]+eps], shapes, smoothness) - builderSDF([p[0], p[1], p[2]-eps], shapes, smoothness);
  const len = Math.sqrt(dx*dx + dy*dy + dz*dz) || 1;
  return [dx/len, dy/len, dz/len];
}

/** Coarse bounding radius for camera fitting / ray-march bound. */
export function builderBoundingRadius(shapes: BuilderShape[]): number {
  let r = 0;
  for (const s of shapes) {
    if (!s.visible) continue;
    const cx = Math.abs(s.position[0]);
    const cy = Math.abs(s.position[1]);
    const cz = Math.abs(s.position[2]);
    const reach = s.kind === "metaball"
      ? s.blobRadius
      : Math.max(s.scale[0], s.scale[1], s.scale[2]);
    r = Math.max(r, Math.sqrt(cx*cx + cy*cy + cz*cz) + reach);
  }
  return Math.max(0.5, r);
}