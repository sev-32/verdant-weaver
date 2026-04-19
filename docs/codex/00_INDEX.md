# ARBOREAL CODEX — Master Index
**The Unified Encyclopedic Reference for ProVeg Studio's Tree Engine**

> A complete corpus synthesizing botanical science, computational botany, and the state of the art in procedural plant simulation. Every volume is written to be both a scientific reference and an implementation specification.

---

## Purpose

This codex exists so that any engineer, artist, or AI agent working on the tree generator can answer, from first principles:

1. **What is actually happening inside a real tree?** (biology, physics, ecology)
2. **How has that been modeled mathematically and computationally?** (the academic literature)
3. **How do leading systems implement it today?** (SpeedTree, The Grove, Houdini, Blender Sapling, Unreal PCG, etc.)
4. **How should *we* implement it in ProVeg Studio?** (concrete engine specification)

If you cannot answer those four questions for a given subsystem, the relevant volume is incomplete and should be expanded before code is written.

---

## Reading order

The volumes are ordered from **substrate → structure → behavior → species → simulation → engine**.
Read sequentially for the full mental model; jump in by topic when implementing.

| # | Volume | Domain | Status |
|---|---|---|---|
| 01 | [Botanical Foundations](./01_BOTANICAL_FOUNDATIONS.md) | Cells, tissues, meristems, hormones | ✅ |
| 02 | [Architectural Models](./02_ARCHITECTURAL_MODELS.md) | Hallé–Oldeman, Leeuwenberg, Rauh, Troll, etc. | ✅ |
| 03 | [Branching & Phyllotaxis](./03_BRANCHING_AND_PHYLLOTAXIS.md) | Apical dominance, golden angle, sylleptic vs proleptic | ✅ |
| 04 | [Pipe Model & Allometry](./04_PIPE_MODEL_AND_ALLOMETRY.md) | Da Vinci, Shinozaki, Murray, WBE scaling | ✅ |
| 05 | [Wood, Bark & Material](./05_WOOD_BARK_AND_MATERIAL.md) | Xylem rings, bark fissure topology, color spectra | ✅ |
| 06 | [Foliage & Phyllotaxy](./06_FOLIAGE_AND_PHYLLOTAXY.md) | Leaf morphology, clustering, LAI, seasonal color | ✅ |
| 07 | [Roots & Soil Interface](./07_ROOTS_AND_SOIL.md) | Buttress, taproot, lateral, mycorrhiza | ✅ |
| 08 | [Environmental Response](./08_ENVIRONMENTAL_RESPONSE.md) | Phototropism, gravitropism, wind reaction wood | ✅ |
| 09 | [Wind & Biomechanics](./09_WIND_AND_BIOMECHANICS.md) | Drag, sway modes, vertex shader strategies | ✅ |
| 10 | [Species Compendium](./10_SPECIES_COMPENDIUM.md) | 24 species: full quantitative profiles | ✅ |
| 11 | [Procedural Methods Survey](./11_PROCEDURAL_METHODS.md) | L-systems, SCA, Self-organizing, ML | ✅ |
| 12 | [State of the Art Tooling](./12_STATE_OF_THE_ART.md) | SpeedTree, The Grove, Houdini, Sapling, etc. | ✅ |
| 13 | [Engine Specification](./13_ENGINE_SPECIFICATION.md) | The ProVeg Studio target architecture | ✅ |
| 14 | [Failure Modes & QA](./14_FAILURE_MODES_AND_QA.md) | Catalog of artifacts, causes, fixes | ✅ |
| 15 | [Glossary & Symbols](./15_GLOSSARY.md) | Terminology, notation, units | ✅ |

---

## Cross-cutting principles

These are the meta-rules that survive across every volume. Violate one and the tree will look wrong even if every individual subsystem is "correct."

1. **A tree is not a graphic. It is the frozen record of a 30–300 year optimization process.** Its shape is the integral of light competition, gravity, wind, water, herbivory, and damage repair. Procedural systems that ignore *time* and *environment* produce shapes that read as plastic.

2. **The trunk is not a special primitive — it is the oldest branch.** The same growth rules that produce a twig produce the trunk; only the duration of growth differs. Any code path that treats the trunk as a separate entity will produce visible junction artifacts.

3. **Radius follows volume conservation, not aesthetics.** The Pipe Model (`r_parent² ≈ Σ r_child²`) is not a stylistic choice; it is an emergent consequence of vascular hydraulics and is the single biggest determinant of *believable* taper.

4. **Branching is a discrete-event process governed by hormones.** Auxin from the apex suppresses lateral buds; cytokinin from roots promotes them. The auxin-cytokinin gradient explains apical dominance, reiteration after damage, witch's brooms, and the difference between an oak and a pine. Sliders that don't map to this gradient will never feel right.

5. **Phyllotaxis is geometry, not randomness.** Leaf and branch placement around the stem follows the golden angle (137.508°) for >80% of dicots, or whorled patterns for many gymnosperms. Random angular placement is the single most common procedural failure mode.

6. **Foliage lives on wood, not in space.** Leaves cluster on the youngest 1–3 years of growth, which means on the *outer terminal nodes of the branch graph*. Foliage placed by world-space sampling will always look detached.

7. **Bark is age, not noise.** Bark fissure depth and pattern are functions of cumulative radial growth and species-specific cork cambium behavior. Procedural bark applied uniformly to all branches breaks the illusion immediately.

8. **Wind is a coupled oscillator, not a sine wave.** A real tree branches into ~5 mass scales (trunk, scaffold, secondary, twig, leaf), each with its own resonance frequency. Single-frequency sway looks animated; coupled sway looks alive.

9. **Species is a *vector* of dozens of correlated parameters, not a multiplier on a generic tree.** Oaks and pines differ in branching model, phyllotaxis, leaf type, bark cycle, root strategy, growth rate, mature height, crown shape, and reaction wood behavior. Treating species as a single slider is why most procedural trees feel generic.

10. **Validation is visual, multi-angle, and species-specific.** A tree that looks correct from one angle is not correct. Silhouette, junction, foliage clumping, and silhouette-against-sky all require independent assessment.

---

## How AI agents should use this corpus

When asked to modify or rebuild any tree subsystem:

1. **Read the relevant volume in full** before editing code. The volumes are dense but bounded.
2. **Quote the specific principle being implemented** in code comments (e.g. `// Pipe model: see codex/04 §3.2`).
3. **Update the codex if reality diverges** — this corpus is the single source of truth and must be kept honest.
4. **Use the Failure Modes catalog (Vol. 14) as a regression checklist** before declaring any change done.
