# Volume 04 — The Pipe Model and Tree Allometry
**Why trunks taper the way they do — and how to compute it.**

---

## 1. The Pipe Model in one paragraph

A tree's vascular system is, to first order, a bundle of unit-area xylem "pipes," each of which runs continuously from a leaf down to a root. At any point along the trunk or a branch, the cross-sectional area of conducting xylem must equal the sum of the conducting areas it supplies above. Therefore the *radius* of any branch is determined by the *amount of foliage it supports*:

> **r_parent² ≈ Σ r_child²** (Da Vinci, c. 1500; rediscovered by Shinozaki et al., 1964)

This is the single most important equation in believable tree geometry. Trees that violate it look wrong even when nothing else is.

---

## 2. Historical lineage

- **Leonardo da Vinci**, c. 1500, *Notebooks*: "All the branches of a tree at every stage of its height when put together are equal in thickness to the trunk." First recorded statement of the area-conservation rule, derived empirically from observation.
- **Shinozaki, Yoda, Hozumi & Kira (1964)**: "A quantitative analysis of plant form — the pipe model theory," *Japanese J. Ecology* 14. The modern formalization. Showed that for many species, sapwood area at a given height correlates linearly with leaf mass above.
- **Murray (1926)**: "The physiological principle of minimum work," PNAS. Derived from minimization of pumping cost + tissue maintenance cost the rule **r_parent³ = Σ r_child³** for vascular networks under laminar flow (Murray's law). Used in animal cardiovascular networks; in plants it appears modified because xylem flow is *not* actively pumped but driven by transpiration tension.
- **West, Brown & Enquist (1997, 1999)**: "A general model for the origin of allometric scaling laws in biology," *Science* 276; "A general model for the structure and allometry of plant vascular systems," *Nature* 400. Extended Murray's optimization to whole-tree scaling, predicting body-mass-to-metabolic-rate scaling exponents (the famous M^¾ law).
- **Sone, Suzuki, Noguchi & Terashima (2009)**: empirical data showing the **pipe-model exponent in real trees varies from 1.8 to 2.3** depending on species, age, and whether the tree is open- or closed-grown.

---

## 3. The general equation

Generalize Da Vinci to a tunable exponent **n**:

```
r_parent^n = Σ r_child^n
```

| n | Interpretation | Typical species |
|---|---|---|
| 2.0 | Pure area conservation (classical pipe model) | Most temperate broadleaves, default |
| 2.5 | Slight redundancy / safety margin in conducting tissue | Old oaks, hardwoods under stress |
| 3.0 | Murray-optimal flow | Some herbaceous stems; not typical for woody trees |
| 1.7–1.9 | "Lean" trees with long unbranched whips | Young poplars, eucalyptus, willow |

**ProVeg Studio default: n = 2.05.** Expose as `pipeModelExponent` parameter, range [1.6, 3.0].

---

## 4. Computing radii in a finished skeleton

After the SCA / L-system / hand-authored skeleton is built, radius assignment is a single bottom-up traversal:

```
function assignRadii(node, n, terminalRadius):
    if node.isTerminal:
        node.radius = terminalRadius
    else:
        sum = 0
        for child in node.children:
            assignRadii(child, n, terminalRadius)
            sum += child.radius ** n
        node.radius = sum ** (1.0 / n)
```

This guarantees:

- Trunk thickness emerges from the *amount of foliage the tree carries* — a sparse tree has a thin trunk, a dense tree has a thick one. **No magic trunk-thickness slider is needed.**
- Junctions are smooth in the radius dimension: no parent is ever thinner than any child.
- Pruning a branch correctly thins everything below.

---

## 5. Continuous taper between nodes — the *intra-segment* problem

The pipe model gives radii **at nodes**. Between nodes, real branches taper smoothly, but not linearly: the strongest taper happens just below a junction (where multiple children's radii recombine into the parent), and the weakest taper occurs in long internodes far from any branching.

A robust scheme:

1. Compute node radii via §4.
2. For each segment between parent node P and child node C, set radius along arc-length parameter t ∈ [0,1]:

```
   r(t) = r_P · (1 - t·(1 - r_C/r_P)) ^ taperPower
   taperPower ∈ [0.7, 1.3], default 1.0 (linear)
```

   `taperPower < 1` produces concave taper (most thinning happens near the parent — the "shoulder" look of mature oaks); `> 1` produces convex taper (twig-like).

3. **Junction blend**: at a node where a child departs, modulate the parent's radius locally upward by a small bulge to mimic the wood swell that occurs at branch insertions in real trees:

```
   r_blended(s) = r(t) · (1 + blendStrength · exp(-(s/blendLength)^2))
```

   where `s` is arc-length distance from the junction, `blendStrength` ∈ [0.05, 0.20], `blendLength` ∈ [0.3·r, 1.0·r]. Apply on **both sides** of the junction (both into the parent and into the child) to get a smooth fillet.

> **Engine note.** This blend, done correctly, eliminates the "bolted-on branch" artifact that plagued earlier ProVeg Studio iterations. Done incorrectly (too wide a blend on the trunk apex), it produces the inverse artifact: a "swollen" trunk just below the canopy. Limit `blendLength` to a small multiple of the *child* radius, never the parent.

---

## 6. Other allometric relationships worth encoding

Real trees obey statistical laws relating their dimensions. These are useful as *sanity checks* and as default parameter generators when only one quantity is known.

### 6.1 Height vs. diameter at breast height (DBH)

For a wide range of temperate species, height H and DBH d satisfy approximately:

```
H ≈ a · d^b,    with b ≈ 0.6–0.8
```

Examples (open-grown, mature):
- Oak (Q. robur): H ≈ 1.5 · d^0.65 (m, with d in cm)
- Pine (P. sylvestris): H ≈ 2.0 · d^0.70
- Eucalyptus regnans: H ≈ 3.5 · d^0.75 (one of the tallest growth allometries known)

Forest-grown trees of the same species are typically 30–50% **taller** at the same DBH than open-grown, because they extend rapidly to chase light and don't invest in radial growth.

### 6.2 Crown radius vs. DBH

```
R_crown ≈ c · d^0.7,   c ∈ [0.10, 0.25] m/cm^0.7
```

Open-grown trees: c near 0.25; forest trees: c near 0.10 (narrow crowns due to lateral light competition).

### 6.3 Crown depth vs. height

For excurrent trees: crown depth ≈ 0.4–0.6 × H.
For decurrent trees in the open: crown depth ≈ 0.6–0.8 × H.
For forest-grown trees: crown depth as little as 0.2 × H (high crown ratio is a hallmark of plantation-grown wood).

### 6.4 Total leaf area (Leaf Area Index, LAI)

Total one-sided leaf area per unit ground area projected by the crown:

| Tree type | Typical LAI |
|---|---|
| Boreal conifer (pine, spruce) | 4–8 |
| Temperate deciduous | 3–6 |
| Tropical evergreen | 5–10 |
| Mediterranean (sclerophyll) | 2–4 |
| Savanna | 1–3 |

LAI couples directly to foliage system (Vol. 06): given crown projected area and target LAI, the engine can compute the total leaf surface to instance.

---

## 7. Reaction wood and the eccentric pith

In response to long-term gravitational or wind stress, trees grow **reaction wood**:

- **Conifers**: *compression wood* on the **lower** side of leaning stems (denser, redder, weaker in tension).
- **Hardwoods**: *tension wood* on the **upper** side of leaning stems (fibrous, gelatinous fibers).

The cambium produces more wood on the reaction side, so the **pith** (geometric center of the original first-year shoot) is no longer at the center of cross-section: leaning trees have **eccentric pith**, with rings wider on the reaction side.

> **Engine implication (advanced).** When a branch leans significantly under gravity, its *future* radial growth should be biased to the upper (hardwood) or lower (conifer) side. This produces the visible "fattening" of the lower side of pine branches and the upper side of oak limbs that distinguishes real mature trees from generic ones. Implement as a per-segment radius asymmetry parameter in the cross-section ring generator.

---

## 8. Putting it together — the radius pipeline

A complete ProVeg Studio radius pipeline:

1. **Skeleton built** (Vol. 11, §SCA or §L-system).
2. **Pipe-model bottom-up pass** with per-species `pipeModelExponent` and `terminalRadius` (≈ 0.4 mm scaled to engine units).
3. **Per-segment continuous taper** with per-species `taperPower`.
4. **Junction blend** with `blendStrength`, `blendLength` clamped to child radius.
5. **Reaction-wood asymmetry** (optional, for old/leaning trees).
6. **Tube mesh generation** with per-vertex radius from the above.

This pipeline, executed correctly, yields trunks and branches whose taper *looks* right without any further tuning — because it is computing what real trees compute.
