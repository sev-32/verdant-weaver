# Volume 14 — Failure Modes and QA
**A regression catalog. Every artifact named, photographed (in description), diagnosed, and fixed.**

> Use this volume as a **checklist before declaring any change done**. Open the preview, look from at least four angles, and verify none of the named failures is present. If one is, this volume tells you which subsystem to fix.

---

## 1. Trunk failures

### 1.1 "Spaghetti trunk" — trunk wanders or kinks
- **Symptom**: trunk visibly zig-zags or has sharp angles.
- **Cause**: per-internode random offsets without spatial smoothing; or trunk consulting SCA attractors and being pulled around.
- **Fix**: trunk path uses spatially-smooth 2D noise (Vol. 13 §3.1); trunk apex is excluded from SCA active set.

### 1.2 "Spear top" — trunk thins to a point at the apex
- **Symptom**: the trunk apex is very thin and pointed.
- **Cause**: pipe-model with `terminalRadius` near zero; or pipe model not applied at all to the trunk apex.
- **Fix**: terminalRadius ≈ 0.4 mm (scaled), apply pipe model uniformly including the apex segment.

### 1.3 "Bottle bulge" — trunk swells just below the canopy
- **Symptom**: trunk fattens noticeably at the point where major scaffolds attach.
- **Cause**: junction blend length too long, applied to the parent (trunk).
- **Fix**: clamp `junctionBlendLength` to `min(blendLength, 1.0 * childRadius)`; halve blend strength on the trunk specifically.

### 1.4 "Flat top" — trunk ends with a clean cap
- **Symptom**: trunk apex terminates abruptly with a visible disc.
- **Cause**: mesh terminator does not taper to a point; final ring is full radius.
- **Fix**: final segment radius approaches `terminalRadius`; use a cone cap with ≥4 vertices.

### 1.5 "Cylinder trunk" — no taper at all
- **Symptom**: trunk is uniformly thick along its length.
- **Cause**: pipe model exponent set to 0, or pipe model bypassed.
- **Fix**: ensure exponent is in [1.7, 2.5]; verify bottom-up traversal runs to root.

---

## 2. Branching failures

### 2.1 "Random fan" — branches at random azimuths
- **Symptom**: branches appear scattered randomly around the trunk.
- **Cause**: branch azimuth sampled uniformly random.
- **Fix**: implement phyllotactic azimuth (Vol. 03 §2.3), one scheme per species.

### 2.2 "Tinsel branches" — uniform branch density along trunk
- **Symptom**: trunk has branches evenly spaced top to bottom, low and high alike.
- **Cause**: no acrotony curve; equal spawn probability per node.
- **Fix**: implement acrotony curve (Vol. 13 §4); for typical trees peak ≈ 0.7.

### 2.3 "Spear branches" — branches racing in straight lines through trunk
- **Symptom**: SCA-grown branches grow in one straight line from spawn point to envelope edge, sometimes passing *through* the trunk.
- **Cause**: SCA has no perception of trunk obstruction; high growth weight on attractor direction.
- **Fix**: add **trunk-repulsion term** to SCA growth direction (subtract a vector from the trunk axis weighted by inverse distance); also constrain initial branch direction by phyllotaxis (Phase B) before SCA refinement.

### 2.4 "Spear tree" — only Order 0 and Order 1, no sub-branching
- **Symptom**: a trunk with main branches but each branch is a single line — no twigs.
- **Cause**: SCA's natural tendency to converge each apex to a single line; no forced sub-axis spawning.
- **Fix**: implement Phase D forced hierarchy (Vol. 13 §6) to guarantee orders 1→4.

### 2.5 "Bouquet" — sub-branches all at the same angle
- **Symptom**: every sub-branch leaves its parent at exactly the species angle, looking artificial.
- **Cause**: no jitter on branching angle.
- **Fix**: ±10° angle jitter, ±15% length jitter.

### 2.6 "Floating branches" — branches not attached to parent
- **Symptom**: visible gap between branch base and trunk; branch hovers.
- **Cause**: branch base position not set to parent surface; or junction blend strength = 0 leaving a visible seam.
- **Fix**: branch first node coincides with a point on the parent's surface ring, not centerline; junction blend ≥ 0.10.

---

## 3. Foliage failures

### 3.1 "Floating leaves" — leaves not attached to branches
- **Symptom**: leaves visibly disconnected from any branch end.
- **Cause**: leaves placed by world-space sampling inside crown envelope.
- **Fix**: anchor leaves to terminal branch nodes only (Vol. 06 §2).

### 3.2 "Leaf cloud" — uniform green sphere
- **Symptom**: crown looks like a green disc with no visible structure.
- **Cause**: high leaf density + no per-leaf hue jitter + no translucency + uniform leaf orientation.
- **Fix**: add per-leaf hue jitter ±0.04 HSV; two-sided shading with translucency; per-leaf orientation jitter (Vol. 06).

### 3.3 "Crown of cards" — leaves visibly camera-facing
- **Symptom**: rotating the camera, leaves rotate with it (billboarding).
- **Cause**: pure billboard quads.
- **Fix**: 6-vertex curled cards or twisted card pairs (Vol. 06 §3).

### 3.4 "Christmas tree spruce with broadleaf foliage"
- **Symptom**: species-mismatched foliage.
- **Cause**: foliage class not driven by species spec.
- **Fix**: every species declares a foliage archetype; renderer picks instancing geometry from this enum.

### 3.5 "Outer leaves bigger than inner"
- **Symptom**: the periphery of the crown has the largest leaves.
- **Cause**: implementation reversed or no scaling.
- **Fix**: Vol. 06 §3.1 — shade leaves are LARGER, not smaller. Outer (sun) leaves are smaller and thicker.

### 3.6 "Autumn confetti" — random colors per leaf in autumn
- **Symptom**: red, yellow, brown leaves randomly interspersed.
- **Cause**: per-leaf random color sample from autumn palette.
- **Fix**: drive autumn color by world-Y position (top reddens first) plus weak per-leaf jitter (Vol. 06 §6).

---

## 4. Bark and material failures

### 4.1 "Wallpaper bark" — texture sliding on UVs
- **Symptom**: bark texture stretches and pinches at branch tips, slides as camera moves.
- **Cause**: cylindrical UVs with view-space sampling.
- **Fix**: world-space triplanar projection (Vol. 05 §6).

### 4.2 "Universal old-bark twig" — twigs have full fissured bark
- **Symptom**: a 1 cm twig has the same deep fissures as the 1 m trunk.
- **Cause**: bark intensity not modulated by local radius.
- **Fix**: `barkOnsetRadius` and `barkSaturationRadius` modulating displacement amplitude (Vol. 05 §3).

### 4.3 "Beech with pine bark" — bark archetype mismatch
- **Cause**: bark not species-specific.
- **Fix**: each species declares its `BarkSpec` archetype; one shader path per archetype.

---

## 5. Root and base failures

### 5.1 "Pole in dirt" — trunk meets ground at sharp circle
- **Symptom**: trunk base is a clean cylinder intersecting the ground plane.
- **Cause**: no flares, no fillet, no soil blend.
- **Fix**: implement Vol. 07 — flares for plate species, fillet for tap species, soft alpha decal for soil blend.

### 5.2 "Mushroom base" — flares too strong
- **Symptom**: base looks like a bulbous mushroom, comically wide.
- **Cause**: `flareStrength > 0.6` or `flareHeightFactor > 5`.
- **Fix**: clamp `flareStrength ≤ 0.5`, `flareHeightFactor ≤ 4`.

---

## 6. Wind failures

### 6.1 "Synchronized sway" — entire tree moves as one
- **Symptom**: trunk and twigs sway in perfect phase.
- **Cause**: single-frequency vertex shader without spatial phase variation.
- **Fix**: four-frequency model with spatial phase from worldPos (Vol. 09 §2).

### 6.2 "Trunk waving" — trunk visibly bends near base
- **Symptom**: trunk sways from the base, like a flagpole pivot.
- **Cause**: sway amplitude not zero at base.
- **Fix**: `smoothstep(0, 1, distanceToTip)` mask on sway (Vol. 09 §2).

### 6.3 "Stretching mesh" — vertices visibly stretching
- **Symptom**: under wind, trunk gets thinner / branches stretch.
- **Cause**: shader displaces vertices without preserving relative spacing.
- **Fix**: same displacement applied to both endpoints of each segment (already implicit if displacement depends only on `worldPos` and time).

---

## 7. Whole-tree gestalt failures

### 7.1 "Generic tree" — no species character
- **Symptom**: all species presets produce visually similar trees.
- **Cause**: species treated as multipliers on shared parameters.
- **Fix**: per-species architectural model + per-species bark archetype + per-species foliage class — not just numerical multipliers (Vol. 02, Vol. 10).

### 7.2 "Plastic tree" — perfect geometry, no organic feel
- **Symptom**: every parameter is correct but the tree looks lifeless.
- **Cause**: no environmental modulation; perfectly symmetric crown; no damage/reiteration on mature trees.
- **Fix**: implement context modifiers (Vol. 08); for mature presets, enable Phase E aging (Vol. 13 §7).

### 7.3 "Young tree but with mature size"
- **Symptom**: a 30 m tree with a young-tree silhouette (clean conical form, no reiteration, smooth bark).
- **Cause**: age parameter only scales size, doesn't change form.
- **Fix**: age drives Phase E (damage, reiteration), bark intensity (radius reaches saturation), apical control decay (decurrent crown emerges).

---

## 8. The QA pass — six angles

Before declaring any tree change done, capture screenshots from these six angles and verify against the failure list:

1. **Front orthographic**, full tree visible.
2. **Side orthographic**, full tree visible.
3. **45° oblique** from above showing crown structure.
4. **Up-from-base** looking up the trunk through the crown.
5. **Close-up of trunk** at human eye level showing bark.
6. **Silhouette against a flat sky** to assess the most readable view.

A tree that passes all six angles against this catalog is ready to ship. One that fails any single check needs the specified fix before any other work proceeds.
