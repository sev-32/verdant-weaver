# Volume 15 — Glossary, Symbols, and Units
**Single source of truth for terminology.**

---

## A

**Acrotony** — branching pattern where the strongest side branches occur near the *apex* of the parent shoot. Contrast with mesotony (middle) and basitony (base). Most temperate trees are acrotonic.

**Allometry** — the study of how organism dimensions scale with each other (e.g. height vs DBH).

**Apical control** — long-range hormonal mechanism by which the leader of the tree maintains height-growth advantage over side branches over years. Strong → excurrent (conical) crowns; weak → decurrent (rounded) crowns.

**Apical dominance** — short-range suppression of *immediate* axillary buds by auxin from the very tip. Strong → straight unbranched leader; weak → forking apex.

**Apex** (apical meristem, SAM) — the dome of dividing cells at the tip of every shoot. The "agent" in agent-based growth models.

**Architectural model** — one of 23 inherited growth blueprints described by Hallé, Oldeman & Tomlinson. Determines monopodial vs sympodial trunk, plagiotropic vs orthotropic branches, etc. Six matter for temperate trees: Rauh, Massart, Troll, Leeuwenberg, Attims, Champagnat.

**Auxin** (IAA) — the dominant plant hormone for apical dominance, vascular differentiation, and tropisms. Made in apices, flows down.

**Axillary bud** — dormant SAM in the axil of every leaf, capable of becoming a side branch.

**Azimuth** — angular position around a stem axis (used for phyllotactic placement).

## B

**Basipetal** — flowing toward the base. Auxin transport is basipetal in stems.

**Bifurcation ratio (R_b)** — Strahler-style ratio of branches at consecutive orders. Typically 3.5–5 for temperate broadleaves.

**Branching angle** — angle at which a side branch leaves its parent stem, measured from the parent's growth direction. Species-stable.

**Bud break** — spring activation of dormant buds.

**Buttress flare** — radial swelling at the base of a tree where major lateral roots merge into the trunk. Most pronounced on plate-rooted species (oak, beech).

## C

**Cambium** — lateral meristem producing secondary growth. **Vascular cambium** produces xylem inward and phloem outward. **Cork cambium** (phellogen) produces cork outward.

**Catmull-Rom spline** — interpolating cubic spline used in ProVeg Studio for smooth continuous branch geometry between skeletal nodes.

**Champagnat's model** — orthotropic growth that arches over under self-weight. Weeping willow.

**Cohesion-tension theory** — explanation for upward water flow in xylem under transpiration tension.

**Cork (phellem)** — dead, hydrophobic, inelastic outer tissue. The visible bark.

**Crown** — the foliage-bearing portion of the tree. **Crown envelope** is the volumetric shape (often ellipsoidal) that bounds the foliage.

**Cytokinin** — root-produced hormone antagonistic to auxin at axillary buds. Promotes lateral budding.

## D

**Da Vinci's rule / Pipe model** — `r_parent² ≈ Σ r_child²`. Foundation of believable taper.

**DBH** — Diameter at Breast Height. Standard forestry measurement at 1.37 m.

**Decurrent** — crown shape: rounded, no clear single leader at maturity (oak, elm).

**Decussate** — phyllotaxis: opposite pairs of leaves, each pair rotated 90° from the previous (maple, ash).

**Distichous** — phyllotaxis: alternating, two-ranked, all in one plane (elm, lime).

## E

**Earlywood / latewood** — large-vessel, low-density wood made early in the year vs small-vessel, high-density wood made late. Together form annual rings.

**Edge tree** — a tree on the edge of a stand or row, with strongly asymmetric crown extending into the lit side.

**Epicormic shoot** — a shoot that grows from a dormant bud on old wood, typically after damage.

**Etiolation** — long, thin, weakly-branched form produced under deep shade.

**Excurrent** — crown shape: conical, single dominant leader (spruce, fir, sweetgum).

## F

**Fissured bark** — vertical splits in cork, dominant in oak, ash, elm.

**Frenet frame** — coordinate frame derived from a curve's tangent and curvature. Avoid in mesh generation: use parallel transport instead.

## G

**Gibberellin** (GA) — hormone promoting internode elongation.

**Golden angle** — 137.5077640500378°, the divergence angle of spiral phyllotaxis. The most irrational fraction of a turn.

**Gravitropism** — growth response to gravity. Negative (against gravity) in shoots; positive (with gravity) in roots.

## H

**Hallé–Oldeman–Tomlinson typology** — the 23 architectural models.

**Heartwood** — the older, often darker, dead, structural inner wood.

**Heart-root** — root architecture intermediate between plate-root and tap-root.

**Horton-Strahler ordering** — system for assigning order numbers to branches in a tree.

## L

**Leaf Area Index (LAI)** — total one-sided leaf area per unit ground area.

**Leeuwenberg's model** — sympodial Y-fork architecture (manzanita, dogwood).

**Lenticel** — pore in cork allowing gas exchange. Visible as horizontal scars on smooth bark (birch, cherry).

**L-system** — symbolic rewriting system, the canonical formalism for plant grammars.

## M

**Massart's model** — monopodial trunk with whorls of plagiotropic branches. The "tier conifer" (fir, spruce).

**Meristem** — tissue of dividing cells. Primary types: SAM (apical), cambium (lateral).

**Monopodial** — growth from a single dominant apex.

**Münch flow** — pressure-flow hypothesis for sugar transport in phloem.

**Murray's law** — `r_parent³ = Σ r_child³`, derived from minimum-work optimization. Modified pipe-model exponent for specific systems.

## N

**Negative gravitropism** — growth against gravity (shoots).

## O

**Order** — depth in the branch hierarchy. Trunk = Order 0; main scaffolds = Order 1; etc. Strahler ordering counts terminal twigs as Order 1.

**Orthotropic** — vertical growth (trunks, leaders).

## P

**Parallel-transport frame** — coordinate frame transported along a curve preserving rotation, used for stable mesh generation along twisting branches.

**Periderm** — outer dermal tissue including cork cambium and cork.

**Phellogen** — cork cambium.

**Phloem** — sugar-transporting tissue (made by cambium outward).

**Phototropism** — growth toward light, mediated by lateral auxin redistribution.

**Phyllotaxis** — geometric pattern of leaf placement around the stem. Spiral, distichous, decussate, or whorled.

**Pipe model** — see Da Vinci's rule.

**Pith** — geometric center of the original first-year shoot. Eccentric in trees with reaction wood.

**Plagiotropic** — horizontal growth (most side branches).

**Plate-root** — wide shallow root architecture with pronounced buttress flares (most temperate broadleaves).

**Pollarding** — repeated cutting back of a tree to a fixed point, producing a candelabra of reiterations.

**Primary growth** — extension of shoots and roots in length.

**Proleptic** — branch arising from a bud after at least one winter of dormancy. Default in temperate trees.

## R

**Rauh's model** — monopodial orthotropic rhythmic growth with branches obeying the same rules as the trunk. The "default" temperate broadleaf (oak, ash, hickory).

**Reaction wood** — denser wood produced asymmetrically in response to gravitational/wind stress. Compression wood in conifers (lower side), tension wood in hardwoods (upper side).

**Reiteration** — production of a partial copy of the juvenile architecture from an axillary or epicormic bud, especially after damage or in old age.

**Rhythmic growth** — extension in distinct flushes, typically annual. Contrast with continuous.

## S

**Sapwood** — younger, often paler, living outer wood actively conducting water.

**SCA** — Space Colonization Algorithm. Runions et al. 2007.

**Scaffold** — Order-1 main branch.

**Secondary growth** — radial thickening produced by cambium.

**Self-pruning** — natural shedding of lower branches as the canopy rises (forest-grown trees).

**Sympodial** — growth in which the apex aborts or terminates and a lateral takes over to continue the axis.

**Sylleptic** — branch arising from a bud in the same season it was formed (no dormancy). Typical in saplings of fast-growing species.

## T

**Tap-root** — single deep central root, dominant in juveniles of many species, often diminished at maturity.

**Taper** — reduction of radius along an axis from base to tip.

**Thigmomorphogenesis** — morphological response to mechanical stress (wind, brushing). Shorter, thicker, more branched form.

**Triplanar projection** — texture sampling in three orthogonal world-space planes, blended by absolute normal components. Eliminates pole pinching and stretching.

**Troll's model** — sympodial trunk built by chained plagiotropic axes that bend up.

**Tropism** — directional growth response to a stimulus.

## V

**Vascular cambium** — see cambium.

## W

**Water sprout** — vigorous epicormic shoot on old wood, typically arising after pruning or damage.

**Whorl** — ring of branches or leaves all originating at the same node. Massart-model trees have annual whorls.

**Whorled phyllotaxis** — leaves placed in rings of N at each node.

---

## Symbols and units

Throughout the codex:

| Symbol | Meaning | Unit |
|---|---|---|
| H | Tree total height | m |
| d, DBH | Trunk diameter at breast height | cm or m |
| R | Crown radius | m |
| n | Pipe-model exponent | dimensionless |
| r | Local stem radius | m |
| t | Time / interpolation parameter | s or unitless |
| α | Phototropic gain | unitless [0,1] |
| LAI | Leaf area index | m²/m² |
| φ | Golden ratio (1.618…) | dimensionless |
| Golden angle | 360° · (1 − 1/φ) ≈ 137.508° | degrees |

All angles in code expressed in **radians**. All distances in **engine units** (metric scale assumed in this corpus; ProVeg Studio scale factor applies at render time).

---

## Cross-reference shortcuts

When citing the codex from code or documentation, use this convention:

```
// Pipe model — see codex/04 §4
// Acrotony curve — see codex/13 §4
// Failure: "spear branches" — codex/14 §2.3
```

This keeps comments compact and points readers to the canonical explanation.
