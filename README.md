# Velcoris Industries — Website Redesign

Redesign prototype for [velcorisindustries.com](https://velcorisindustries.com): an industrial-scale
graphene manufacturer in Greater Noida, India.

The goal is a clean, professional, fast and accessible site that shows instead of tells: less text,
more visuals, and one clear action (request a sample).

**Analysis, decisions and reasoning:** see [`docs/REDESIGN_NOTES.md`](docs/REDESIGN_NOTES.md).

## Stack
- React 19 + Vite
- Tailwind CSS v4 (design tokens in `src/index.css`)
- Self-hosted fonts: Inter Tight (display), Inter (body), IBM Plex Mono (data/labels)
- No animation libraries: scroll effects use native APIs (IntersectionObserver, rAF, View Transitions)

## Run locally
```bash
npm install
npm run dev       # http://localhost:5173
npm run build     # production build in dist/
npm run preview   # serve the build
```

## Structure
```
src/
  App.jsx                 header/footer shell + path routing
  pages/Home.jsx          homepage
  pages/Technology.jsx    technology page
  lib/technology.js       technology page copy (verbatim from the original)
  index.css               tokens (light/dark), base styles, focus, reduced-motion
  lib/content.js          all homepage copy and figures
  lib/hooks.js            reveal / in-view / reduced-motion hooks
  components/
    Header.jsx            nav (hover fade), mobile menu
    ThemeToggle.jsx       light/dark toggle with circular reveal (light is default)
    Hero.jsx              full-bleed lattice hero, faded left → dark right
    ProcessVideo.jsx      scroll-expand graphene video
    Approach.jsx          hover list: Economical / Scalable / Sustainable
    ApproachVisuals.jsx   data visuals for the list
    Recognition.jsx       ┐
    IndiaOpportunity.jsx  │ replicated from the original site,
    CleanProduction.jsx   │ to be revised section by section
    WorkWithUs.jsx        │
    Footer.jsx            ┘ (also exports FutureVision)
    SectionHeading.jsx    shared two-line heading
    Logo.jsx              official logo (vector)
    ProcessStack.jsx      technology: stacking 6-stage process cards
    StageVisuals.jsx      technology: diagram for each process stage
public/media/             hero image, graphene video + poster, lab photo
scripts/render_lattice.py procedural renders for the hero and video
```

## Status
- [x] Homepage round 1 (redesign)
- [x] Homepage round 2 (client review: full-image hero, team video, original lower sections restored)
- [x] Round 3: nav hover fade + Technology page
- [ ] Company, Applications, Media, Contact pages
