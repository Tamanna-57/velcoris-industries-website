// Media page content, from velcorisindustries.com/media (14 Nov 2026).

export const MEDIA_HERO = {
  eyebrow: 'Media center',
  first: 'The story of advanced materials,',
  second: 'frame by frame.',
  body: 'Photographs, facility footage, and documented milestones from the lab floor, expo halls, and strategic partnerships.',
}

// Gallery photos are referenced from the live site for now (see docs/REDESIGN_NOTES.md R4-6).
const SITE = 'https://velcorisindustries.com/assets/'
const wa = (folder, t) => `${SITE}${folder}/${encodeURIComponent(`WhatsApp Image 2026-06-20 at ${t}.jpeg`)}`
const one = (folder, name) => `${SITE}${folder}/${name}`

export const GALLERY_CATEGORIES = [
  'All Media',
  'R&D & Manufacturing',
  'Aerospace & Defence',
  'Industry Summit',
  'Commercial Pilot',
  'Battery & CleanTech Expo',
  'Innovation Summit',
]

const group = (title, category, srcs) => srcs.map((src) => ({ title, category, src }))

export const GALLERY = [
  ...group('TimesNow Global Times Summit', 'Industry Summit', [
    one('4', '1.jpeg'),
    wa('4', '10.29.55 AM (1)'), wa('4', '10.29.56 AM (1)'), wa('4', '10.29.56 AM'),
    wa('4', '10.29.57 AM (1)'), wa('4', '10.29.57 AM (2)'), wa('4', '10.29.58 AM'), wa('4', '10.29.57 AM'),
  ]),
  ...group('Production Lab & Reactor Operations', 'R&D & Manufacturing', [
    wa('Lab', '10.34.57 AM'), wa('Lab', '10.34.58 AM (1)'), wa('Lab', '10.34.58 AM'), wa('Lab', '10.34.59 AM (1)'),
    wa('Lab', '10.34.59 AM'), wa('Lab', '10.35.00 AM (1)'), wa('Lab', '10.35.00 AM'), wa('Lab', '10.35.01 AM'),
  ]),
  ...group('AEROdef India & Team Milestones', 'Aerospace & Defence', [
    one('3', '2.jpeg'),
    wa('3', '10.28.25 AM'), wa('3', '10.28.26 AM (2)'), wa('3', '10.28.28 AM (1)'), wa('3', '10.28.28 AM (2)'),
    wa('3', '10.28.28 AM'), wa('3', '10.28.29 AM (1)'), wa('3', '10.28.29 AM'),
  ]),
  ...group('Industrial Pitch (Inox Gases Partnership)', 'Commercial Pilot', [
    one('1', '1.jpeg'),
    wa('1', '10.21.38 AM (1)'), wa('1', '10.21.38 AM'), wa('1', '10.21.39 AM (1)'), wa('1', '10.21.39 AM (2)'),
    wa('1', '10.21.40 AM (1)'), wa('1', '10.21.40 AM'),
  ]),
  ...group('EV Tech India Expo 2026', 'Battery & CleanTech Expo', [
    one('2', '1.jpeg'),
    wa('2', '10.23.39 AM (1)'), wa('2', '10.23.39 AM (2)'), wa('2', '10.23.39 AM'), wa('2', '10.23.40 AM'),
    wa('2', '10.23.41 AM (1)'), wa('2', '10.23.41 AM'),
  ]),
  ...group('SBI Youth Ideathon (IIT Delhi)', 'Innovation Summit', [
    one('5', '1.jpeg'),
    wa('5', '10.31.29 AM'), wa('5', '10.31.30 AM (1)'), wa('5', '10.31.30 AM (2)'), wa('5', '10.31.31 AM (1)'),
    wa('5', '10.31.31 AM'), wa('5', '10.32.26 AM'),
  ]),
]

export const LINKEDIN_INTRO = {
  eyebrow: 'Updates',
  first: 'Latest from',
  second: 'LinkedIn.',
  body: 'Production milestones, industry events, and behind-the-scenes from the lab.',
}

// Same four posts and order as the original page. Dates decoded from each post's LinkedIn ID;
// headlines/summaries condensed from the posts themselves; covers taken from each post.
export const LINKEDIN_POSTS = [
  {
    id: 'msme-mentorship',
    date: 'December 2025',
    author: 'Shivendra Pratap Singh',
    title: 'Industrial Scaling & MSME Supply Chain',
    summary: 'A high-signal discussion with Satish Kumar, Assistant Director at the Ministry of MSME, on what it takes for deep-tech to escape the lab and scale through MSME-driven manufacturing.',
    cover: '/media/linkedin/msme-mentorship.webp',
    position: 'center 18%', // keep heads in frame
    alt: 'Velcoris team presenting to Ministry of MSME officials',
    href: 'https://www.linkedin.com/posts/shivendra-pratap-singh-748998302_most-breakthroughs-dont-fail-because-the-ugcPost-7408649121416282112-z88f',
  },
  {
    id: 'msme-hackathon',
    date: 'October 2026',
    author: 'Velcoris Industries',
    title: 'Shortlisted for the MSME Idea Hackathon 6.0 Pitch Round',
    summary: 'Velcoris Industries was shortlisted among just 7 teams for the pitch round. One milestone down; the journey continues.',
    cover: '/media/linkedin/msme-hackathon.webp',
    position: 'center 25%',
    alt: 'Milestone achieved: Velcoris shortlisted among 7 teams for the MSME Idea Hackathon 6.0 pitch round',
    href: 'https://www.linkedin.com/posts/velcoris-industries_velcorisindustries-msmeideahackathon-deeptech-activity-7513168159948869632-ESh0',
  },
  {
    id: 'et-now-summit',
    date: 'February 2026',
    author: 'Shivendra Pratap Singh',
    title: 'ET NOW Global Business Summit 2026',
    summary: 'Representing the company, then Weber Innovations, among leaders shaping industry, energy and technology. The next great industrial leap will be built on advanced materials.',
    cover: '/media/linkedin/et-now-summit.webp',
    alt: 'Shivendra Pratap Singh at the ET NOW Global Business Summit 2026',
    href: 'https://www.linkedin.com/posts/shivendra-pratap-singh-748998302_weberinnovations-globalbusinesssummit-deeptech-ugcPost-7431284406411042816-CdZz',
  },
  {
    id: 'autotech-asia',
    date: 'August 2026',
    author: 'Velcoris Industries',
    title: 'AutoTech Asia & Industry 4.0',
    summary: 'Our team engaged with manufacturers and technology leaders shaping automotive engineering, intelligent manufacturing, automation and connected mobility.',
    cover: '/media/linkedin/autotech-asia.webp',
    alt: 'Exhibition hall at AutoTech Asia',
    href: 'https://www.linkedin.com/posts/velcoris-industries_autotechasia-automotivetechnology-industry40-activity-7492295055139983360-oYed',
  },
]

export const PRESS = {
  eyebrow: 'Press relations',
  title: 'Looking to feature Velcoris, or co-publish technical research?',
  body: 'We cooperate with scientific journalists, B2B trade publications, and industrial creators on facility visits, material characterisation reviews, and clean energy podcasts.',
  cta: 'Contact Press Relations',
}
