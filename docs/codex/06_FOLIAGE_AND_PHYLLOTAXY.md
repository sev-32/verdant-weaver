# Volume 06 — Foliage Systems
**Where leaves grow, how they cluster, and why they should never look pasted on.**

---

## 1. The first principle

> **Leaves grow on wood, not in space.** Specifically, leaves grow on the **youngest 1–3 years** of growth — that is, on the *terminal nodes of the branch graph and the few internodes immediately behind them*.

This single fact is the most violated rule in procedural foliage. Engines that scatter leaves through the crown by Poisson sampling produce floating cards; engines that anchor leaves to terminal branch nodes produce trees.

---

## 2. Leaf placement: the two-stage system

### Stage A — *which branch nodes carry leaves*

For each terminal axis (an axis whose Strahler order is 1), the youngest segment(s) carry leaves. Define `leafCarryingTipFraction` ∈ [0.3, 1.0] — the fraction of the axis's length, measured from the tip back, on which leaves are placed. Default 0.6.

For older orders, leaves are absent except in **immediate-leaf species** (pines: needles persist 2–7 years on Order 1–2 axes) or under **strong epicormic foliage events** (water sprouts on old wood in stressed broadleaves).

### Stage B — *where on the carrying segment(s) they sit*

Within a leaf-carrying segment, leaves are placed at internode centers along the axis, with **azimuth determined by phyllotaxis** (Vol. 03), not random.

> **Anti-pattern.** Many engines place leaves by sampling random points inside a Crown Envelope ellipsoid and instantiating cards. The result reads as "leaf cloud near a tree," not as "leaves on branches."

---

## 3. Leaf morphology — the eight shape archetypes

Botanically, leaves vary in dozens of dimensions; for procedural purposes, eight shape classes cover almost everything an end-user cares about.

| Class | Outline | Examples | Card geometry |
|---|---|---|---|
| **Simple ovate** | Egg-shaped, pointed tip | Oak (rounded lobes), apple, lime | Quad with subtle taper |
| **Simple lanceolate** | Long, narrow, lance-shaped | Willow, peach, eucalyptus | 3:1 aspect quad |
| **Simple lobed** | Hand-shaped with lobes | Maple, sycamore, plane, oak (deep lobes) | Cutout texture on quad |
| **Compound pinnate** | Many leaflets along a central stem | Ash, walnut, locust, mountain ash | Strip of leaflet quads |
| **Compound palmate** | Leaflets radiating from one point | Horse chestnut, buckeye | Star of leaflet quads |
| **Needle (single)** | Single needle | Spruce, fir, hemlock | Triangular strip |
| **Needle cluster** | 2–5 needles in a fascicle | Pine (2 in Scots, 3 in Yellow, 5 in White) | Bundle of needles per node |
| **Scale** | Tiny overlapping scales | Cypress, juniper, cedar | Single textured strip per shoot |

For procedural rendering, each class maps to a different leaf-card generator. Card meshes should typically be:

- **Diamond / 6-vertex card** (current ProVeg Studio): 4 outer + 2 midline → curls slightly; far cheaper than a billboarded textured card and has true 3D presence under raking light. This is industry-standard practice.
- **Twisted card pair** (SpeedTree): two crossed quads at 90°, slightly twisted → reads as bushy from any angle, costs 4 verts.

### 3.1 Leaf size scaling

Leaf area scales with available light. **Sun leaves** (high in the canopy, full insolation) are small, thick, and often glossy; **shade leaves** (low in the canopy, mostly diffuse light) are large, thin, and matte. Real ratios reach 3:1 area difference within the same tree.

> **Engine implication.** Leaf-card scale should taper from full at outer crown to ~120% near interior, **inverted** from typical implementations that make outer leaves bigger. This subtle gradient adds depth without any extra geometry.

---

## 4. Clustering — the "shoot tuft"

Leaves on a single year's terminal shoot form a **tuft**. From a distance these tufts read as the basic visual unit of canopy density; up close they are recognizable as the genus signature.

| Genus | Tuft signature |
|---|---|
| Pine | Bundle of 2/3/5 long needles every 1–3 cm along a green-yellow shoot |
| Spruce | Single needles around the entire shoot, swept slightly forward |
| Fir | Single needles with white stomatal stripes underneath, often two-ranked |
| Oak | Spiral tuft of 4–8 lobed leaves at the tip, larger than interior leaves |
| Maple | Two opposite pairs of leaves at the tip plus 1–2 pairs behind |
| Ash | Compound leaves at distal nodes, large (20–30 cm) |
| Beech | Spiral of small ovate leaves, characteristic flat plane on horizontal branches |

A correct foliage generator emits a *tuft* per terminal node, not individual leaves at world points. This is faster, looks better, and supports per-tuft variation (color, scale) instead of per-leaf.

---

## 5. Leaf orientation

Each leaf has three orientation parameters that matter:

1. **Azimuth** around the stem — set by phyllotaxis.
2. **Insertion angle** from the stem — typically 30–70° from the parent axis.
3. **Light orientation** — leaves rotate toward incident light over hours/days. In a procedural snapshot, this is encoded as: leaf normals biased toward the sun direction, with strength reducing for interior shaded leaves.

Add a small per-leaf jitter (±10° on each axis) to break visual regularity.

---

## 6. Seasonal color

Temperate deciduous trees pass through five color regimes:

| Phase | Pigments dominant | Visible color |
|---|---|---|
| Spring flush | Chlorophyll low, anthocyanins high (sun protection on tender leaves) | Light green with pink/red tint (oak, beech, birch) |
| Summer | Chlorophyll dominant | Saturated green |
| Early autumn (chlorophyll catabolism) | Chlorophyll dropping; carotenoids revealed | Yellow (birch, beech, ash) |
| Late autumn (anthocyanin biosynthesis) | Newly synthesized anthocyanins | Red (maple, sumac, dogwood) |
| Senescence | Tannins | Brown |

Color is not uniform across the crown. Leaves at the **top and outside** redden/yellow first (more sunlight + more cold exposure); interior leaves stay green longest. **Color gradient should follow a position scalar in the foliage shader** — typically world-Y normalized over crown height — rather than per-leaf random.

Different species have wildly different autumn signatures:

| Species | Autumn color |
|---|---|
| Sugar maple | Brilliant orange-red |
| Red maple | Pure red (some) to yellow (others) |
| Sweetgum | Red, purple, orange — multiple on same tree |
| Aspen / poplar | Pure gold |
| Beech | Copper bronze (and persists into winter) |
| Oak (red oak group) | Russet to wine-red |
| Oak (white oak group) | Brown |
| Hickory / walnut | Yellow |
| Birch | Yellow |
| Larch (deciduous conifer) | Gold needles, then dropped |

A robust season parameter exposes a `seasonalColorPhase` in [0,1] (0 = full summer, 0.5 = peak autumn, 1.0 = winter / leafless) and per-species *autumn palettes* that override the green LUT smoothly.

---

## 7. Foliage density and Leaf Area Index (LAI)

Total foliage volume should be calibrated to the species' typical LAI (Vol. 04, §6.4). Given:

- Crown projected area `A_crown` (from the silhouette projection of the foliage carrying region)
- Target LAI `L`
- Per-leaf area `a_leaf` (average for the species)

The total number of leaves should be approximately:

```
N_leaves ≈ A_crown · L / a_leaf
```

This couples foliage to crown geometry: as the user slides crown radius, leaf count adjusts to maintain realistic density. The LAI parameter then becomes a single "lush vs sparse" knob that maps to the canonical ecological measurement, instead of a meaningless leafCount integer.

---

## 8. Translucency and the underside

Leaves are **thin scattering media**. Light passing through a leaf reaches the eye carrying chlorophyll absorption (loss of red, retention of green) — the back of a leaf in raking light is visibly more saturated and brighter than the front. Engines that ignore translucency produce flat foliage even with correct geometry.

Implementation:

- Two-sided shading.
- Subsurface or transmission term proportional to back-side incident angle (`max(0, dot(-L, N))`).
- Slightly desaturated and *more luminous* color on the back side, with the saturation skewed toward yellow-green.
- **Wrap lighting** (Hemispheric / Half-Lambert) on the front side prevents black undersides on shaded leaves.

This is one of the cheapest visual upgrades: a single additional term in the leaf shader, transformative impact.

---

## 9. Foliage LOD strategy

A single mature oak can carry **200,000–500,000 leaves**. No real-time engine can render this many cards individually. Standard strategy:

| Distance | Representation |
|---|---|
| Near (<10 m) | Individual cards or tufts, full shader |
| Mid (10–40 m) | Larger compound cards, each "leaf" actually a small tuft texture |
| Far (40–150 m) | Crown-level billboards using captured render of the tree from N angles |
| Very far (>150 m) | Single billboard or impostor sphere |

The transition between LODs is the hardest visual problem in foliage rendering. Industry-standard fixes: alpha-blended cross-fade over 1–2 m of camera motion, or stochastic LOD where individual leaves disappear with a hash-driven dither.

---

## 10. Anti-patterns catalog

| Symptom | Cause | Cure |
|---|---|---|
| Leaves "float" near tree | Placed by world-space sampling | Anchor to terminal branch nodes (§2) |
| All leaves face camera | Pure billboarding | Use 6-vertex curled cards or twisted pairs |
| Crown is uniform green disc | No per-leaf hue jitter, no translucency | Add ±0.04 hue jitter, two-sided shading |
| Crown looks too dense or too sparse | Manually tuned leafCount | Drive leaf count from LAI × crown area (§7) |
| Autumn color uniform | Per-leaf random color from autumn palette | Drive color by world-Y position with per-species palette |
| Outer leaves look bigger than inner | Wrong scaling: shade leaves are larger | Invert: shade leaves +20% area (§3.1) |
| Pine looks like a fir / fir like a pine | Wrong needle morphology and arrangement | See §3 — pine = needle clusters, fir = single 2-ranked |
