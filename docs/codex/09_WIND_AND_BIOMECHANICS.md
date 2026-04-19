# Volume 09 — Wind and Biomechanics
**Why a single sine wave looks animated and a coupled oscillator looks alive.**

---

## 1. The biomechanical reality

A tree under wind load is a **coupled multi-mass oscillator**. Its mass is distributed across several scales, each with its own characteristic resonance:

| Mass scale | Typical resonance period |
|---|---|
| Whole trunk + crown (mode 1) | 1.5–3 s for a mature tree |
| Major scaffolds (Order 1) | 0.5–1.5 s |
| Secondary branches (Order 2) | 0.2–0.6 s |
| Twigs (Order 3+) | 0.05–0.2 s |
| Leaves | 0.02–0.1 s |

When wind hits the tree, energy cascades downward through these scales and back up. The trunk sways slowly, the scaffolds wobble at their own faster rate *on top of* the trunk's motion, and the leaves flutter at very high frequency on top of everything else. Static image references (and slow-motion video) confirm: a real tree's motion is a **fractal of nested oscillations**.

A single global sine on every vertex collapses this to one frequency and reads as "puppet" rather than "tree." Even adding a per-vertex random phase doesn't fix it — the *hierarchy* matters.

---

## 2. Vertex-shader strategy: the four-frequency model

For real-time engines, simulate the four-mass model in the vertex shader without per-frame CPU evaluation:

```glsl
// In vertex shader, per vertex on tree mesh.
// Inputs:
//   vec3 worldPos        // world position of vertex
//   float branchOrder    // 0 (trunk) → N (twig); baked as vertex attribute
//   float distanceToTip  // baked, 0 at trunk root → 1 at twig tip
//   float windDirection  // global, radians around Y
//   float windStrength   // global, 0–1

// Four oscillation scales, each with its own frequency and phase
float t = time;

// Scale 1 — trunk sway (very low frequency, large amplitude near top)
float trunkPhase = worldPos.x * 0.1 + worldPos.z * 0.1;
float trunkSway = sin(t * 2.0 + trunkPhase) * 0.05 * smoothstep(0.0, 1.0, distanceToTip);

// Scale 2 — major branch wobble (medium freq, medium amplitude on Order 1)
float branchPhase = worldPos.x * 1.3 + worldPos.z * 1.7;
float branchSway = sin(t * 5.0 + branchPhase) * 0.02 * smoothstep(0.3, 1.0, branchOrder / 4.0);

// Scale 3 — twig flutter (high freq, low amplitude on Order 3+)
float twigPhase = worldPos.x * 7.0 + worldPos.z * 11.0 + worldPos.y * 5.0;
float twigSway = sin(t * 15.0 + twigPhase) * 0.008 * smoothstep(0.6, 1.0, branchOrder / 4.0);

// Scale 4 — leaf flutter (very high freq, applied to leaf cards only)
// — this is per-leaf and applied in a separate leaf vertex shader.

// Combine and apply in the wind direction
vec2 windDir2D = vec2(cos(windDirection), sin(windDirection));
float totalSway = (trunkSway + branchSway + twigSway) * windStrength;
worldPos.xz += windDir2D * totalSway;
```

Three things make this feel alive:

1. **The four scales operate at different frequencies** — visually, they decouple into distinct motions.
2. **Amplitude scales by hierarchy** — trunk sway only at top, twig flutter only at twigs.
3. **Phase is spatially varying** — different parts of the tree are out of phase, so the motion isn't synchronized.

---

## 3. Wind direction and gusts

Constant directional wind looks robotic. Real wind has:

- A **mean direction** that drifts slowly (timescale: seconds to minutes).
- **Gusts** that arrive as enveloped pulses — wind strength rising and falling over 1–4 s.
- **Local turbulence** — small angular and amplitude variations.

For procedural wind, drive `windDirection` and `windStrength` from layered noise:

```
windDirection(t) = baseDirection + 0.5 · cos(t · 0.1)        // slow drift
windStrength(t) = baseStrength · (
    0.6                                                       // base
  + 0.3 · sin(t * 0.4)                                        // gust envelope
  + 0.1 · sin(t * 1.5 + perlinNoise(t * 0.2))                // turbulence
)
```

This produces visually believable wind variation with no per-frame CPU cost beyond evaluating two scalars.

---

## 4. Stem-direction-aware sway

A horizontal branch should sway perpendicular to its axis (lateral whip), not along it. A vertical trunk sways laterally too, in the wind direction. The vertex shader above implicitly assumes vertical-axis motion, which is correct for the trunk but underestimates lateral sway on horizontal branches.

A more accurate version computes per-vertex *sway direction* in the tangent plane of the branch axis (baked as vertex attribute), then applies amplitude as before. This adds one more vertex attribute but produces the visible **whipping** of horizontal limbs that is the most charismatic motion in old broadleaf trees.

---

## 5. Leaf flutter

Leaves are essentially 2D plates pivoting on their petioles. Real leaves:

- Pivot **around the petiole axis** (face-rolling motion).
- Edge-flap when wind catches them perpendicular to the leaf plane.
- Are largely independent of each other — their flutter is **uncorrelated** at small scales.

For leaf cards, apply rotation in the leaf's local space:

```glsl
// Per-vertex on leaf card, in card local space
float leafPhase = leafCenter.x * 23.0 + leafCenter.z * 31.0;
float fluttAngle = sin(t * 20.0 + leafPhase) * 0.4 * windStrength;
// Rotate vertex around petiole axis by fluttAngle
```

The rapid, decorrelated flutter is what gives close-up shots of trees their characteristic shimmer.

---

## 6. Long-term wind shaping (back to thigmomorphogenesis)

The static *shape* of a tree in a windy site is itself wind-determined (Vol. 08 §4). The renderer should not need to do anything new here — but the species presets need a **windExposure** parameter that adjusts:

- Final height down.
- Trunk base radius up.
- Crown asymmetry toward leeward (windward branches are mechanically pruned over years).
- Branch density: higher (more lateral budding from chronic stress).

This means a "tree in wind" has *two* wind effects: instantaneous sway (this volume) and accumulated form (Vol. 08).

---

## 7. Damping and recovery

A real tree returns to rest position with **critical or near-critical damping** — overshoot is small, oscillations die out within a few periods. This matters when the wind suddenly drops or for interactive scenes (e.g. a game character brushing a branch). For shader-only sway driven by continuous wind functions, damping is implicit; for impulse-driven motion (springs simulated on CPU for collision), use damping ratio ζ ≈ 0.4–0.6.

---

## 8. Summary checklist

A wind system is "complete" when:

| Check | Expected behavior |
|---|---|
| Trunk sways slowly | 1.5–3 s period, only top of trunk visibly moves |
| Scaffolds wobble | Faster motion, decoupled from trunk |
| Twigs flutter | High frequency, only at outer crown |
| Leaves shimmer | Very high frequency, decorrelated at sub-tuft scale |
| Gusts visible | Crown amplitude rises and falls over seconds |
| No phase lock | Different parts of the tree out of sync |
| Direction-aware | Horizontal branches whip laterally, not axially |
| No vertex stretching | Mesh appears to translate, not deform — vertices preserve relative spacing |

If any of these is missing, the tree will look animated rather than alive.
