// Interactive Matrix Optimizer: content and model from velcorisindustries.com/applications.
// Labels, windows, ranges, dispersion methods and mechanism texts are the original's.
// Curves are calibrated to the original's documented peak/end values (illustrative model):
// each output rises to its peak just past the optimal window, then eases to its end value
// at maximum loading (agglomeration).

export const OPTIMIZER_INTRO = {
  eyebrow: 'Formulation & kinetics',
  title: 'Interactive Matrix Optimizer.',
  body: 'Graphene reinforcement operates within a sensitive percolation window. Adjust host matrix parameters below to model mechanical, thermal, and barrier property gains in real time.',
}

export const PROPERTIES = ['Mechanical', 'Thermal', 'Functional']

export const MATRICES = [
  {
    id: 'cement',
    name: 'Portland Cement & Concrete',
    note: 'Porous crystalline matrix vulnerable to micro-crack propagation, water ingress, and freeze-thaw spalling.',
    dispersion: 'Aqueous pre-dispersion with polycarboxylate ether',
    min: 0.01, max: 0.3, step: 0.01, start: 0.06, window: [0.03, 0.08],
    outputs: [
      { label: 'Compressive strength', peak: 44, end: 39, unit: '%', sign: '+' },
      { label: 'Thermal dissipation', peak: 110, end: 102, unit: '%', sign: '+' },
      { label: 'Water pen. reduction', peak: 198, end: 182, unit: '%', sign: '' },
    ],
    mechanisms: [
      ['Compressive & Flexural Strength', 'Graphene nanosheets act as 2D crystal nucleation nodes, accelerating C-S-H gel crystallization and arresting micro-cracks before they propagate.'],
      ['Thermal Dissipation & Freeze-Thaw', 'Continuous phonon pathways dissipate localized freeze-thaw thermal gradients, preventing surface scaling and internal micro-fractures.'],
      ['Water & Chloride Impermeability', 'Impermeable graphene platelets physically bridge and seal capillary channels, blocking water penetration and chloride ingress by 200%.'],
    ],
  },
  {
    id: 'epoxy',
    name: 'Epoxy Resin & Protective Coatings',
    note: 'Thermoset polymer binder requiring high-shear interfacial bonding, anti-corrosion barrier, and thermal highways.',
    dispersion: 'High-shear mixing / polar solvent pre-mix',
    min: 0.01, max: 0.6, step: 0.01, start: 0.18, window: [0.1, 0.25],
    outputs: [
      { label: 'Tensile strength', peak: 58, end: 46, unit: '%', sign: '+' },
      { label: 'Thermal conduction', peak: 353, end: 353, unit: '%', sign: '+', rising: true },
      { label: 'Electrical / barrier gain', peak: 527, end: 527, unit: '%', sign: '', rising: true },
    ],
    mechanisms: [
      ['Tensile & Lap Shear Adhesion', 'High aspect-ratio graphene interlocking transfers mechanical shear stresses across crosslinked polymer chains, halting micro-delamination.'],
      ['Thermal Interface & Heat Spread', 'Higher graphene loadings form continuous ballistic phonon highways through the insulating resin, delivering 20× thermal conductivity.'],
      ['Anti-Corrosion Tortuous Barrier', 'Overlapping graphene flakes create an impenetrable physical labyrinth that blocks moisture and corrosive salt ions (>3,000 hrs ASTM B117).'],
    ],
  },
  {
    id: 'rubber',
    name: 'Elastomers, Rubber & Tyres',
    note: 'Vulcanized rubber compounds requiring rolling resistance reduction without sacrificing wet grip or tear strength.',
    dispersion: 'Internal Banbury mixer / two-roll open mill',
    min: 0.01, max: 1, step: 0.01, start: 0.35, window: [0.2, 0.5],
    outputs: [
      { label: 'Impact toughness', peak: 87, end: 67, unit: '%', sign: '+' },
      { label: 'Rolling res. reduction', peak: 18, end: 15, unit: '%', sign: '+' },
      { label: 'Abrasion loss reduction', peak: 35, end: 30, unit: '%', sign: '' },
    ],
    mechanisms: [
      ['Impact Toughness & Tear Resistance', 'Exfoliated graphene intercalates into the vulcanized polymer network, arresting micro-tears and diffusing heavy impact shockwaves.'],
      ['Hysteresis & Rolling Resistance', 'Internal phonon conduction prevents dynamic heat buildup in tyre treads, reducing hysteretic energy loss (rolling resistance) by 18%.'],
      ['DIN 53516 Abrasion Wear Life', 'Surface graphene sheets create a low-friction, self-lubricating tribofilm that shields the bulk rubber against abrasive drum wear.'],
    ],
  },
  {
    id: 'battery',
    name: 'Silicon-Graphene Battery Slurry',
    note: 'High-capacity anode slurry requiring continuous electron conduction and silicon volume expansion buffering.',
    dispersion: 'Planetary vacuum slurry mixer with conductive binder',
    min: 0.01, max: 1.8, step: 0.01, start: 0.75, window: [0.5, 1.0],
    outputs: [
      { label: 'Energy density gain', peak: 27.6, end: 19, unit: '%', sign: '+', decimals: 1 },
      { label: 'Cycle life retention', peak: 500, end: 378, unit: ' cycles', sign: '+' },
      { label: 'Charging speed multiplier', peak: 5, end: 4.2, unit: '×', sign: '', decimals: 1 },
    ],
    mechanisms: [
      ['Energy Density & Reversible Capacity', 'Flexible graphene sheets wrap silicon nanoparticles in a conductive cage, accommodating 300% volume expansion (>1,200 mAh/g).'],
      ['Cycle Life & Structural Retention', 'Maintains uninterrupted electrical contact and mechanical adhesion across 500+ deep lithiation breathing cycles.'],
      ['5× Ultra-Fast Charging Multiplier', 'Forms an ultra-dense three-dimensional electron highway throughout the anode, eliminating internal cell resistance during high-C charging.'],
    ],
  },
]

/** Model value of one output at loading x. */
export function modelValue(m, o, x) {
  const P = o.rising ? m.max : Math.min(m.max, m.window[1] * 1.25)
  if (x <= P) {
    const k = 4
    return (o.peak * (1 - Math.exp((-k * x) / P))) / (1 - Math.exp(-k))
  }
  const t = (x - P) / (m.max - P)
  return o.peak + (o.end - o.peak) * t
}

export const PATHWAY = {
  eyebrow: 'Commercial integration pathway',
  title: 'From evaluation to plant-scale production.',
  body: 'A structured, auditable pathway for incorporating high-grade graphene into your commercial manufacturing line.',
  steps: [
    {
      title: 'Source & Evaluate',
      text: 'High-purity graphene with certified laser Raman & XRD characterization per batch. Request evaluation samples for initial bench testing in your host resins or slurries.',
      tags: ['Sample evaluation kits', 'COA per batch', 'Full technical datasheet'],
    },
    {
      title: 'Formulate & Optimize',
      text: 'Our materials team collaborates with your process engineers to establish optimal loading percentages, dispersion protocols, and shear mixing parameters for target property gains.',
      tags: ['Percolation tuning', 'Shear protocol calibration', 'ASTM property validation'],
    },
    {
      title: 'Scale & Deploy',
      text: 'Transition smoothly from validated lab batches to commercial-scale supply. Domestic production in Greater Noida eliminates Chinese import delays, tariff risks, and volatile lead times.',
      tags: ['Consistent grading', 'Domestic sovereign supply', 'Commercial volume pricing'],
    },
  ],
}

export const APPS_CTA = {
  eyebrow: 'Partner with Velcoris',
  first: 'Your industry.',
  second: 'Our nanomaterials.',
  body: 'Connect with our materials engineering team to explore how certified Few-Layer Graphene or Graphene Oxide can elevate your specific formulation, coating, or polymer compound.',
}
