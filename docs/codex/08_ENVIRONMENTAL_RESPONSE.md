# Volume 08 — Environmental Response
**Phototropism, gravitropism, thigmomorphogenesis, and the dialogue between gene and place.**

---

## 1. The dialectic

Architecture (Vol. 02) defines what a species *can* be. Environment defines what an individual *becomes*. The same architectural model run under different environments produces:

- An open-grown oak in a meadow: short trunk, wide rounded crown, scaffolds that begin near the ground.
- A forest oak: long clean trunk with no live branches for 10+ m, narrow crown only at the top.
- A windswept oak on a cliff: short, asymmetric, bent in the prevailing wind direction.
- An old pollarded oak: short bottle-shaped trunk topped by a candelabra of equal-sized reiterations.

Procedural trees that ignore environment produce shapes that read as "from a textbook" — geometrically perfect but contextually wrong. Implementing even a stylized version of the four major environmental responses is the difference between a botanical specimen and a tree that belongs in its scene.

---

## 2. Phototropism — growing toward light

### 2.1 Mechanism
Differential auxin transport on the shaded side of a stem causes asymmetric cell elongation: shaded cells grow faster, bending the stem toward the light. The Cholodny–Went hypothesis (1927) is still essentially correct.

### 2.2 Modeling
For each growing apex with growth direction **g**, define a local light vector **L** (sum of incident light directions weighted by intensity). At each step:

```
g_new = normalize(g + α · projectOntoTangentPlane(L, g))
```

where α ∈ [0, 0.5] is the species-specific *phototropic gain*. Strong phototropism: α = 0.4 (willow, birch, cottonwood). Weak: α = 0.05 (most pines, spruce, larch — they rely more on apical control than tropism).

Light direction can be:

- **Sun-only**: a single direction vector (cheap).
- **Sky + sun**: hemispheric integral, biased toward zenith (better for tree-in-environment).
- **Local crown competition**: subtract incident light blocked by other branches of the same tree (expensive but produces beautiful self-organizing crown shape).

### 2.3 The opposite — etiolation
In deep shade, GA increases dramatically and trees grow long, thin, weakly-branched whips searching for light. A **shade-grown** parameter mode should:

- Increase internode length 1.5–2.5×.
- Reduce branching probability per node by 50–80%.
- Reduce branch angle (steeper, more vertical).
- Reduce leaf size (and total leaf count) — counterintuitive but true; shade leaves are larger but **fewer per shoot**.

---

## 3. Gravitropism — growing relative to gravity

### 3.1 Two competing tropisms
- **Negative gravitropism** (orthogeotropism) — main shoots grow up, against gravity.
- **Positive gravitropism** — roots grow down, with gravity.
- **Plagiotropism** — many side branches grow approximately *perpendicular* to gravity (horizontal).
- **Geotropic compromise** — branches grow at a species-specific angle that is the equilibrium between phototropism (up) and plagiotropic gravity response (down toward horizontal).

### 3.2 Drooping under self-weight

As a branch extends, its own mass exerts a bending moment that exceeds the wood's stiffness, causing it to droop. The droop is computed as:

```
deflection(s) = (ρ · g · s^4) / (8 · E · I)
```

where s is distance from the support, ρ is linear density, E is Young's modulus, I is the second moment of area. For procedural purposes, use a simplified per-segment droop:

```
For each segment from tip back to base:
  cumulative_moment = Σ (mass_distal_to_segment · lever_arm)
  bend_angle = cumulative_moment / (segment_radius^4 · stiffnessConstant)
  rotate segment downward by bend_angle around horizontal axis perpendicular to current direction
```

This produces the characteristic **arching** of old branches that no SCA-only generator captures. Stiffness constant is species-specific:

| Species class | stiffness | result |
|---|---|---|
| Pine, spruce | 1.0 | minimal droop, branches stay near initial angle |
| Oak, beech | 0.7 | mature scaffolds visibly arch |
| Willow, birch | 0.4 | strong droop, characteristic weeping silhouette |
| Old, sun-damaged | 0.3 | dramatic recurving |

### 3.3 Gravimorphism over years

Branches that are loaded over years grow **reaction wood** (Vol. 04 §7) and harden. A snapshot of an old branch shows the *cumulative* result of years of loading. For procedural purposes, this means a mature tree's branches should show *more* droop than the same branches at a young age, even though the snapshot is static.

---

## 4. Thigmomorphogenesis — response to mechanical stress

Trees subjected to repeated mechanical perturbation (wind, brushing) grow:

- **Shorter** (sometimes 30% shorter than sheltered controls).
- **Thicker at base** (50% greater diameter at the same age).
- **More branched** (more lateral budding).
- With **denser, harder wood**.

This is not damage; it is an active response mediated by ethylene. The same species in a sheltered ravine and on an exposed ridge produces visually distinct phenotypes — the *krummholz* of mountain treelines is the extreme expression.

> **Engine implication.** A `windExposure` parameter [0, 1] should:
>
> - Reduce final height by `1 - 0.3·windExposure`.
> - Increase trunk taper (thicker base) by `1 + 0.5·windExposure`.
> - Increase branching frequency by `1 + 0.3·windExposure`.
> - In extreme cases (windExposure > 0.7), introduce **flag-form**: branches asymmetric, with much more growth on the leeward side (because windward branches are mechanically pruned by abrasion).

---

## 5. Edge effect and asymmetry

Trees on the edge of a stand or in a row receive light from one direction only. Result: dramatic crown asymmetry, with the crown extending into the lit side and almost no growth on the shaded (interior) side. This is the **edge tree** phenotype.

For asymmetric environmental modeling, expose **light direction bias** as a vector `L_bias` and compute crown growth probability per direction proportional to its alignment with `L_bias`. Asymmetric crowns are some of the most distinctive tree silhouettes in real environments and are extremely hard to fake by hand.

---

## 6. Damage history

Old trees carry the visible record of damage:

- **Broken crown leaders** (lightning, wind) → flat-topped or stag-headed silhouette.
- **Storm-broken scaffolds** → asymmetric crown with one obvious gap.
- **Browsed or coppiced base** → multi-stemmed or candelabra trunk.
- **Fire scars** → asymmetric trunk with one flat side, often hollow.
- **Branch self-pruning** → the lower half of the trunk has *no* branches (only short stubs or scars), with characteristic cone-shaped knot scars at intervals matching old whorls (visible in mature pines).

These are the single hardest features to procedurally generate and the ones that most reliably cross the uncanny-valley boundary into "this is a real tree." A complete engine should expose at least:

- `crownDamageProbability` (chance of removing the top N% of the leader, replacing with reiteration).
- `scaffoldDamageProbability` (chance of removing one Order-1 scaffold).
- `selfPruningHeight` (height below which branches are stripped, increasing with `forestDensity`).
- `knotScarDensity` (number of conical scars on lower trunk per meter).

---

## 7. The "context preset" abstraction

Rather than asking the user to tune dozens of parameters, ProVeg Studio should expose a **context** dropdown that bundles environmental modulations into recognizable scenarios:

| Context | Modifies |
|---|---|
| **Open meadow** | low wind, isotropic light, low forest density → wide rounded crown, branches low on trunk |
| **Forest interior** | high competition, vertical light bias, low wind → tall narrow crown, no low branches, long clean trunk |
| **Forest edge** | asymmetric light, moderate wind → asymmetric crown extended outward |
| **Windswept ridge** | extreme wind one direction, low light, cold → krummholz / flag form, short, gnarled |
| **Riverbank** | high water, low wind, edge effect → tall, often leaning over water, willow-style droop |
| **Urban street** | one-sided light (street side), root constraint, pollution stress → thin asymmetric crown, often pollarded form |
| **Old growth ancient** | accumulated reiteration, broken crown, surface roots → stag-headed multi-stemmed character |

Each context applies offsets to the species's base parameters. The user picks `species + context + age`, and gets a tree that belongs in a specific kind of place. This is dramatically more powerful than slider tuning for most users.
