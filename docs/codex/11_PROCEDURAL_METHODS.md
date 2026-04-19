# Volume 11 — Procedural Methods Survey
**Every major algorithmic family for generating trees, with strengths, weaknesses, and verdict.**

---

## 1. The five families

| Family | Granularity | Botanical fidelity | Cost | Best for |
|---|---|---|---|---|
| **Recursive parametric** (Honda, Aono–Kunii) | Whole branches | Low–medium | Very low | Stylized fast generation |
| **L-systems** (Lindenmayer) | Per-symbol grammar | Medium–high | Low | Architectural models, language |
| **Space colonization** (Runions) | Per-tip stochastic | Medium-high | Medium | Crown-envelope-driven trees |
| **Self-organizing** (Palubicki et al.) | Coupled environment | Very high | High | Forest ecosystems, time evolution |
| **ML / data-driven** (recent) | Learned from scans | Variable | Very high training, low inference | Match a specific reference tree |

Each is examined below with its mathematics, characteristic look, and where it shines or fails.

---

## 2. Recursive parametric — the original

**Reference**: Honda (1971), "Description of the form of trees by the parameters of the tree-like body," *J. Theor. Biol.* 31. Aono & Kunii (1984), "Botanical tree image generation," *IEEE CG&A*.

**Idea**: A trunk of length L₀ branches into 2 children at angles (θ₁, θ₂) with lengths (r₁·L₀, r₂·L₀). Each child branches recursively with the same rules until length drops below threshold.

**Strengths**: trivial to implement; deterministic from a few parameters; fast.

**Weaknesses**: produces obviously fake "fractal" trees because every branch obeys identical rules at every depth. Real trees have order-dependent behavior (acrotony, pipe model, foliage at terminals only). No phyllotaxis. No environmental response.

**Verdict**: useful as a teaching tool, but no modern engine should ship pure Honda-style generation as its default.

---

## 3. L-systems — the symbolic approach

**Reference**: Lindenmayer (1968), originally for algae growth. Extended to plants by Prusinkiewicz: *The Algorithmic Beauty of Plants* (1990) is the canonical text and a free PDF.

**Idea**: A tree is a string of symbols (e.g. `F[+F][-F]F`). Production rules rewrite each symbol in parallel each iteration. After N iterations, interpret the string as a turtle-graphics drawing program.

**Variants**:

- **Deterministic L-system (D0L)**: one rule per symbol.
- **Stochastic L-system**: rules selected probabilistically.
- **Parametric L-system**: symbols carry parameters; rules use guards.
- **Environmentally-sensitive L-system**: rules query an external environment (light, gravity, neighbor density).

**Strengths**: extremely expressive; the natural language for encoding architectural models (Vol. 02); can produce all 23 Hallé–Oldeman models with appropriate rules; easy to parameterize for species.

**Weaknesses**: writing rules that produce *good-looking* trees is an art; rules tend to produce repetitive geometry without careful stochasticity; environmental response is bolted on awkwardly.

**Where it lives**: most academic plant simulators (AMAPstudio, OpenAlea/L-Py, GroIMP). Blender's *Sapling Tree Gen* is essentially a parameterized L-system. SpeedTree's older versions used a procedural L-system internally.

---

## 4. Space colonization (SCA) — the modern default

**Reference**: Runions, Lane & Prusinkiewicz (2007), "Modeling trees with a space colonization algorithm," *Eurographics Workshop on Natural Phenomena*. Itself based on Runions et al. (2005) for leaf venation.

**Idea**:

1. Define a target volume (the **crown envelope**) and sample N **attractor points** inside it.
2. Place an initial **tree node** at the base.
3. Each step:
   - For each attractor a, find the nearest tree node within a *perception radius* d_p; mark a as influencing that node.
   - For each tree node with ≥1 influencing attractor, compute the average direction toward those attractors, normalize, optionally add tropism vectors (gravity, light), and grow a new node in that direction at fixed step length.
   - Remove attractors within a *kill radius* d_k of any tree node.
4. Repeat until no more growth occurs or N iterations reach.

**Strengths**: produces beautifully organic crown shapes that fill the envelope without obvious symmetry; **much** more believable than recursive parametric for crown-level structure; handles asymmetric and complex envelopes naturally.

**Weaknesses**: naive implementation produces "spear" branches that race straight to the densest attractor cluster; trunk can wander unpredictably; produces a flat hierarchy (lots of small branches off main trunks, not enough mid-level structure). Parameter tuning is non-obvious. No native concept of phyllotaxis or species.

**Mitigations** (and what ProVeg Studio implements):

- **Phased growth**: trunk grows by deterministic monopodial rule first; SCA only refines branch tips after trunk is in place.
- **Forced acrotony**: only spawn branch axes from the upper portion of each parent, using phyllotactic angles.
- **Pipe-model post-pass** (Vol. 04) for radii — SCA gives skeleton, pipe model gives radii.
- **Junction blending** (Vol. 04 §5) for smooth attachments.

**Verdict**: SCA + phased deterministic trunk + pipe-model + phyllotactic constraints is the current best general-purpose engine. This is the architecture chosen for ProVeg Studio.

---

## 5. Self-organizing trees — the gold standard for accuracy

**Reference**: Palubicki, Horel, Longay, Runions, Lane, Měch & Prusinkiewicz (2009), "Self-organizing tree models for image synthesis," *ACM TOG / SIGGRAPH*.

**Idea**: An extension of SCA in which:

- The tree grows year by year.
- Each bud has a *vigor* computed as the local light it receives from a hemispheric sky model (with shadowing by other tree elements).
- Vigor allocates incrementally to buds via a **BH model** (basipetal flow with extended Borchert–Honda partitioning).
- Buds with sufficient vigor extend; insufficient ones become latent or shed.
- Branches that fall below a vigor threshold *die* and shed.
- The result self-organizes into believable crown architecture *over years*.

**Strengths**: produces the most botanically convincing trees in academic literature, especially for mature/old phenotypes. Handles competition, self-shading, branch shedding, reiteration naturally. Can simulate forest ecosystems (every tree affects every other tree's light).

**Weaknesses**: orders of magnitude more expensive than SCA; difficult to tune for a specific desired silhouette; primarily a research tool. Good Palubicki implementations exist but are not real-time interactive for tree authoring.

**Verdict**: aspirational ceiling. If ProVeg Studio ever adds an "evolve over years" mode (with a play button to age the tree), this is the algorithm.

---

## 6. ML / data-driven approaches

Recent (2020+) work uses neural networks trained on LiDAR scans of real trees to generate or complete tree geometry. Notable examples:

- **TreePartNet** (Liu et al. 2021): segments scanned tree point clouds into branches, useful for converting scans to procedural-friendly representations.
- **DeepTree** (Lee et al. 2023): generates branching topology with a graph neural network conditioned on a target silhouette.
- **NeRF-based reconstruction** (multiple): high-fidelity novel-view synthesis of specific scanned trees, but hard to *generate* new trees.

**Strengths**: can match the look of a specific real tree to a degree procedural rules cannot.

**Weaknesses**: requires large training data (tree scans are expensive); hard to control parametrically; black-box; doesn't generalize well across species.

**Verdict**: not yet a replacement for procedural methods, but increasingly useful as a *post-processing augmentation* — e.g. predict bark detail or twig clusters from coarse skeleton.

---

## 7. Hybrid architectures (the practical winners)

Every mature production system mixes families. SpeedTree's modern pipeline, for example:

1. L-system-style hand-authored or template generators define the base architecture.
2. Force-field / volumetric envelopes shape the crown.
3. SCA-like local growth fills detail.
4. Pipe model assigns radii.
5. Procedural meshing and bark UV generation.
6. Wind shaders and LOD generation as separate post-passes.

**ProVeg Studio's chosen stack** (matching this practice):

| Stage | Method |
|---|---|
| Architectural model selection | Per-species enum (Vol. 02) |
| Trunk path | Phased deterministic monopodial / sympodial / weeping (Vol. 11 §4 mitigation) |
| Scaffold spawning | Phyllotactic placement on trunk, with whorls for Massart species |
| Sub-branch growth | SCA refining within the crown envelope, constrained by phyllotaxis on each parent |
| Forced hierarchy | Periodic sub-axis spawn every 2–6 SCA steps, ensuring orders 1→4 |
| Radius assignment | Pipe model with per-species exponent + per-segment continuous taper + junction blend |
| Foliage | Tufts anchored to terminal nodes (Vol. 06) |
| Bark | Per-species archetype shader, age-modulated (Vol. 05) |
| Wind | Four-frequency vertex shader (Vol. 09) |
| Roots | Per-species archetype with phyllotactic flares (Vol. 07) |
| Aging / damage | Stochastic crown damage + reiteration on mature presets (Vol. 02 §3) |

This is the *target architecture*. Vol. 13 makes it concrete in code-level specification.

---

## 8. Recommended reading

| Tier | Read |
|---|---|
| Essential | Prusinkiewicz & Lindenmayer, *The Algorithmic Beauty of Plants* (free PDF online) |
| Essential | Runions et al. 2007 (SCA paper) |
| Essential | Hallé, Oldeman & Tomlinson 1978 (architectural models) |
| Highly recommended | Palubicki et al. 2009 (self-organizing trees) |
| Highly recommended | Shinozaki et al. 1964 (pipe model) |
| Background | West, Brown & Enquist 1997, 1999 (allometric scaling) |
| Background | Sone et al. 2009 (real-tree pipe model exponents) |
| For implementers | Weber & Penn 1995, "Creation and rendering of realistic trees," *SIGGRAPH* (the basis of Blender's Sapling) |
