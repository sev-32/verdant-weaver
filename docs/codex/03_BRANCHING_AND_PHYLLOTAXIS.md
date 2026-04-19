# Volume 03 — Branching and Phyllotaxis
**How meristems are placed in space, and why most procedural trees get it wrong.**

---

## 1. The two questions branching must answer

For every node on every axis, a generator must decide:

1. **Where, around the stem,** does the next leaf/branch sit? → *Phyllotaxis*.
2. **At what angle and with what vigor** does it leave the stem? → *Branching geometry*.

These are independent and must be parameterized separately. Conflating them — e.g. randomizing the azimuth — destroys the spiral signature that the eye reads as "real plant."

---

## 2. Phyllotaxis — the geometry of leaf placement

### 2.1 The four canonical patterns

| Pattern | Divergence angle | Examples |
|---|---|---|
| **Spiral (Fibonacci)** | **137.508°** (golden angle, 360°·(1−1/φ)) | >80% of dicots: oak, beech, willow, plane, apple |
| **Distichous** (alternate, 2-ranked) | 180° | Elm, lime/linden, hazel |
| **Decussate** (opposite pairs at 90° each node) | 180°/90° alternating | Maple, ash, dogwood, lilac, viburnum |
| **Whorled** | 360°/N for N leaves per node | Many conifers (needles); catalpa (3); oleander (3); pine *needle clusters* (2/3/5) |

> **The golden angle is not arbitrary.** It is the most irrational number expressible as a fraction of a turn, which means consecutive primordia *never* line up — guaranteeing that no leaf is directly above another and **light capture is maximized**. This is a consequence of plastic deformation in the meristem, modeled beautifully by Douady & Couder (1996) using ferrofluid droplets repelling each other on a growing disc.

### 2.2 Branching from leaves

Each leaf has an **axillary bud** in its axil. When that bud activates, it produces a branch *at the same azimuth as its parent leaf*. Therefore:

> **Branch azimuths inherit phyllotaxis.** A spiral-phyllotactic species (oak) produces branches at golden-angle increments around the stem. A decussate species (maple) produces branches in opposite pairs. **Randomizing branch azimuth is botanically wrong** and is the #1 reason procedural trees look "off" even when their silhouette is right.

### 2.3 Engine specification

```
For each node n on an axis with phyllotactic mode M:
  if M == SPIRAL:   azimuth(n) = (n * 137.5077640500378°) mod 360°
  if M == DISTICHOUS: azimuth(n) = (n * 180°) mod 360°
  if M == DECUSSATE: pair of leaves at azimuth (n*90°, n*90° + 180°)
  if M == WHORLED(k): k leaves at (n*offset + i*360°/k) for i in 0..k-1
```

A tiny per-node jitter (≤±3°) is botanically realistic and breaks visual regularity without violating the pattern.

---

## 3. Branching geometry — the angle, vigor, and timing of side shoots

### 3.1 Branching angle

The angle at which a side branch leaves its parent stem is a **species-stable property** with characteristic ranges:

| Form | Typical angle | Examples |
|---|---|---|
| Steeply ascending | 15–35° | Lombardy poplar, columnar oaks, young spruce leader |
| Moderately ascending | 35–55° | Most oaks, ash, walnut |
| Wide horizontal | 55–80° | Mature oak scaffolds, plane, chestnut, fir whorls |
| Drooping/pendulous | 80–110° (i.e. past horizontal) | Weeping willow, weeping cherry, some larch laterals |

The angle is *measured from the parent's growth direction*, **not from world-vertical**. A horizontal branch on a leaning trunk should still depart at the same relative angle.

### 3.2 Branching vigor — apical dominance and acrotony

Auxin from the apex suppresses lateral budding *with distance*: nearest buds are most suppressed. The pattern of which buds escape suppression defines three styles:

- **Acrotonic**: strongest branches near the *apex* of the parent shoot (oak, ash, most temperate broadleaves). Visually: branches concentrated in the outer third of each previous year's growth.
- **Mesotonic**: strongest in the middle (some maples, hornbeam in shade).
- **Basitonic**: strongest near the *base* (shrubs, hazel, suckering species; also coppice regrowth).

> **Engine specification.** Branching probability and vigor along an axis should follow a species-specific *acrotony curve* — typically a single-peaked function with peak position controlled by a `acrotonyPeak ∈ [0,1]` parameter (0=base, 1=tip). Default 0.7 for most temperate broadleaves.

### 3.3 Sylleptic vs. proleptic branches

- **Proleptic**: the axillary bud sits dormant for ≥1 winter before activating. The new branch starts from a *bud scar* on older wood. This is the temperate-tree default.
- **Sylleptic**: the axillary bud activates *immediately* in the same growing season, with no dormancy. The new branch starts from green wood. Common in fast-growing tropical species; in temperate trees, sylleptic shoots appear on **young vigorous saplings** (poplar, willow, eucalyptus, some Prunus) and on **water sprouts**.

Sylleptic branches have a characteristic look: thinner, more acute angles, often longer than their proleptic siblings of the same age. Including them on saplings adds a strong "young vigor" cue.

### 3.4 Reiteration shoots

As discussed in Vol. 02, damaged or aged trees release dormant buds *en masse*. These reiteration shoots are:

- Strongly **orthotropic** (vertical) regardless of host branch orientation.
- Often appearing in **clusters** at the damage site or along the upper surface of major scaffolds.
- Initially very vigorous (long internodes, large leaves), then settling into normal growth.

Implementing reiteration as a stochastic event on aged Order-1/Order-2 branches (probability rising with branch age, suppressed if local foliage density is high) is the single highest-impact addition to a "mature tree" mode.

---

## 4. Apical control vs. apical dominance

Two related but distinct concepts:

- **Apical dominance** (short-range): the auxin from the very tip suppresses *immediate* lateral buds. Strong in pines, acacias, eucalyptus → very straight trunks. Weak in old oaks → forking trunks.
- **Apical control** (long-range): the *leader* of the tree maintains height growth advantage over the *side branches*, year after year, by hormonal signaling along the trunk. Strong apical control → conical excurrent crowns (pine, fir, sweetgum). Weak apical control → rounded decurrent crowns (oak, elm, maple).

| Crown form | Apical dominance | Apical control | Example |
|---|---|---|---|
| Excurrent (conical, single dominant leader) | Strong | Strong | Spruce, fir, sweetgum, young pine |
| Decurrent (rounded, no clear leader at maturity) | Weak | Weak | Oak, elm, mature pine |
| Columnar | Strong | Strong + steep branch angle | Lombardy poplar, fastigiate oak |
| Weeping | Variable | Weak + strong gravity response | Weeping willow |

Both must exist as separate parameters. Strong dominance + weak control = a young pine that becomes a flat-topped old pine. This is precisely the natural progression and is impossible to model with a single "dominance" slider.

---

## 5. Bifurcation ratios and Horton–Strahler analysis

Trees obey approximate **scaling laws** in their branching topology, originally noticed in river networks (Horton 1945, Strahler 1952) and applied to plants by Leopold and others. Define:

- A terminal twig is a **Strahler order 1** branch.
- Where two order-1 branches join, the parent is **order 2**.
- Where two order-N branches join, the parent is order N+1; if a higher-order branch joins a lower one, order is unchanged.

The **bifurcation ratio** R_b = N_i / N_(i+1) (number of order-i branches divided by order-(i+1) branches) is approximately constant across orders for a given species, typically **3.5–5.0** for temperate broadleaves and **4.5–6.5** for excurrent conifers.

> **Engine implication.** A free generator should *measure* its own R_b post-hoc and warn if it falls outside [3, 7]. A R_b of 1.5 means the tree is too "twiggy" (too many sub-branches per parent); R_b of 10 means it's too "spear-like" (not enough sub-branching). This is a single-number sanity check that catches many pathologies.

---

## 6. Common procedural failures, named

| Failure | Cause | Fix |
|---|---|---|
| "Random fan" — branches all over the trunk at random azimuths | No phyllotaxis; uniform random angular sampling | Implement § 2.3 |
| "Frozen pinwheel" — perfectly regular spiral, too obvious | No jitter on phyllotactic angle | Add ±2° jitter |
| "Dandelion" — all branches at the apex | Too-strong acrotony, no length distribution | Soften acrotony curve, allow some mid-shoot branches |
| "Tinsel" — branches uniformly distributed along trunk | No acrotony, ignores apical dominance | Implement acrotony curve §3.2 |
| "Spear" — no sub-branching, just main branches with leaves | Hierarchy depth = 1 | Force orders 0→1→2→3→4 (see Vol. 13) |
| "Bouquet" — sub-branches all at near-equal angles to parent | Constant branching angle, no variation | Add ±10° jitter and species-specific mean |
| "Chandelier" — branches all horizontal regardless of context | No gravity tropism on long branches | Implement Vol. 08 environmental response |
