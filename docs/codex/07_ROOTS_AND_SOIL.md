# Volume 07 — Roots and the Soil Interface
**The half of the tree no one rendered until SpeedTree 8.**

---

## 1. What's actually below ground

A mature tree has root mass roughly equal to 20–30% of its above-ground biomass, but distributed in a **flat, wide disc** — typically 1–3× the crown diameter, but only 0.3–1.5 m deep. The textbook deep "taproot" is mostly a juvenile feature; in mature trees of most species it is reduced or vestigial. The dominant root system is a **shallow lateral mat** with vertical "sinker roots" descending from major laterals where soil permits.

For procedural purposes we care about three visible structures:

1. **Buttress flares** — the swelling at the base where major lateral roots merge into the trunk.
2. **Surface roots** — partial exposure of major laterals near the trunk, common on old trees in compacted, shallow, or eroded soils.
3. **Root flare collar** — the smooth conical transition from straight trunk to ground, typically 1.0–1.5× trunk diameter wide and 0.3–0.6× tall.

Below ~30 cm from the trunk, roots are almost never visually relevant in real-time rendering (they're underground or grass-covered).

---

## 2. The four root architectures

### 2.1 Plate-root (most temperate broadleaves)
- Wide, shallow lateral mat (most mass in top 60 cm of soil).
- Pronounced buttress flares at the base.
- Examples: oak (mature), maple, beech, lime/linden, plane.

### 2.2 Heart-root (intermediate)
- Mix of wide laterals and modest sinker roots.
- Moderate buttressing.
- Examples: hornbeam, larch, Douglas-fir.

### 2.3 Tap-root (deep, juvenile-dominant)
- Single dominant vertical root in young trees; in maturity, often replaced or overshadowed by laterals.
- Minimal buttressing; trunk meets ground in a near-cylindrical collar.
- Examples: walnut, hickory, pecan, oak (juvenile), pine (most species in deep soil).

### 2.4 Plank-buttress (tropical specialty)
- Massive flattened buttresses extending many meters from the trunk.
- Examples: kapok, fig (Ficus), tropical legumes.
- Visible as **vertical fins** rather than tapered cones.

For temperate procedural trees, only the plate-root and tap-root archetypes need full implementation; heart-root is a parameterized blend.

---

## 3. The buttress flare — the most important root visual

The transition from cylindrical trunk to ground is a **smooth fillet** in tap-rooted species, but a **set of N triangular flares** in plate-rooted species. Each flare corresponds to a major lateral root departing the trunk in a specific azimuth.

Specification:

```
For a plate-rooted species with N flares (typically 3–7, spiral phyllotaxis):
  For each flare i in 0..N-1:
    azimuth_i = (i * 137.5°) mod 360°
    flare_radius_factor_i = 1.0 + flareStrength * uniform(0.7, 1.3)
    flare_height_i = trunkRadius * flareHeightFactor * uniform(0.8, 1.2)

  Generate trunk cross-sections at heights h ∈ [0, flare_height_max]:
    For each vertex v at azimuth a, height h:
      bulge(a, h) = 1 + Σ_i [
        (flare_radius_factor_i - 1)
        · gaussian(angular_distance(a, azimuth_i), flareWidthAngle)
        · (1 - h / flare_height_i)^flareDecayPower
      ]
      vertex_radius(v) = baseTrunkRadius(h) · bulge(a, h)
```

This produces the characteristic **scalloped base** of an oak or beech, with smooth blending into the cylindrical trunk above.

Default parameters by species class:

| Class | N flares | flareStrength | flareHeightFactor | flareWidthAngle |
|---|---|---|---|---|
| Strong plate-root (old oak, beech) | 5–7 | 0.50 | 4.0 (4× trunk radius) | 35° |
| Moderate plate-root (maple) | 4–5 | 0.30 | 2.5 | 30° |
| Tap-root (pine, walnut) | 0 (smooth fillet only) | 0 | 1.0 | — |
| Heart-root (hornbeam) | 3–4 | 0.20 | 2.0 | 25° |

A single uniform fillet (no flares) is acceptable for young trees of any species and for most conifers. **Mature broadleaves without flares look wrong** — like they were stuck into the ground.

---

## 4. Surface roots

Where major laterals continue along the surface for some distance before diving:

- **Visibility**: typically 0.5–2.0 m from trunk before going underground.
- **Diameter**: continues the pipe-model from the buttress; thinner than the trunk segment they emerge from.
- **Cross-section**: often half-buried (D-shape rather than full circle). For real-time rendering, full cylinder pushed slightly into the ground is sufficient.
- **Triggers**: old age, compacted soil, shallow soil, erosion. In a procedural system, expose as a `surfaceRootProminence` slider [0, 1].

A typical implementation:

1. After the trunk and flares are built, for each flare azimuth, optionally extend a tapered cylinder along the ground surface for `length = 1–4 × trunkRadius`, slowly dipping below.
2. The cylinder follows a slight horizontal sinusoidal path (gnarled feel) and undergoes its own pipe-model thinning.
3. Bark on surface roots should be the same archetype as the trunk but typically darker (moss, soil staining).

---

## 5. Root collar / soil interface

Where the tree meets ground, three real-world details matter visually:

- **Soil mound**: many planted/young trees show a slight raised mound where the planting backfill remains (often visible for years).
- **Mulch ring**: managed trees often have a darker disc of mulch.
- **Leaf litter / moss**: natural trees accumulate organic matter at the base.

For ground-blending, the cleanest technique is a **soft alpha decal** rendered on the terrain extending 0.5–2.0 m around the trunk, with bark/displacement continuing slightly underground. Procedural trees that meet the ground in a visible *seam* immediately read as fake; smoothing this transition is one of the highest-leverage tweaks in any tree pipeline.

---

## 6. Mycorrhiza and the wood-wide web (cultural note, not engine spec)

For completeness: ~90% of land plants form symbiotic associations between root tips and fungi (mycorrhizae), exchanging sugars for water and minerals. Networks of mycorrhizal hyphae connect adjacent trees and enable the lateral transfer of carbon, nitrogen, and signaling molecules — the so-called "wood-wide web" popularized by Suzanne Simard. While not directly relevant to rendering a single tree, this informs ecosystem-level features (forest mode, undergrowth shaders) and should be considered if ProVeg Studio extends to multi-tree forest scenes.

---

## 7. Root spec in code-form

```ts
interface RootSpec {
  archetype: 'plate' | 'heart' | 'tap' | 'plank-buttress';
  flareCount: number;                  // 0 for tap; 3–7 for plate
  flareStrength: number;               // 0–1, radius bulge multiplier
  flareHeightFactor: number;           // multiple of trunk radius
  flareWidthAngle: number;             // degrees, gaussian width per flare
  flareDecayPower: number;             // taper from base; ≈2 for hard taper, 1 for linear
  surfaceRootProminence: number;       // 0–1, 0 = none, 1 = strongly exposed
  surfaceRootMaxLength: number;        // multiple of trunk radius
  soilBlendDistance: number;           // meters, for soft alpha decal
}
```

This spec lets a species preset declare its root style declaratively. The engine then runs the appropriate cross-section deformation and the optional surface-root extruder.
