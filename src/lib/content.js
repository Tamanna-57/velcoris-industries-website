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
  { label: 'Home', href: '/' },
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
