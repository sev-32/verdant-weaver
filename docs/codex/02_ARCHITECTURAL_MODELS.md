# Volume 02 — Architectural Models
**The Hallé–Oldeman–Tomlinson typology and why it matters for procedural trees.**

---

## 1. The discovery

In the 1970s, French botanists **Francis Hallé**, **Roelof Oldeman**, and **P. B. Tomlinson** surveyed thousands of tropical species and discovered that despite enormous diversity, all trees grow according to one of **23 inherited architectural models**. Each model is defined by a small set of binary or low-cardinality choices about how the meristems behave:

- Is growth **rhythmic** (in flushes) or **continuous**?
- Are branches **orthotropic** (vertical) or **plagiotropic** (horizontal)?
- Does the apex grow **monopodially** (one dominant axis) or **sympodially** (the apex aborts and a lateral takes over)?
- Are flowers **terminal** (ending the axis) or **lateral** (not interrupting growth)?
- Is branching **acrotonic** (strongest near the apex), **mesotonic** (middle), or **basitonic** (near the base)?

The **architectural model is genetic**. A free-grown oak in a meadow and an oak suppressed under canopy and an oak in a city street will all look different — but they will all be expressing **Rauh's model**. Architecture is the *species fingerprint*; the rest is environmental modulation (Vol. 08).

---

## 2. The 23 models — and the 6 that cover almost every temperate tree we care about

Ignoring tropical specialties, six models account for almost every species an end-user is likely to ask for. Implementing these six well, plus an "ad-hoc broadleaf" fallback, covers a startling fraction of real-world trees.

### 2.1 Rauh's Model — the "default" temperate tree
- **Trunk:** monopodial, orthotropic, rhythmic growth (annual flushes).
- **Branches:** identical to trunk in every respect except scale; branches branch the same way the trunk does.
- **Phyllotaxis:** spiral.
- **Flowers:** lateral (don't terminate the apex).
- **Examples:** **oak, ash, hickory, walnut, maple (most), beech, elm, plane, lime/linden**.
- **Procedural recipe:** unified recursive branching from a dominant trunk; same growth rules at every order; rhythmic node spacing; spiral phyllotaxis.

### 2.2 Massart's Model — the "flat-tier conifer"
- **Trunk:** monopodial, orthotropic, rhythmic.
- **Branches:** **plagiotropic** (horizontal), arranged in distinct **whorls** at each annual flush.
- **Phyllotaxis on trunk:** spiral; **branches within a whorl:** equally spaced.
- **Examples:** **fir, spruce, young pine, monkey puzzle, young larch**.
- **Procedural recipe:** trunk grows monopodially; at each annual node, spawn a whorl of N (typically 4–7) branches at fixed pitch angle; branches grow horizontally with their own monopodial subaxis.

### 2.3 Troll's Model — the "deliquescent broadleaf"
- All axes are **plagiotropic from the start**.
- The trunk is built **sympodially** by the successive bending-up of plagiotropic axes — what looks like a vertical trunk is actually a stack of segments each of which began life horizontal.
- Strong **acrotonic branching** at the bend points produces the wide, layered crowns of many tropical giants.
- **Examples:** elm to a partial degree, many tropical legumes, jacaranda, some maples in old age.
- **Procedural recipe:** trunk is built by chaining short orthotropic segments connected by reorientation events; branching concentrated near these reorientation points.

### 2.4 Leeuwenberg's Model — the "candelabra"
- All axes are **orthotropic and sympodial**: each axis grows for a while, terminates with a flower or aborts, and is replaced by 2–4 equivalent daughter axes from just below.
- Produces the iconic **forking, near-equal-Y** silhouette.
- **Examples:** **manzanita, dogwood (some), elder, frangipani, baobab in early form, some old apples**.
- **Procedural recipe:** at each terminal event, replace one apex with N equivalent apices at a wide angle (40–60° from each other); no monopolistic trunk.

### 2.5 Attims's Model — the "continuous monopodial"
- Trunk and branches grow **continuously** (no annual flushes), monopodially, orthotropic to plagiotropic depending on order.
- Spiral phyllotaxis, lateral flowers.
- **Examples:** many tropical evergreens; **eucalyptus** approximates this.
- **Procedural recipe:** uniform internode spacing, no whorls; very long apical dominance.

### 2.6 Mangenot's / Champagnat's Model — the "weeping"
- Axes grow orthotropically at first, then **arch over under their own weight** as they extend, becoming functionally plagiotropic.
- Strong gravity response after initial vigor.
- **Examples:** **weeping willow, weeping birch cultivars, weeping cherry, some old elms**.
- **Procedural recipe:** vigorous initial extension with low gravity weight, then a step-up of gravity response after a length threshold; tip recurves.

---

## 3. Reiteration — the second axis

Hallé and Oldeman's second great insight: every architectural model has a *complete* form (the genetic program) and a *partial* form that the tree produces under stress, damage, or aging. The partial form is called a **reiterated complex** — a smaller copy of the basic architecture grown out of an axillary or epicormic bud on an existing branch.

- A young oak in the open shows **clean Rauh** architecture.
- A 200-year-old oak is a **stack of reiterations**: each major scaffold is itself a Rauh-model tree, and the whole organism is a "tree of trees."
- Storm damage, fire, browsing, and senescence all trigger reiteration.

> **Engine implication.** A "mature tree" toggle should not just scale up. It should **graft a stochastic set of reiterations** onto the major scaffolds — small Rauh-trees emerging from old wood. This is the single most underused trick in procedural tree generation and the secret to convincing mature/ancient trees.

---

## 4. The architectural model parameter

In ProVeg Studio, every species preset must declare its architectural model. The model dictates the *structure* of the growth algorithm; the species parameters dictate its *quantities*. The mapping:

| Model | Trunk algorithm | Branch spawning | Default phyllotaxis | Reiteration probability |
|---|---|---|---|---|
| Rauh | Monopodial, rhythmic | Spiral on trunk; recursive same-rule | 137.508° | low–medium |
| Massart | Monopodial, rhythmic | Whorls of N at each annual node | trunk spiral; whorl equispaced | very low |
| Troll | Sympodial bent-up | Acrotonic at reorientation points | spiral | medium |
| Leeuwenberg | Sympodial Y-fork | N equivalent daughters at terminus | spiral on each axis | low |
| Attims | Monopodial, continuous | Spiral, uniform spacing | 137.508° | low |
| Champagnat | Monopodial then arching | Recursive same-rule + gravity step | 137.508° | medium–high |

A correct engine selects the **trunk algorithm** and **branch spawning rule** by architectural model, then parameterizes the rest by species. Mixing rules across models is the second most common procedural failure mode (after wrong phyllotaxis).

---

## 5. References for further depth

- Hallé, Oldeman & Tomlinson (1978), *Tropical Trees and Forests: An Architectural Analysis*. Springer. — The canonical text. Every figure is worth studying.
- Barthélémy & Caraglio (2007), "Plant architecture: a dynamic, multilevel and comprehensive approach to plant form, structure and ontogeny," *Annals of Botany* 99: 375–407. — Modern restatement with quantitative tools.
- Godin & Caraglio (1998), "A multiscale model of plant topological structures," *J. Theor. Biol.* 191. — The MTG (multiscale tree graph) formalism that underpins most academic plant simulators (AMAPstudio, OpenAlea).
