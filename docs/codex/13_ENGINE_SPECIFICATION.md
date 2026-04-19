# Volume 13 — Engine Specification
**The target architecture for ProVeg Studio's tree pipeline.**

> This is the canonical, code-level specification that the implementation should converge on. Every other volume is upstream context; this volume is the contract.

---

## 1. Pipeline overview

```
Species + Context + Age + Seed
        │
        ▼
[1] Architectural model selector → trunk algorithm
        │
        ▼
[2] Phase A — Trunk path generation (deterministic, model-specific)
        │
        ▼
[3] Phase B — Scaffold spawning (phyllotactic, model-specific)
        │
        ▼
[4] Phase C — SCA refinement of scaffold tips → fills crown envelope
        │
        ▼
[5] Phase D — Forced hierarchy: spawn sub-axes every k steps to guarantee orders 1→4
        │
        ▼
[6] Phase E — Aging modifications: damage, reiteration, self-pruning
        │
        ▼
[7] Pipe-model bottom-up radius assignment
        │
        ▼
[8] Per-segment continuous taper + junction blend
        │
        ▼
[9] Tube mesh generation (Catmull-Rom paths, radial profile rings)
        │
        ▼
[10] Buttress flares + surface roots at base
        │
        ▼
[11] Foliage tuft instancing on terminal nodes (phyllotactic)
        │
        ▼
[12] Bark shader assignment (age-modulated, triplanar)
        │
        ▼
[13] Wind data baking (per-vertex order, distanceToTip, swayDir)
```

Stages 1–6 produce the **skeleton graph**; 7–13 produce the **render-ready mesh**.

---

## 2. Data structures

### 2.1 SkeletonNode

```ts
interface SkeletonNode {
  id: number;
  parent: SkeletonNode | null;
  children: SkeletonNode[];
  position: Vec3;            // world position
  direction: Vec3;           // unit growth direction at this node
  axisIndex: number;         // which continuous axis this node belongs to (trunk = 0)
  order: number;             // Strahler order, computed bottom-up
  ageYears: number;          // years since this node was created (for damage / reiteration logic)
  azimuthOnParent: number;   // radians around parent axis (for phyllotaxis)
  radius: number;            // assigned by pipe-model pass
  isTerminal: boolean;       // true if no children (carries foliage)
  isLeader: boolean;         // true if continues parent's axis (vs starts new branch)
}
```

### 2.2 SpeciesSpec

```ts
interface SpeciesSpec {
  name: string;
  architecturalModel: 'Rauh' | 'Massart' | 'Troll' | 'Leeuwenberg' | 'Attims' | 'Champagnat';
  
  // Dimensions
  matureHeight: number;
  matureDBH: number;
  matureCrownRadius: number;
  
  // Architecture
  phyllotaxis: 'spiral' | 'distichous' | 'decussate' | { whorl: number };
  branchingAngleDeg: number;          // mean
  branchingAngleJitterDeg: number;
  acrotonyPeak: number;               // 0 = base, 1 = tip
  apicalDominance: number;            // 0–1
  apicalControl: number;              // 0–1 (excurrent vs decurrent)
  reiterationProbability: number;     // per Order-1 scaffold per 10 years simulated
  
  // Pipe model
  pipeModelExponent: number;          // 1.6–3.0
  taperPower: number;                 // 0.7–1.3
  junctionBlendStrength: number;
  junctionBlendLength: number;
  
  // Bark / Roots / Foliage
  bark: BarkSpec;                     // Vol. 05
  roots: RootSpec;                    // Vol. 07
  foliage: FoliageSpec;               // Vol. 06
  
  // Environmental defaults (overridden by Context)
  phototropicGain: number;            // α in Vol. 08 §2
  gravityStiffness: number;           // Vol. 08 §3.2
  windExposure: number;               // 0–1
}
```

### 2.3 ContextSpec

```ts
interface ContextSpec {
  name: 'Open meadow' | 'Forest interior' | 'Forest edge' | 'Windswept ridge'
      | 'Riverbank' | 'Urban street' | 'Old growth ancient';
  modifiers: Partial<SpeciesSpec>;    // overrides applied on top of species defaults
  asymmetry: { lightBias: Vec3 } | null;
  damage: { crownTopDamageProbability: number; scaffoldDamageProbability: number };
  selfPruningHeight: number;
}
```

### 2.4 GenerationParams

```ts
interface GenerationParams {
  species: SpeciesSpec;
  context: ContextSpec;
  ageYears: number;     // simulated age
  seed: number;
  scale: number;        // uniform scale on outputs
}
```

This is the single input to the entire generator. Everything else is derived. UI panels manipulate these three nested specs.

---

## 3. Phase A — Trunk path generation

The trunk algorithm is selected by `species.architecturalModel`.

### 3.1 Rauh / Attims / Champagnat — monopodial trunk

```ts
function generateMonopodialTrunk(spec, ctx, age, seed):
    nodes = []
    pos = ORIGIN
    dir = UP
    yearsRemaining = age
    while yearsRemaining > 0:
        // Annual extension
        annualGrowth = annualGrowthForAge(spec, age - yearsRemaining)
        for k in 0..N_INTERNODES_PER_YEAR:
            // Smooth S-curve sway via per-year noise (small)
            sway = noise2D(year, k, seed) * 0.02 * dir.lateral()
            dir = normalize(dir + sway)
            // Champagnat: gravity step-up after threshold length
            if model == Champagnat and totalLength > champagnatThreshold:
                dir = normalize(dir + DOWN * 0.05)
            pos = pos + dir * (annualGrowth / N_INTERNODES_PER_YEAR)
            nodes.push(makeNode(pos, dir, axisIndex=0, ageYears=yearsRemaining))
        yearsRemaining -= 1
    return nodes
```

Key constraints to avoid the *kinking* and *competition* artifacts:

- Trunk uses its own deterministic path. **It does not consult the SCA attractor field**, because the trunk's apex is dominant and unaffected by lateral attractor pressure.
- Sway is small (≤2% of internode length).
- Sway is *not* random per node; it's spatially smooth via 2D noise indexed by (year, internode).

### 3.2 Massart — monopodial with annual whorls

Identical to Rauh's trunk but additionally records *whorl marker nodes* at each annual node, where Phase B will spawn N branches simultaneously.

### 3.3 Troll — sympodial bent-up

Trunk is built by chaining short orthotropic segments. At each segment end:

- Reorient horizontally for a fixed length.
- A new vertical axis emerges from the bend point as the "next trunk segment."
- Strong acrotonic branching at each bend point (Phase B will pick up these locations).

### 3.4 Leeuwenberg — sympodial Y-fork

There is no "trunk" — the initial axis grows for some length, then terminates with N (typically 2–3) equivalent daughter axes at wide angles. Each daughter recurses with the same rule. Phase B is essentially absorbed into Phase A for this model.

### 3.5 Mangenot/Champagnat — weeping

Same as Rauh until trunk reaches a length threshold; thereafter, growth direction has progressively stronger downward bias.

---

## 4. Phase B — Scaffold spawning

For each trunk node above the canopy onset height, decide whether to spawn a side branch (Order 1 scaffold).

```ts
function spawnScaffolds(trunkNodes, spec, ctx, seed):
    scaffolds = []
    for node in trunkNodes:
        if node.position.y < canopyOnsetHeight: continue       // self-pruned region
        // Acrotony curve
        normalizedHeightOnTrunk = (node.position.y - canopyOnsetHeight) / (trunkTop.y - canopyOnsetHeight)
        spawnProb = acrotonyCurve(normalizedHeightOnTrunk, spec.acrotonyPeak)
        if random(seed) > spawnProb: continue
        
        // Phyllotactic azimuth
        if spec.phyllotaxis == 'spiral':
            azimuth = node.indexOnAxis * GOLDEN_ANGLE + jitter(±2°)
        elif spec.phyllotaxis == 'decussate':
            azimuth = (node.indexOnAxis * 90°) mod 360°
        elif spec.phyllotaxis == { whorl: k }:
            // Massart: spawn k scaffolds simultaneously
            for i in 0..k-1:
                azimuth = (i * 360° / k) + (node.indexOnAxis * spiralOffset)
                spawn one scaffold at azimuth
            continue
        // ...
        
        // Branch direction = parent direction + outward in azimuth direction at species angle
        branchDir = computeBranchDirection(node.direction, azimuth,
                                            spec.branchingAngleDeg + jitter)
        scaffolds.push(makeNewAxis(parent=node, dir=branchDir, axisIndex=newAxisId()))
    return scaffolds
```

The **acrotonyCurve** is a single-peaked function:

```
acrotonyCurve(h, peak) = exp(-((h - peak)² / (2 * 0.18²)))
```

For peak = 0.7, this concentrates spawning in the upper third with smooth falloff.

---

## 5. Phase C — SCA refinement

Now run SCA *only on scaffold tips* (not the trunk). Attractors are sampled inside the species crown envelope, asymmetrically biased by `ctx.asymmetry.lightBias` if set.

```ts
function scaRefineScaffolds(scaffolds, attractorPoints, params):
    activeApices = scaffolds.map(s => s.tip)
    for iteration in 0..maxIterations:
        // For each attractor, find nearest apex within perception radius
        influences = {}                    // apex → list of attractors
        for a in attractorPoints:
            nearest = findNearestApexWithinRadius(a, activeApices, perceptionRadius)
            if nearest: influences[nearest].push(a)
        
        newApices = []
        for apex in activeApices:
            if not influences[apex]: continue
            avgDir = average direction from apex toward influences[apex]
            // Tropisms
            avgDir += params.gravityVector * gravityWeight
            avgDir += params.lightBias * phototropicWeight
            avgDir = normalize(avgDir)
            // Step
            newPos = apex.position + avgDir * stepLength
            newNode = makeNode(newPos, avgDir, axisIndex=apex.axisIndex)
            newApices.push(newNode)
        
        // Kill consumed attractors
        attractorPoints = attractorPoints.filter(a => 
            distance to nearest tree node > killRadius)
        
        activeApices = newApices
        if activeApices.empty: break
```

**Critical rule**: the trunk apex is NOT in `activeApices`. Only scaffold tips and their descendants are.

---

## 6. Phase D — Forced hierarchy

Pure SCA tends to produce a flat hierarchy. To guarantee 1→4 orders, periodically spawn sub-axes from active apices.

```ts
function forcedHierarchy(scaffolds, params):
    for axis in scaffolds (recursively):
        for nodeIndex in 0..axis.length:
            // Every k_axis_order steps, spawn a sub-axis
            k = subAxisInterval[axis.order]    // e.g. [3, 4, 5, 6]
            if nodeIndex > 0 and nodeIndex % k == 0:
                if random < params.subAxisProbability * acrotonyAt(nodeIndex):
                    azimuth = (nodeIndex * GOLDEN_ANGLE) + jitter
                    angle = species.branchingAngleDeg * (1 - axis.order * 0.1)  // children at slightly steeper angle
                    spawn sub-axis with order = axis.order + 1
        if axis.order < 4:
            recurse into newly created sub-axes
```

Sub-axes are then themselves SCA-refined within sub-envelopes, but typically with shorter perception radius and fewer attractors.

---

## 7. Phase E — Aging

Apply only if `ageYears > matureAgeThreshold`:

1. **Crown damage**: with probability `ctx.damage.crownTopDamageProbability`, remove the top 10–25% of the highest axis. Replace with a **reiteration cluster**: spawn 3–5 new apices from the cut location, each behaving as an independent Rauh-model sub-tree (recursively run Phases A–D at small scale).
2. **Scaffold damage**: with probability `ctx.damage.scaffoldDamageProbability` per Order-1 scaffold, remove that scaffold and leave a **knot scar** marker at the trunk insertion point.
3. **Reiteration**: with probability proportional to `species.reiterationProbability * ageYears / 10`, on each Order-1/Order-2 axis older than 30 years, spawn 1–3 strongly orthotropic shoots from a random point on the upper surface. These are short tree-lets at small scale.
4. **Self-pruning**: remove all branches below `ctx.selfPruningHeight`, leaving knot scars.

---

## 8. Phase 7–8 — Radii (already specified in Vol. 04)

Bottom-up pipe model, then per-segment continuous taper, then junction blend. **Junction blend length must be clamped to a small multiple of the *child* radius**, never the parent — this prevents trunk apex bulge.

---

## 9. Phase 9 — Mesh generation

For each axis:

1. Sample its node positions and directions.
2. Build a **Catmull-Rom spline** through the node positions (smooth continuous geometry between nodes).
3. At each evaluation parameter t ∈ [0, 1], compute:
   - Position from spline.
   - Tangent (derivative of spline).
   - A consistent **frame**: parallel-transport frame from base to avoid twisting (use Frenet only as fallback).
   - Radius from §8.
4. Generate a ring of N_radial vertices at each evaluation.
5. Stitch rings into triangle strips.

`N_radial`:

| Branch order | radial verts |
|---|---|
| Trunk | 12–16 |
| Order 1 | 8–10 |
| Order 2 | 6 |
| Order 3+ | 4 |

This delivers good silhouettes at the trunk and base while keeping twig polycount low.

---

## 10. Phases 10–13 — see Vol. 06, 07, 09

These are spec'd in their respective volumes.

---

## 11. Performance budget

For interactive editing on a mid-range GPU, target:

- Total tree skeleton generation: **<50 ms** for a mature tree.
- Total mesh generation: **<150 ms**.
- Total render: **<6 ms/frame** at 1080p for one tree at near-LOD.
- For a mature tree: **<200,000 triangles** wood + **<300,000 triangles** foliage (cards as quads).

Falling outside these means LOD thresholds are wrong or radial vert counts are too high.

---

## 12. The minimum viable engine — what must work before anything else

If only the following are correct, the tree will already be 80% of the way to "real":

1. ✅ Phase A trunk does not kink, sway is smooth.
2. ✅ Phase B scaffolds use phyllotaxis (golden angle for spiral species).
3. ✅ Phase D forced hierarchy produces visible 1→4 orders.
4. ✅ Phase 7–8 pipe model + continuous taper.
5. ✅ Junction blend doesn't bulge the trunk.
6. ✅ Foliage anchored to terminal nodes only, with tufts.
7. ✅ Bark scales with local radius (smooth on twigs, fissured on trunk).
8. ✅ Buttress flares present on plate-rooted species.

The remaining 20% is in reiteration, environmental modulation, four-frequency wind, and species-specific shader tuning.
