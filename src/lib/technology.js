// Technology page copy, taken verbatim from velcorisindustries.com/technology (14 Nov 2026).

export const TECH_HERO = {
  eyebrow: 'The carbon conversion platform',
  first: 'Engineered for scale, purity,',
  second: 'and zero-effluent synthesis.',
  body: 'Achieving the theoretical limits of 2D carbon nanomaterials in the lab is established science; the challenge is commercial reproducibility. Our in-house reactor platform converts carbon precursors into industrial-grade Few-Layer Graphene (FLG) and Graphene Oxide (GO) through a closed-loop, reusable cartridge process.',
}

export const TECH_STATS = [
  { value: '> 99.0 wt%', label: 'Carbon purity', note: 'Organics & ash free' },
  { value: '2 – 6 Layers', label: 'Thickness profile', note: '1.2 – 3.0 nm cross-section' },
  { value: 'Zero', label: 'Liquid effluent stream', note: '100% closed-loop synthesis' },
  { value: 'Raman & XRD', label: 'Batch quality gate', note: 'Audited per shipment COA' },
]

export const PROCESS_INTRO = {
  eyebrow: 'Manufacturing architecture',
  title: 'How our process works.',
  body: 'A simplified look at our carbon conversion platform. We guide carbon precursor materials through a 6-stage closed-loop sequence, refining raw inputs into certified two-dimensional structures.',
  note: 'This is a simplified overview for general understanding. Detailed reactor engineering and process specifications remain proprietary and patent-pending.',
}

export const STAGES = [
  {
    id: 'feedstock',
    stage: 'Raw baseline',
    title: 'Feedstock Input',
    subtitle: 'Precursor Baseline',
    body: 'Our synthesis begins with precisely calibrated carbonaceous compound precursor materials. We enforce strict structural and purity baselines prior to thermal loading, eliminating sulfur, heavy metals, and moisture before any conversion occurs.',
    input: 'Solid carbonaceous compound precursor',
    qa: 'Trace elemental screening & organics assay',
    mechanism: 'Calibrated stoichiometry & elemental baseline verification',
  },
  {
    id: 'cartridge',
    stage: 'Modular loading',
    title: 'Process Cartridge Integration',
    subtitle: 'Modular Loading Unit',
    body: 'Precursor materials are loaded into custom, reusable process cartridges designed for rapid reloading and uncompromised batch-to-batch consistency. The cartridge establishes an isolated, controlled thermal boundary condition.',
    input: 'Pre-loaded modular process cartridge',
    qa: 'Chamber seal integrity & loading density calibration',
    mechanism: 'Fast-reload sealed chamber with uniform thermal dissipation',
  },
  {
    id: 'reactor',
    stage: 'Core synthesis',
    title: 'Core Reactor Stage',
    subtitle: 'Proprietary Conversion',
    body: 'At the heart of the platform lies our proprietary, patent-pending reactor system. Engineered in-house, it dictates the exact thermodynamic temperature and pressure profile required to drive the carbon conversion process with zero liquid effluent.',
    input: 'Thermally energized reaction zone',
    qa: 'In-line thermal profile telemetry & energy recovery monitoring',
    mechanism: 'Direct thermodynamic conversion & dynamic pressure modulation',
  },
  {
    id: 'collection',
    stage: 'Extraction',
    title: 'Output Collection',
    subtitle: 'Closed-Loop Harvesting',
    body: 'Following synthesis, the converted carbon material is harvested directly from the reactor stage in a closed-loop sequence. This controlled extraction isolates the material from ambient atmosphere, preserving nascent crystal lattices.',
    input: 'Raw synthesized nanomaterial yield',
    qa: 'Atmospheric isolation verification & yield mass balance',
    mechanism: 'Closed-loop environmental isolation & extraction stream',
  },
  {
    id: 'refinement',
    stage: 'Refinement',
    title: 'Purification & Refinement',
    subtitle: 'Structural Classification',
    body: 'The harvested carbon material undergoes mechanical and acoustic classification. Oversized fragments and unconverted precursors are systematically separated, refining the yield to isolate target two-dimensional nanomaterial flakes.',
    input: 'Unrefined carbon nanomaterial mix',
    qa: 'D50 lateral size validation (5 – 15 µm target)',
    mechanism: 'Multi-stage fragment separation & lateral size classification',
  },
  {
    id: 'verification',
    stage: 'Certified output',
    title: 'Target Output Verification',
    subtitle: 'Batch Certification',
    body: 'The purified yield—differentiated into Few-Layer Graphene (FLG) and Graphene Oxide (GO)—is cataloged and certified. Automated laser Raman spectroscopy and XRD confirm layer counts, low defect ratios, and batch uniformity before packaging.',
    input: 'Isolated FLG and GO output batches',
    qa: 'Laser Raman (ID/IG < 0.1), XRD d₀₀₂, & Batch COA generation',
    mechanism: 'Dual-stream isolation & packaging in protective atmosphere',
  },
]

export const COMPARISON = {
  eyebrow: 'Process economics & integrity',
  title: 'Direct synthesis vs. legacy chemical methods.',
  body: 'Conventional graphene manufacturing has relied on 60-year-old chemical oxidation routes (Hummer’s Method) that require metric tonnes of hazardous acids and produce heavy structural defects. We engineered our closed-loop reactor platform to eliminate liquid effluent while preserving pristine carbon bonds.',
  legacy: {
    label: 'Legacy chemical (Hummer’s Method)',
    title: 'High Effluent, High Defect Density',
    points: [
      ['Hazardous Acid Runoff', 'Generates metric tonnes of toxic sulfuric acid (H₂SO₄) and permanganate (KMnO₄) wastewater per kilogram of yield.'],
      ['Permanent Lattice Damage', 'Harsh acid oxidation breaks basal planes, causing irreversible structural defects (ID/IG > 0.8) even after reduction.'],
      ['Multi-Day Production Cycles', 'Requires slow oxidation, hazardous exothermic dilution, and exhaustive repetitive water washing.'],
      ['Batch Inconsistency', 'High batch-to-batch variation driven by exothermic heat spikes and variable oxidation degrees.'],
    ],
    footer: ['Standard 1958 chemical exfoliation baseline'],
  },
  velcoris: {
    label: 'Velcoris platform',
    title: 'Direct Conversion, Zero Liquid Effluent',
    points: [
      ['Zero Liquid Effluent', '100% dry thermodynamic conversion with closed-loop heat recovery and zero toxic chemical runoff.'],
      ['Intact sp² Carbon Lattice', 'Direct synthesis preserves pristine conjugated carbon bonds, yielding low defect density (ID/IG < 0.1).'],
      ['Rapid Cartridge Turnover', 'Modular reusable cartridges enable fast reloading and continuous batch synthesis at industrial scale.'],
      ['Automated In-line QA', 'Real-time laser Raman and XRD monitoring calibrate every production batch against certified COA standards.'],
    ],
    footer: ['Patent-Pending In-House R&D', 'Greater Noida Facility'],
  },
}

export const DATASHEET = {
  eyebrow: 'Datasheet overview',
  title: 'Technical specifications.',
  body: 'Explore the chemical, physical, electrical, and dispersion profiles of our high-purity graphene outputs.',
  products: [
    {
      id: 'flg',
      name: 'Few-Layer Graphene (FLG)',
      categories: [
        {
          id: 'purity', label: 'Purity & Composition', title: 'Chemical & Elemental Profile',
          specs: [
            ['Carbon purity', '> 99.0 wt% (organics free)'],
            ['Ash content', '< 0.5 wt% (combustion basis)'],
            ['Moisture content', '< 0.8 wt%'],
            ['Oxygen content', '< 1.0 wt% (low functionalization)'],
            ['Sulfur & nitrogen traces', 'Not detectable (zero traces)'],
          ],
        },
        {
          id: 'physical', label: 'Physical Dimensions', title: 'Morphology & Structure',
          specs: [
            ['Average thickness', '1.2 – 3.0 nm (2–6 atomic layers)'],
            ['Lateral dimension (D50)', '5 – 15 µm (flake size)'],
            ['Specific surface area (BET)', '150 – 250 m²/g (nitrogen adsorption)'],
            ['Bulk density', '0.02 – 0.05 g/cm³'],
            ['Crystalline order', 'High order (XRD verified, d₀₀₂ ≈ 0.34 nm)'],
          ],
        },
        {
          id: 'transport', label: 'Transport Properties', title: 'Electrical & Thermal Conductance',
          specs: [
            ['Powder resistivity', '< 0.15 Ω·cm (at 2.0 MPa compaction)'],
            ['Bulk electrical conductivity', '> 8,000 S/m (compacted sheets)'],
            ['Thermal conductivity', '> 3,000 W/mK (theoretical basal layer)'],
            ['Specific heat capacity', '0.7 – 0.9 J/g·K'],
          ],
        },
        {
          id: 'dispersion', label: 'Dispersion Profile', title: 'Solvent & Matrix Compatibility',
          specs: [
            ['Polar organic solvents', 'High compatibility with NMP, DMF, IPA'],
            ['Thermoset & polymer resins', 'Epoxy, Polyurethane, Silicone, Vinylester'],
            ['Thermoplastic compounding', 'Direct melt-compounding with PA6, PP, HDPE'],
            ['Recommended mixing method', 'High-shear mixing (3,000–6,000 RPM) or ultrasonication'],
          ],
        },
      ],
    },
    {
      id: 'go',
      name: 'Graphene Oxide (GO)',
      categories: [
        {
          id: 'functionalization', label: 'Functionalization', title: 'Chemical & Functional Profile',
          specs: [
            ['Carbon content', '46.0 – 52.0 wt%'],
            ['Oxygen content', '42.0 – 48.0 wt%'],
            ['C:O atomic ratio', '2.0 – 2.5'],
            ['Surface functional groups', 'Carboxyl (-COOH), Hydroxyl (-OH), Epoxy (-C-O-C-)'],
            ['Trace inorganics', '< 0.5 wt%'],
          ],
        },
        {
          id: 'sheet', label: 'Sheet Dimensions', title: 'Morphology & Exfoliation Profile',
          specs: [
            ['Sheet thickness', '0.8 – 1.6 nm (predominantly monolayer)'],
            ['Lateral flake dimension (D50)', '5 – 20 µm'],
            ['Interlayer spacing (XRD)', '0.75 – 0.85 nm (d₀₀₂ shifted by functional groups)'],
            ['Physical form', 'Brown-black aqueous paste or dry refined powder'],
          ],
        },
        {
          id: 'solution', label: 'Solution Properties', title: 'Colloidal & Dispersion Characteristics',
          specs: [
            ['Aqueous dispersibility', 'Fully hydrophilic; stable colloidal dispersion without surfactant'],
            ['Zeta potential', '-35 to -50 mV (high colloidal stability)'],
            ['Polar solvents', 'Stable in water, ethanol, ethylene glycol, DMF'],
            ['pH range (aqueous)', '2.5 – 4.5 (as synthesized)'],
          ],
        },
        {
          id: 'targets', label: 'Engineering Targets', title: 'Primary Processing Targets',
          specs: [
            ['Cementitious systems', 'Accelerated C-S-H hydration matrix integration'],
            ['Hydrophilic coatings', 'Anti-corrosion and gas-barrier thin films'],
            ['Energy storage binders', 'Aqueous battery electrode slurries and supercapacitors'],
            ['Membrane filtration', 'Water purification and molecular sieving barriers'],
          ],
        },
      ],
    },
  ],
}

export const QUALITY = {
  eyebrow: 'Empirical quality verification',
  title: 'Characterization standards per batch.',
  body: 'In nanotechnology, quality claims require empirical verification. Every production cycle is cataloged against international structural standards (ISO/TS 21356-1) using three automated quality gates.',
  gates: [
    {
      n: '01', title: 'Laser Raman Spectroscopy', spec: 'ID/IG < 0.1 · Sharp 2D-Band',
      body: 'Raman is the gold-standard fingerprint for carbon materials. We measure the defect ratio (ID/IG peak intensity at ~1350 cm⁻¹ vs ~1580 cm⁻¹) and the symmetric 2D peak (~2700 cm⁻¹) to verify 2–5 layer thickness and intact sp² carbon bonding.',
    },
    {
      n: '02', title: 'X-Ray Diffraction (XRD)', spec: 'Crystalline Spacing d₀₀₂ ≈ 0.34 nm',
      body: 'XRD proves successful exfoliation and crystalline order. Few-Layer Graphene demonstrates a broad, low-intensity (002) reflection, while our functionalized Graphene Oxide displays a characteristic d₀₀₂ shift to 0.75–0.85 nm confirming functional group insertion.',
    },
    {
      n: '03', title: 'Particle Size Analysis (PSA)', spec: 'D50 Flake Range: 5 – 15 µm',
      body: 'Laser diffraction and dynamic light scattering analyze the lateral sheet distribution. We maintain a tight D50 envelope to guarantee consistent matrix coupling, predictable percolation thresholds, and rapid dispersion in resins.',
    },
  ],
  footnote: 'Certified on batch Certificate of Analysis (COA)',
}

export const DISPERSION = {
  eyebrow: 'Handling & processing',
  title: 'Dispersion & integration protocols.',
  body: 'Optimal property translation from 2D sheets into polymer matrices or liquid coatings requires proper de-agglomeration and interfacial wetting.',
  items: [
    ['Solvent Selection', 'FLG powder disperses optimally in polar aprotic solvents (NMP, DMF) and alcohols (IPA). Graphene Oxide is directly dispersible in deionized water without surfactants.'],
    ['Mechanical Shear', 'High-shear mixing (3,000 – 6,000 RPM) or planetary centrifugal mixers provide sufficient shear energy to break Van der Waals agglomerates without fracturing lateral flake dimensions.'],
    ['Resin Compounding', 'For epoxy and polyurethane systems, pre-mix graphene with the resin component before adding the curing agent to ensure uniform distribution and avoid resin localized pre-cure.'],
    ['Storage & Handling', 'Store powders in sealed, airtight containers at ambient room temperature (18–25°C) in dry conditions. Avoid prolonged ambient exposure to prevent moisture absorption.'],
  ],
}

export const FAQ = {
  eyebrow: 'Reliability & supply assurance',
  title: 'Production consistency & order fulfillment.',
  items: [
    ['How do you assure enterprise clients of batch-to-batch consistency?', 'Every shipment is issued with a certified Certificate of Analysis (COA) cross-referenced to its reactor batch ID. Quality is verified using laser Raman spectroscopy (ID/IG defect ratio), X-ray diffraction (XRD crystalline order), and particle sizing (D50) before packaging.'],
    ['Can Velcoris customize flake size (D50) and surface chemistry?', 'Yes. Our synthesis platform allows tuning of lateral flake distribution (D50 from 5 µm to 20 µm) and tailored functionalization levels (Few-Layer Graphene vs Graphene Oxide) to match specific viscosity and bonding requirements in your resin, coating, or battery slurry.'],
    ['What is the minimum order quantity (MOQ) for industrial clients?', 'We fulfill custom volume requirements ranging from small R&D evaluation kits (100g – 1kg) for lab validation up to industrial multi-kilogram and tonnage batch deliveries for commercial production runs.'],
    ['Is the Velcoris manufacturing process compliant with environmental regulations?', 'Yes. Unlike legacy chemical exfoliation (Modified Hummer’s Method) which consumes hundreds of liters of water and concentrated acids per kilogram, our closed-loop thermodynamic reactor produces zero liquid effluent and incorporates heat recovery systems.'],
  ],
}

export const TECH_CTA = {
  eyebrow: 'Evaluation & technical engagement',
  first: 'Ready to evaluate',
  second: 'Velcoris nanomaterials?',
  body: 'Contact our engineering team to request sample evaluation kits (FLG or GO), complete characterization dossiers, or dispersion guidelines for your matrix.',
}
