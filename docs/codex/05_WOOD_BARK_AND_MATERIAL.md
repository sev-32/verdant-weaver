# Volume 05 — Wood, Bark and Material
**Why bark looks the way it does, and how to render it without the "wallpaper" effect.**

---

## 1. The two-layer reality

Every visible woody surface is the product of two coupled processes:

1. **Inner**: the **vascular cambium** lays down new xylem (wood) inward each year, producing growth rings. The trunk gets thicker.
2. **Outer**: the **cork cambium (phellogen)** lays down cork (phellem) outward. Cork is dead, hydrophobic, and inelastic. As the inner wood expands, cork must accommodate or split.

The species-specific way cork accommodates expansion is what we call **bark texture**. There are six recognizable styles, each requiring a different shader strategy.

---

## 2. The six bark archetypes

### 2.1 Smooth
Cork cambium remains active for the lifetime of the branch and stretches with diameter growth. Surface stays unbroken.
- **Examples**: beech (*Fagus*), young birch, hornbeam, young magnolia, holly.
- **Shader**: low-frequency hue variation (gray to silver-gray), subtle tangential lenticel scars, very low displacement (≤2% of radius). Procedural noise: low-amplitude Perlin in tangent space.

### 2.2 Lenticular / horizontal-banded
Smooth base with prominent **lenticels** — pores in the cork that allow gas exchange. As diameter grows, lenticels stretch tangentially and may rupture into horizontal bands.
- **Examples**: birch (*Betula*), cherry (*Prunus*), rowan, bird cherry.
- **Shader**: smooth base + horizontal albedo bands (darker, slightly recessed) at semi-regular vertical spacing (2–8 mm scaled), often paired with the famous *exfoliating papery layers* in birch.

### 2.3 Plated / scaly
Cork cambium dies in patches. New cork cambia form underneath, lifting older cork as **scales or plates**. Plates eventually slough off.
- **Examples**: pine (*Pinus*, especially mature), sycamore/plane (*Platanus*), Scots pine, eucalyptus (some), shagbark hickory in extreme.
- **Shader**: Voronoi-based displacement with deep cracks between cells; cell color varies (often a young yellow-orange under, weathered gray-brown above). Plate size grows with branch diameter (2 cm scales on a young branch, 15 cm plates at the base of a mature pine).

### 2.4 Furrowed / fissured
Continuous cork; vertical structural fibers in the cork dominate, so as diameter increases, splits propagate **vertically** along fiber lines.
- **Examples**: oak (*Quercus*), ash, elm, walnut, sweet chestnut, locust.
- **Shader**: 3D ridge–valley pattern aligned to the branch axis, fissure depth scaling with cumulative radial growth. Worley/cellular noise stretched 5–10× in the axial direction approximates the topology well.

### 2.5 Papery / exfoliating
Thin cork sheets form, separated by horizontal lenticel zones; outer sheets peel.
- **Examples**: birch (especially paper birch), paperbark maple, river birch, *Eucalyptus deglupta* (rainbow eucalyptus, a uniquely colored variant), *Heritiera*.
- **Shader**: layered semi-transparent decals or vertex-color blend revealing inner-cork colors (orange, pink, white) under outer (white, papery).

### 2.6 Stringy / shaggy / fibrous
Long fibers in cork resist transverse tearing; bark hangs in long strips.
- **Examples**: shagbark hickory, redwood, juniper, many *Eucalyptus* (stringybarks, ironbarks).
- **Shader**: vertical strip displacement with random length, partially detached at top or bottom; can be implemented as displacement + alpha masks for true 3D strips.

---

## 3. Bark scales with age, not size

A common procedural error: applying full-strength bark texture uniformly. In reality, **a 2 cm twig of an oak has nearly smooth bark** — fissures only develop after the cumulative radial growth at that point is enough to crack continuous cork.

> **Engine specification.** Define a per-species `barkOnsetRadius` (the radius below which bark is smooth) and `barkSaturationRadius` (above which bark is at full intensity). Interpolate displacement amplitude and fissure depth between these. Typical values:
>
> | Species | Onset (m) | Saturation (m) |
> |---|---|---|
> | Oak | 0.03 | 0.20 |
> | Pine | 0.04 | 0.25 |
> | Birch (papery) | 0.01 | 0.10 |
> | Beech (smooth) | n/a | n/a |
> | Eucalyptus (deciduous bark) | 0.02 | 0.15 |

The engine should sample the local radius at every vertex and modulate bark intensity continuously. This single change — already absent in many engines — makes the difference between "tree" and "fake tree."

---

## 4. Color spectra for bark

Bark color is rarely uniform. Common patterns:

| Species | Base hue | Modulators |
|---|---|---|
| Oak | warm gray-brown #6b5e4a | darker fissures (#3b2f24); occasional moss patches on north side |
| Pine | reddish-brown plates (#8b5a3c) over gray (#6b5e54); top of trunk often warmer | weathering darkens lower trunk |
| Birch | white (#e8e4d9) with black horizontal scars (#1a1612) | inner cork orange when peeling |
| Beech | cool silver gray (#9a9890) | smooth; lichen splotches common |
| Maple | mid gray (#6e6a62) with shallow furrows | old trees develop plates |
| Cherry | dark red-brown (#5a3a2c) | conspicuous horizontal lenticel bands |
| Sycamore/plane | mottled green-cream-tan due to plate shedding | exposes contrasting under-cork |

A **noise-driven hue offset (±0.05 in HSV)** at 5–20 cm spatial scale prevents uniformity without making the trunk look diseased.

---

## 5. Wood (interior, when visible)

When a branch is broken or cut, the interior wood is exposed: heartwood (often darker, dead, structural) inside, sapwood (lighter, living) outside, growth rings concentric. For broken-branch stubs and for stylized cross-sections:

| Species | Heartwood | Sapwood | Ring contrast |
|---|---|---|---|
| Oak | yellow-brown to dark brown | pale cream | moderate |
| Walnut | rich chocolate brown | pale tan | low |
| Cherry | warm red-brown | pinkish cream | low |
| Pine | yellow-orange (resinous) | nearly white | very high (latewood almost black) |
| Yew | rich orange-red | almost white | high |

Most game-quality engines don't expose wood interiors. ProVeg Studio should at least support a stylized cut-end shader for the rare case where it matters (broken branch tips on storm-damaged trees).

---

## 6. Triplanar projection — the "wallpaper" cure

Cylindrical UV unwrapping of branches has two failures:

1. **Pole pinching** at branch tips and bifurcations.
2. **Texture stretching** when radius varies along the branch.

The fix is **world-space triplanar projection**: sample the bark texture three times (along XY, YZ, ZX planes) and blend by absolute world-space normal components. This eliminates both failures and is essential for branches that arc and twist.

For ProVeg Studio specifically (already in memory), triplanar must be **world-space, not view-space**, or textures slide as the camera moves. This was an early bug in the rock pipeline and the same rule applies to bark.

---

## 7. The bark spec in code-form

```ts
interface BarkSpec {
  archetype: 'smooth' | 'lenticular' | 'plated' | 'fissured' | 'papery' | 'stringy';
  baseHue: HSV;                    // dominant color
  hueVariation: number;            // 0–1, low-frequency variation amount
  onsetRadius: number;             // meters — below this, bark is smooth
  saturationRadius: number;        // meters — above this, bark is full strength
  fissureDepth: number;            // 0–1, normalized to local radius
  fissureScale: { x: number; y: number }; // axial vs tangential frequency
  lenticelDensity: number;         // 0–1 (only used by lenticular/papery)
  weatheringFactor: number;        // 0–1 — added moss/lichen at base
  triplanarBlendSharpness: number; // 1–8 — how sharply the three projections blend
}
```

Each species preset declares its `BarkSpec`; the renderer chooses a shader path based on `archetype`. This separation lets art/science evolve the species library without re-touching engine code.
