// Company page content. Copy is from velcorisindustries.com/company; card facts are taken from
// the original Company, Technology and FAQ copy (purity, layers, flake size, QC, effluent, supply).
const SITE = 'https://velcorisindustries.com'

export const MISSION = {
  eyebrow: 'Our mission',
  first: "We exist to make the world's most",
  second: 'advanced material, truly accessible.',
  body: "Velcoris Industries is a nanotechnology manufacturer building India's first scalable, industrial-grade graphene production platform. Meet the people powering the material.",
}

// Founder's note condensed to two lines (client request); wording kept from the original note.
export const FOUNDER = {
  eyebrow: "Founder's note",
  quote:
    "India's critical industries should not depend on imported graphene at prohibitive costs. We are building a domestic supply chain: scalable, sustainable and priced for real-world adoption.",
  name: 'Shivendra Pratap Singh',
  role: 'Founder & Chief Executive Officer',
  photo: `${SITE}/assets/ceo.png`,
  linkedin: 'https://www.linkedin.com/in/shivendra-pratap-singh-748998302/',
}

export const GRID_INTRO = {
  eyebrow: 'Inside Velcoris',
  first: 'The people powering',
  second: 'the material.',
}

// Grid cards (reference: Loopsii). Each slot swaps between two facts.
// col/row are grid cells on the 8 × 3 desktop grid.
export const GRID_CARDS = [
  { col: 0, row: 0, tone: 1, items: [
    { title: 'Purity', sub: 'Few-layer graphene', value: '99.5%' },
    { title: 'Layers', sub: 'TEM-verified', value: '2–6' },
  ] },
  { col: 2, row: 0, tone: 2, items: [
    { title: 'Flake size', sub: 'Lateral D50, tunable', value: '5–20 µm' },
    { title: 'Quality check', sub: 'Raman · XRD · D50', value: 'Every batch' },
  ] },
  { col: 1, row: 1, tone: 3, items: [
    { title: 'Effluent', sub: 'Closed-loop solvent', value: '0 L' },
    { title: 'Production', sub: 'Greater Noida', value: '100% Indian' },
  ] },
  { col: 3, row: 1, tone: 4, items: [
    { title: 'Cost', sub: 'vs imported graphene', value: '11× lower' },
    { title: 'Supply range', sub: 'Lab kit to tonnage', value: '100 g → t' },
  ] },
  { col: 0, row: 2, tone: 5, items: [
    { title: 'Lab kits', sub: 'Evaluation samples', value: '100 g' },
    { title: 'COA', sub: 'With every shipment', value: 'Per batch' },
  ] },
  { col: 2, row: 2, tone: 6, items: [
    { title: 'Grades', sub: 'Few-layer & oxide', value: 'FLG · GO' },
    { title: 'Surface', sub: 'Tailored functionalisation', value: 'On request' },
  ] },
]

// Hand-drawn notes. Text box in a cell; arrow path in cell units (1 cell = 100).
export const GRID_NOTES = [
  { col: 1, row: 0, text: 'Raman + XRD on\nevery batch', at: 'top', path: 'M100 62 C 150 62, 172 78, 176 104' },
  { col: 3, row: 0, text: 'tuned to your\nresin or slurry', at: 'top', path: 'M300 62 C 352 62, 372 78, 376 104' },
  { col: 2, row: 1, text: 'solvent recovered,\nzero effluent', at: 'top', path: 'M302 162 C 290 204, 244 214, 206 182' },
  { col: 3, row: 2, text: 'no import\ndelays', at: 'bottom', path: 'M300 262 C 350 262, 372 246, 376 202' },
]

// Original company stats (velcorisindustries.com/company).
export const GRID_STATS = [
  { col: 4, row: 1, value: 45, suffix: '+', label: 'operating\nspecialists' },
  { col: 6, row: 1, value: 6, suffix: '', label: 'departments' },
  { col: 5, row: 2, value: 100, suffix: '%', label: 'indigenous\nproduction' },
  { col: 7, row: 2, value: 99.5, suffix: '%', decimals: 1, label: 'high-purity\nFLG' },
]

export const LEADERSHIP = {
  eyebrow: 'Leadership',
  first: 'Leadership',
  second: 'Board.',
  body: 'The leadership steering Velcoris through scale, science, and strategy.',
  people: [
    {
      name: 'Shivendra Pratap Singh',
      role: 'Chief Executive Officer & Founder',
      bio: "Founder and Chief Executive Officer, steering the company's strategic direction and leading its mission to build India's indigenous industrial graphene supply chain from the ground up.",
      photo: `${SITE}/assets/advisors/shivendra.jpeg`,
      card: `${SITE}/p/shivendra-pratap-singh`,
      linkedin: 'https://www.linkedin.com/in/shivendra-pratap-singh-748998302/',
    },
  ],
}

export const JOIN = {
  eyebrow: 'Join us',
  first: 'Want to build',
  second: 'the future?',
  body: "Whether you're a researcher, engineer, or strategist, we're always looking for driven individuals to join our Greater Noida team.",
  cta: 'View Careers',
  href: '/contact',
}
