# Volume 01 — Botanical Foundations
**Cells, tissues, meristems, and the hormonal substrate of growth.**

---

## 1. Why this volume exists

Every visible feature of a tree — taper, branching angle, bark texture, leaf density, autumn color — is the macroscopic shadow of cellular and hormonal events. A procedural engine that does not encode at least a stylized version of this substrate will produce shapes that are *geometrically valid but biologically inert*. This volume defines the minimum biological vocabulary needed to make the rest of the codex (and the engine) coherent.

---

## 2. The four tissue systems

A tree is built from four tissue systems, each with a distinct procedural analogue.

| Tissue | Function | Procedural analogue |
|---|---|---|
| **Meristematic** (apical, lateral, intercalary) | Cell division; the *only* place new tissue is born | Growth nodes / SCA tip + cambial radius accretion |
| **Dermal** (epidermis → periderm → bark) | Boundary, gas exchange, defense | Bark shader + cracking displacement |
| **Vascular** (xylem + phloem) | Water up, sugar down | Pipe-model radius accumulation |
| **Ground** (parenchyma, collenchyma, sclerenchyma) | Storage, support | Implicit; reflected in wood density / shader |

### 2.1 Meristems — where shape is decided

There are two meristem populations that matter for shape:

- **Apical meristem (SAM)** — at the tip of every shoot. Each SAM is a small dome (~100 µm) of dividing cells that produces (a) new internodes that extend the shoot, and (b) **leaf primordia** in a phyllotactic pattern. SAMs are the *agents* in any agent-based growth model. Each SAM also leaves behind an **axillary meristem** in the axil of every leaf — a dormant SAM that may activate later as a side branch.
- **Lateral meristem (vascular cambium)** — a thin cylindrical sheet just under the bark of every stem and root. It produces xylem inward and phloem outward. This is the source of **secondary growth** (radial thickening). Without it, a tree would be a tall stick with twigs and no trunk.

> **Engine implication.** A correct generator has **two coupled time loops**: a *primary growth* loop (SAMs extend, branch, terminate) and a *secondary growth* loop (every existing stem thickens via the cambium). Most naive generators only do primary growth, which is why their trunks look like overgrown twigs.

### 2.2 The cork cambium and bark cycle

A second lateral meristem, the **cork cambium (phellogen)**, sits outside the vascular cambium and produces **cork (phellem)**. Cork is dead at maturity, hydrophobic, and inelastic. As the trunk thickens, the inelastic outer cork must split — and *the species-specific way it splits is what we recognize as bark texture*.

| Bark style | Mechanism | Examples |
|---|---|---|
| Smooth | Cork cambium is long-lived; expansion accommodated elastically | Beech, young birch |
| Plated/scaly | Cork cambium dies in patches; new patches form underneath, lifting plates | Pine, sycamore |
| Fissured/furrowed | Continuous cork; vertical splits dominate due to vertical fiber alignment | Oak, ash, elm |
| Papery/exfoliating | Cork forms in thin sheets; horizontal lenticels weaken between sheets | Birch, paperbark maple |
| Shaggy/stringy | Long fibers in cork resist transverse tearing | Shagbark hickory, redwood |

> **Engine implication.** Bark is **not** a single noise function. It is a species-tagged displacement+albedo system whose *fissure depth* must scale with the *cumulative radial growth at that point* — i.e. with the local age × growth rate. A young branch should have smooth bark even on an oak.

---

## 3. The hormonal substrate

Five hormone families control >90% of tree morphology. A procedural engine does not need to simulate them as molecules — but its parameters should *map cleanly* onto them, because every botanist and every artist already thinks in these terms.

### 3.1 Auxin (IAA)
Produced primarily in **apical meristems** and young leaves. Flows **basipetally** (downward) through the stem. Its dominant effects are:

- **Suppresses axillary bud outgrowth** below the apex → **apical dominance**.
- **Promotes vascular cambium activity** → drives radial growth.
- **Promotes adventitious root formation** at stem bases.
- **Mediates phototropism and gravitropism** by lateral redistribution.

### 3.2 Cytokinin
Produced primarily in **root tips**. Flows **acropetally** (upward) in the xylem. Antagonist to auxin at axillary buds: high cytokinin/auxin ratio releases buds.

> The **auxin:cytokinin ratio** at any given axillary bud determines whether it stays dormant, becomes a short shoot, or becomes a long shoot. This is the single most important control variable in tree shape and is the *biological referent* of any "branching probability" parameter.

### 3.3 Gibberellins (GA)
Promote **internode elongation**. High GA → long whippy shoots (juvenile growth, water sprouts). Low GA → short, stocky spurs (fruiting wood in apple, larch needle clusters).

### 3.4 Abscisic acid (ABA)
Stress and dormancy hormone. Triggers **bud set** in autumn, **stomatal closure** under drought, and **leaf abscission**.

### 3.5 Ethylene
Gaseous hormone produced under mechanical stress and during senescence. Causes **thigmomorphogenesis** — the shorter, thicker, more branched form of trees grown in windy sites compared to sheltered ones (a real, dramatic effect: trees in wind tunnels can be 30% shorter and 50% thicker at base than controls).

---

## 4. The Münch flow and why trunks taper

Sugar produced in leaves is loaded into phloem and flows by hydrostatic pressure (the **Münch pressure-flow hypothesis**) to sinks: roots, growing tips, and storage parenchyma. Water flows the opposite way through xylem under tension generated by leaf transpiration (the **cohesion–tension theory**).

Both flows are *volumetric*. The cross-sectional area of conducting tissue at any point on the trunk must therefore equal the sum of the conducting areas it supplies — which is precisely the **Pipe Model** (Vol. 04). Taper is not decoration; it is the geometric signature of conservation of flow.

---

## 5. Phenology — the annual clock

Temperate trees run on a yearly cycle that produces visible structure:

1. **Bud break** (spring): apical and axillary buds activate; rapid extension on stored carbon.
2. **Primary growth** (late spring–early summer): internodes elongate; leaves expand; new SAMs lay down next year's buds.
3. **Secondary growth** (summer): cambium produces *earlywood* (large vessels, low density) then *latewood* (small vessels, high density) → the **annual ring**.
4. **Bud set & lignification** (late summer): GA drops, ABA rises; tissues harden.
5. **Senescence** (autumn): chlorophyll catabolism reveals carotenoids (yellow) and anthocyanins (red); abscission layer forms at the petiole.
6. **Dormancy** (winter): metabolism near zero; chilling requirement accumulates to permit next year's bud break.

> **Engine implication.** A "season" parameter is not just a leaf-color LUT. It changes leaf presence, leaf color distribution, twig color (often redder in winter as anthocyanins persist in bark), and even silhouette (deciduous trees reveal their architecture only in winter — a major aesthetic axis).

---

## 6. Reiteration and damage

When an apex is damaged (browsing, frost, breakage), the auxin source disappears and dormant axillary buds below are released *simultaneously*. The tree **reiterates** — produces a partial copy of its juvenile architecture from the damage point. Reiteration is the source of:

- **Coppice growth** from cut stumps.
- **Epicormic shoots** ("water sprouts") on storm-damaged limbs.
- The lumpy, multi-stemmed form of old or browsed trees.
- The spectacular regrowth of pollarded plane and willow.

Reiteration is the single biggest reason that *real old trees do not look like scaled-up young trees*. An engine that wants believable mature trees must implement at least stylized reiteration: occasional release of a clump of vigorous shoots from a major branch, with their own subordinate branching.

---

## 7. Summary — the minimum biological model the engine must encode

| Principle | Engine parameter family |
|---|---|
| SAMs are agents that extend and branch | Skeleton growth loop |
| Cambium thickens every existing stem every year | Pipe-model radius accretion (Vol. 04) |
| Auxin:cytokinin ratio gates lateral budding | Apical dominance + branching probability per node |
| Phyllotaxis is geometric (golden angle / whorled) | Phyllotactic angle parameter (Vol. 03) |
| Cork-cambium dynamics produce species-specific bark | Bark style enum + age-driven displacement (Vol. 05) |
| Wind triggers thigmomorphogenesis | Long-term: shorter+thicker; short-term: sway (Vol. 09) |
| Reiteration explains old-tree complexity | Stochastic epicormic release on mature scaffolds |
| Phenology drives seasonal appearance | Season parameter affecting foliage + bark + twig color |

These nine items are the irreducible kernel. The rest of the codex elaborates each.
