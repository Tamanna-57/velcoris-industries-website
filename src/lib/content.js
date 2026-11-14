// All homepage copy in one place, condensed from the live site.
// Figures are taken from velcorisindustries.com (not independently verified).

export const CONTACT = {
  email: 'contact@velcorisindustries.com',
  phone: '+91 73028 32224',
  phoneHref: 'tel:+917302832224',
  address: 'Greater Noida, Uttar Pradesh, India',
  linkedin: 'https://www.linkedin.com/company/velcoris-industries/',
  instagram: 'https://www.instagram.com/velcorisindustries/',
}

export const NAV = [
  { label: 'Company', href: '/company' },
  { label: 'Technology', href: '/technology' },
  { label: 'Applications', href: '/applications' },
  { label: 'Media', href: '/media' },
  { label: 'Contact', href: '/contact' },
]

export const SAMPLE_HREF = '/contact?intent=sample'

export const HERO_STATS = [
  { value: '11×', label: 'lower cost than imports' },
  { value: '100 g → t', label: 'supply range' },
  { value: '0 L', label: 'liquid effluent' },
]

export const APPROACH = [
  {
    id: 'economical',
    title: 'Economical',
    line: 'Re-engineered production that bypasses costly imported precursors.',
    metric: '11×',
    metricLabel: 'more affordable than imports',
    href: '/technology#economical',
  },
  {
    id: 'scalable',
    title: 'Scalable',
    line: 'The same structure from lab sample to production tonnage, verified per batch by Raman and XRD.',
    metric: '100 g → t',
    metricLabel: 'consistent supply range',
    href: '/technology#scalable',
  },
  {
    id: 'sustainable',
    title: 'Sustainable',
    line: 'No sulfuric-acid oxidation and closed-loop energy recovery. Clean by design.',
    metric: '0 L',
    metricLabel: 'liquid effluent',
    href: '/technology#sustainable',
  },
]

export const OPPORTUNITY = [
  { value: 92, suffix: '%', prefix: '', label: 'of India’s graphene demand is imported, mostly from China' },
  { value: 11, suffix: '×', prefix: '', label: 'lower cost than import pricing with Velcoris' },
  { value: 2400, suffix: ' Cr', prefix: '₹', label: 'spent on graphene imports every year' },
]

export const APPLICATIONS = [
  { id: 'defence', name: 'Defence', line: 'Lightweight armour composites and EMI shielding.' },
  { id: 'energy', name: 'Energy & EV', line: 'Higher-capacity battery anodes and supercapacitors.' },
  { id: 'aerospace', name: 'Aerospace', line: 'Stronger, lighter structural composites.' },
  { id: 'coatings', name: 'Coatings', line: 'Corrosion-resistant paints, coatings and greases.' },
  { id: 'construction', name: 'Construction', line: 'Higher-strength, longer-life concrete.' },
]

export const RECOGNITION = [
  { org: 'Forbes India', title: 'DGEMS 2025 · Select 200', status: 'Stage 2 nominee' },
  { org: 'Samsung', title: 'Solve for Tomorrow 2025', status: 'National Top 100' },
]

export const FACTS = [
  { value: '2025', label: 'Founded' },
  { value: '45+', label: 'Team' },
  { value: 'B2B · B2G', label: 'Supply' },
  { value: 'Greater Noida', label: 'Facility' },
]

export const STEPS = [
  { n: '01', title: 'Sample', line: 'Characterised samples with Raman, TEM and particle-size data. Test in your own lab.' },
  { n: '02', title: 'Formulate', line: 'Our materials team tunes dispersion and loading for your application.' },
  { n: '03', title: 'Scale', line: 'Move to consistent, domestic production supply, with no import delays.' },
]
