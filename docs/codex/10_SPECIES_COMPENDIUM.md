# Volume 10 — Species Compendium
**Quantitative profiles for 24 species used as ProVeg Studio presets.**

> Each profile is a *parameter vector* across all relevant subsystems. Architectural model determines algorithm; the rest determines quantities. Units: meters unless noted. All parameters reference earlier volumes.

---

## Format

```
NAME (Latin) | Architectural model | Bark archetype | Root archetype
Mature dimensions: H × DBH × crown_R
Crown form: shape · density · LAI
Branching: angle · phyllotaxis · acrotony
Pipe model: exponent · taperPower
Foliage: leaf class · size · seasonal palette
Notes: distinctive cues + common errors
```

---

## TEMPERATE BROADLEAVES

### English Oak — *Quercus robur* | Rauh | Fissured | Plate
- Mature: 25 × 1.2 × 18 m. Crown: rounded decurrent · medium · LAI 4.5
- Branching: 50° (low scaffolds 70°+) · spiral 137.5° · acrotony 0.65
- Pipe: n=2.1 · taper 0.85 (concave shoulder)
- Foliage: simple lobed · 10×7 cm · summer #4f6b3a → autumn russet #7a4828 → brown
- **Distinctive**: massive low scaffolds, gnarled silhouette, deep vertical fissures developing after 30 years, 5–7 buttress flares. Mature trees show heavy reiteration; stag-headed when ancient.
- **Common error**: smooth bark on a 100-year-old; leaves too pointed (oak lobes are rounded — pin oak/red oak have pointed lobes, English oak does not).

### European Beech — *Fagus sylvatica* | Rauh | Smooth | Plate
- Mature: 30 × 1.0 × 15 m. Crown: oval-rounded · very dense · LAI 6
- Branching: 45° · distichous on horizontal limbs (planar layered look) · acrotony 0.7
- Pipe: n=2.0 · taper 1.0
- Foliage: simple ovate, wavy margin · 8×4 cm · spring lime → summer #3f6033 → autumn copper-bronze #8a4a1c (persists into winter on juveniles — *marcescence*)
- **Distinctive**: silver-smooth bark for life, *planar layering* of leaves on horizontal branches (light-gathering plates), elephant-foot buttress flares.

### Silver Birch — *Betula pendula* | Rauh + Champagnat | Papery/lenticular | Heart
- Mature: 20 × 0.4 × 8 m. Crown: open ovate, weeping tips · sparse · LAI 3
- Branching: 40° (drooping at tips) · spiral 137.5° · acrotony 0.75
- Pipe: n=1.9 · taper 1.1 (twiggy, not shouldered)
- Foliage: simple ovate-rhombic · 6×4 cm · summer #5c8a3d → autumn pure gold #d4b020
- **Distinctive**: white bark with horizontal black lenticel scars; secondary branches arch then weep at tips. Silhouette: filigree, transparent.
- Lifespan: short (60–90 years), so old gnarled birches are rare.

### Sugar Maple — *Acer saccharum* | Rauh | Plated (mature) | Plate
- Mature: 25 × 0.9 × 16 m. Crown: rounded oval · dense · LAI 5
- Branching: 50° · **decussate** (opposite pairs at 90°) · acrotony 0.7
- Pipe: n=2.0 · taper 0.95
- Foliage: simple palmate-lobed (5 lobes, smooth margin) · 12×12 cm · summer #3a6e2c → autumn brilliant orange-red gradient #d04020
- **Distinctive**: opposite branching produces visibly paired side shoots — never randomized. Famous fall color, but uneven across the crown (top reddens first).

### European Ash — *Fraxinus excelsior* | Rauh | Fissured | Heart
- Mature: 28 × 1.0 × 14 m. Crown: open ovate · medium · LAI 4
- Branching: 45° · **decussate**, leaves compound pinnate · acrotony 0.7
- Pipe: n=2.0 · taper 0.95
- Foliage: compound pinnate, 7–13 leaflets · whole leaf 25×12 cm · summer #4a6f33 → autumn pure yellow #d8b840
- **Distinctive**: opposite branching, jet-black buds in winter (a key ID feature), late to leaf out.

### Weeping Willow — *Salix babylonica* | Champagnat | Furrowed (deep) | Heart
- Mature: 15 × 0.8 × 12 m. Crown: dome with vertical curtain · medium · LAI 4.5
- Branching: 70° initially, gravity recurves to 110°+ · spiral · acrotony 0.5
- Pipe: n=1.85 · taper 1.2 (twiggy)
- Foliage: simple lanceolate · 12×1.5 cm · summer #6a8e3a → autumn dull yellow
- **Distinctive**: branches grow upward then arc dramatically downward to ground; long whippy twigs that visibly droop their full length.

### Lombardy Poplar — *Populus nigra 'Italica'* | Rauh + columnar | Fissured | Heart
- Mature: 30 × 0.6 × 3 m (columnar). Crown: tall cylinder · medium · LAI 4
- Branching: 15–20° (steeply ascending) · spiral · acrotony 0.6
- Pipe: n=2.0 · taper 1.0
- Foliage: simple deltoid · 7×7 cm · summer #5a8235 → autumn yellow
- **Distinctive**: extreme columnar form; useful test case for very narrow crown envelope.

### European Sycamore / Plane — *Platanus × acerifolia* | Rauh | Plated (exfoliating) | Plate
- Mature: 35 × 1.5 × 22 m. Crown: rounded broad · dense · LAI 5
- Branching: 55° · spiral · acrotony 0.7
- Pipe: n=2.1 · taper 0.9
- Foliage: simple palmate-lobed (3–5 lobes) · 18×18 cm · summer #4d703a → autumn dull yellow-brown
- **Distinctive**: mottled green-cream-tan-grey bark from plate shedding (one of the most recognizable barks in temperate cities).

### Horse Chestnut — *Aesculus hippocastanum* | Rauh | Plated | Plate
- Mature: 25 × 1.0 × 15 m. Crown: rounded dome · very dense · LAI 5.5
- Branching: 55° · **decussate** · acrotony 0.7
- Pipe: n=2.0 · taper 1.0
- Foliage: **compound palmate** (5–7 leaflets radiating) · whole leaf 30×30 cm · summer #3d6b2c → autumn dull yellow-brown
- **Distinctive**: massive palmate leaves, candle-like upright flower clusters (when in bloom), large sticky winter buds.

### Lime / Linden — *Tilia × europaea* | Rauh | Smooth-ish, ridged late | Heart
- Mature: 30 × 1.2 × 15 m. Crown: oval, often with **basal sprouts** (suckers) · dense · LAI 5
- Branching: 50° · **distichous** · acrotony 0.65
- Pipe: n=2.0 · taper 0.95
- Foliage: simple cordate (heart-shaped) · 10×8 cm · summer #4d7038 → autumn yellow
- **Distinctive**: characteristic mass of basal sprouts at the trunk base — a near-unique cue.

### Mountain Ash / Rowan — *Sorbus aucuparia* | Rauh | Smooth grey | Heart
- Mature: 12 × 0.4 × 6 m. Crown: open oval · medium · LAI 3.5
- Branching: 50° · spiral · acrotony 0.7
- Pipe: n=1.95 · taper 1.0
- Foliage: compound pinnate (9–17 leaflets) · whole leaf 20×10 cm · summer #4d6f30 → autumn red-orange
- **Distinctive**: bright red berry clusters in autumn (texture decal on terminal nodes); small graceful tree.

### Sweet Chestnut — *Castanea sativa* | Rauh | Fissured (spiral fissures!) | Plate
- Mature: 30 × 1.5 × 18 m. Crown: rounded broad · dense · LAI 5
- Branching: 50° · spiral · acrotony 0.7
- Pipe: n=2.1 · taper 0.85
- Foliage: simple lanceolate-serrate · 20×6 cm · summer #4d6e30 → autumn yellow-brown
- **Distinctive**: fissures **spiral around the trunk** in mature trees — a unique cue. Test case for axial-rotated bark UV.

---

## TEMPERATE CONIFERS

### Scots Pine — *Pinus sylvestris* | Massart (young) → Rauh-like decurrent (old) | Plated, orange-red upper / grey-brown lower | Tap
- Mature: 25 × 0.8 × 10 m. Crown: young conical, old flat-topped umbrella · medium · LAI 4
- Branching: whorls of 4–6 in young trees (every annual node); irregular in old trees · acrotony 0.95 (apical control collapses with age)
- Pipe: n=2.05 · taper 1.0
- Foliage: needle clusters of **2** (5–7 cm), persisting 3 years
- **Distinctive**: dramatic orange-red bark on upper trunk and branches, contrasting with grey-brown plates lower. Old trees develop the characteristic flat-topped form (apical control failure) — the signature silhouette of the Caledonian forest.

### Norway Spruce — *Picea abies* | Massart | Plated (small scales) | Heart
- Mature: 35 × 1.0 × 8 m. Crown: narrow conical, drooping branchlets · dense · LAI 7
- Branching: whorls of 5–7, plus inter-whorl branchlets · acrotony 0.85
- Pipe: n=2.1 · taper 0.9
- Foliage: single needles, 1.5 cm, around entire shoot, persisting 5–7 years
- **Distinctive**: drooping secondary branchlets give a "shaggy" appearance; deep dark green; conical to old age.

### Silver Fir — *Abies alba* | Massart | Smooth grey (young) → plated (old) | Heart
- Mature: 40 × 1.2 × 10 m. Crown: narrow conical, *flat plate* layered branches · dense · LAI 6
- Branching: regular whorls of 5–6 · acrotony 0.9
- Pipe: n=2.05 · taper 0.95
- Foliage: single needles **two-ranked** (in flat sprays), 2–3 cm, white stomatal stripes underneath
- **Distinctive**: flat horizontal sprays of foliage (vs spruce's all-around shoots); white bands under needles when seen from below.

### European Larch — *Larix decidua* | Massart | Plated (rough) | Heart
- Mature: 35 × 0.9 × 8 m. Crown: open conical, branches strongly horizontal · sparse · LAI 4
- Branching: whorls of 5–6, secondary branches plagiotropic · acrotony 0.85
- Pipe: n=2.0 · taper 1.0
- Foliage: needle clusters of 30–40 on dwarf shoots; **deciduous** — gold in autumn, leafless in winter
- **Distinctive**: *deciduous conifer* — exposes its conical skeleton in winter, glows gold in autumn. Strong horizontal layering of branches.

### Yew — *Taxus baccata* | Attims-like, very long-lived | Stringy/exfoliating reddish | Heart
- Mature: 15 × 1.5 × 12 m (slow growth, lives 1000+ years). Crown: dense rounded, often multi-stemmed · very dense · LAI 8
- Branching: irregular, no clear whorls in old trees · acrotony 0.5
- Pipe: n=2.2 · taper 0.85
- Foliage: single needles two-ranked, dark green; small red berry-like arils
- **Distinctive**: red-brown peeling bark, very dense crown, often multiple trunks (fluted), ancient gnarled appearance possible at 500+ years.

### Western Red Cedar — *Thuja plicata* | Attims | Stringy/fibrous reddish | Heart
- Mature: 50 × 2.0 × 15 m. Crown: narrow conical, strongly drooping leader · very dense · LAI 8
- Branching: dense, drooping branchlets in flat sprays
- Foliage: scale leaves in flat fans, sweet-resinous when crushed
- **Distinctive**: stringy bark, drooping leader and branch tips, flat scale-leaf sprays — needs a *scale shader* not a needle shader.

### Coast Redwood — *Sequoia sempervirens* | Massart (giant) | Stringy fibrous reddish (very thick) | Plate
- Mature: 90 × 4.0 × 20 m. Crown: narrow conical, often with multiple reiterated tops · LAI 8
- Branching: regular when young, irregular when ancient (multiple tops)
- Foliage: short two-ranked needles
- **Distinctive**: extreme height, very thick fibrous bark (up to 30 cm), multiple reiterated apices in old trees. Test case for extreme scale and reiteration.

---

## TROPICAL / SPECIALTY

### Eucalyptus — *Eucalyptus globulus* | Attims | Deciduous bark (sheds in strips) | Tap
- Mature: 50 × 1.5 × 18 m. Crown: open, gum-like · medium · LAI 5
- Branching: 45° · alternating decussate then spiral with age · acrotony 0.7
- Pipe: n=1.9 · taper 1.1 (long whippy)
- Foliage: simple lanceolate, glaucous (blue-green), pendant orientation
- **Distinctive**: bark sheds in long strips revealing smooth pale orange/cream underneath; juvenile leaves opposite and round, adult leaves alternate and lanceolate (a true ontogenetic shift).

### Acacia (Umbrella Thorn) — *Vachellia tortilis* | Troll/Leeuwenberg blend | Furrowed dark | Tap
- Mature: 12 × 0.5 × 10 m. Crown: extremely flat, broader than tall · sparse · LAI 2.5
- Branching: 80° (near-horizontal scaffolds spreading from a short trunk) · spiral · acrotony 0.5
- Pipe: n=2.0 · taper 1.0
- Foliage: compound bipinnate, very small leaflets · whole leaf small
- **Distinctive**: **flat-topped umbrella crown** — the iconic savanna silhouette. Crown flat from giraffe browsing + light competition.

### Baobab — *Adansonia digitata* | Leeuwenberg in old age | Smooth fibrous | massive Tap
- Mature: 20 × 4.0 × 15 m. Crown: stout candelabra of equally-thick scaffolds · very sparse (deciduous) · LAI 1
- Branching: equal-Y forks at terminus of each axis · acrotony 1.0
- Pipe: n=2.5 (heavy fluted trunk that stores water) · taper 0.6 (very gradual)
- Foliage: compound palmate, deciduous in dry season
- **Distinctive**: **massive bottle-shaped trunk**, equal-thickness candelabra branches, leafless most of the year ("upside-down tree"). Test case for extreme allometry.

### Olive — *Olea europaea* | Rauh with heavy reiteration | Furrowed gnarled | Heart
- Mature: 8 × 1.5 (often hollow) × 8 m. Crown: dense rounded · dense · LAI 5
- Branching: 50° · opposite (decussate) · acrotony 0.6
- Pipe: n=2.1 · taper 0.85
- Foliage: simple lanceolate, silvery-grey-green underside, evergreen
- **Distinctive**: heavily gnarled, often hollow trunk; multi-stemmed from old reiteration; silver-green flickering leaves. Living for 1000+ years.

---

## How to extend

To add a new species, populate the same fields and verify against:

1. **Silhouette photo** — does the crown match?
2. **Bark close-up** — does the archetype match?
3. **Leaf reference** — does the morphology class match?
4. **Pipe-model exponent** — does the trunk taper visually match a real photo?
5. **Phyllotaxis** — does branching feel spiral / opposite / whorled correctly?

A profile that fails any of these is incomplete. Don't ship presets that don't pass all five.
