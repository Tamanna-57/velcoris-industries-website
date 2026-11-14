# Velcoris Industries — Website Redesign Notes

Running log of the analysis, every change made, and the reason behind it.
This is the source material for the final Task 1 report.

**Task:** Analyse velcorisindustries.com, identify improvements in design, UX, content and
functionality, and build a working, responsive prototype that reflects Velcoris as an
advanced-materials and industrial-technology company.

**Status:** Round 4: Media page (original replicated; "Latest from LinkedIn" redesigned).

**Stack:** React 19 + Vite + Tailwind CSS v4. No animation libraries.

---

## 1. Audit of the existing site (14 Nov 2026)

Method: live walkthrough in desktop Chrome, in-browser performance timing
(Navigation/Resource Timing, LCP observer), computed-style inspection of every text node,
and an automated WCAG contrast pass. Pages reviewed: `/`, `/technology`, `/applications`,
`/lite-v2`. Mobile was not tested on the live site.

### 1.1 Performance and perceived latency
| Finding | Measurement | Impact |
|---|---|---|
| Late first paint | HTML at 0.26 s, first contentful paint 1.66 s, LCP 2.3 s (desktop) | Hero shows blank for ~1.5 s |
| One oversized image | `graphene bg.png`: 1.4 MB PNG, displayed at 663×590 (~85% of page weight) | Slow on 4G; could be ~100 KB WebP/AVIF |
| Late scroll reveals | Sections sit at opacity 0 until scrolled into view, then fade in slowly | Scrolling lands on empty or grey areas, so the site *feels* laggy |
| Ghosting bug | Stacked "Three bets" cards show the previous card's text through the next | Looks broken |
| GPU-heavy effects | 6 `backdrop-filter` blur layers | Jank on low-end laptops and phones |

### 1.2 Typography
- About 122 body-text elements fall back to **Times New Roman**: a missing CSS font variable,
  so the intended Space Grotesk loads (~41 KB) but only 6 elements use it.
- Playfair Display headings + a grey Playfair *italic* second line on every heading is the
  common AI-site-builder template look, and it reads as editorial/luxury, not industrial.
- Body text is 14px #7C7C7C on white: low contrast, washed out.

### 1.3 Content and information density
- ~1,100 words on the homepage, ~1,200 on /technology; the homepage is ~6,800 px tall.
- Only 3 images, no real product, process or facility footage.
- Every section uses the same pattern (eyebrow, serif headline, grey paragraph, 3 bullets), 9 times.
- Repetition: "11× cheaper" ~4 times, "zero liquid effluent / no acids" ~4 times.

### 1.4 Interactivity
- The graphite→graphene slider is a flat SVG with changing numbers.
- The hero lattice is a static image with callout labels.
- No tools that help a buyer decide (no comparison, calculator or industry filter).

### 1.5 Credibility
- The lab photo looks AI-generated (brand marks on equipment and notebooks).
- "Recognised by the world's most demanding selectors" overstates two national shortlists.
- Numbers disagree: "11×" on the homepage vs "10× to 1000×" on /applications.
- No datasheets, spec sheets, certifications, characterisation images or case studies.

### 1.6 UX and structure
- The scrolling "Weber Innovations has transitioned…" banner takes the most valuable spot on the page.
- About 7 different labels for call-to-action buttons.
- No routing by buyer type (defence, EV/energy, coatings, construction).
- `/lite-v2` ("Lite Mode"): a separate older site, *heavier* than the main one (~4 MB vs ~1.8 MB;
  two ~2 MB PNGs, raw `WhatsApp Image…` file names), a **different phone number**
  (+91 95572 81101 vs +91 73028 32224), its own canonical URL (duplicate content for SEO)
  and inconsistent branding.

### 1.7 Accessibility (WCAG 2.2 AA, automated pass on the homepage)
- **Fails 1.4.3 contrast:** ~40 of 199 text elements. Nav and hero copy 4.17:1, eyebrow
  labels 2.88:1, slider labels 2.69:1.
- 46 elements under 12px.
- **Fails 2.2.2:** the scrolling banner can't be paused. No `prefers-reduced-motion` handling.
- Keyboard focus visibility unconfirmed (no outline when focused from script).
- Passes: `lang`, skip link, image alt text, accessible names, labelled slider.

---

## 2. Design direction

| Decision | Reason |
|---|---|
| **Industrial, professional, low-text, visual-first** | Buyers skim. A materials company should show the process and the numbers rather than describe them. |
| **Palette: black / neutral grey / one blue** | Keeps the existing monochrome identity but replaces washed-out grey text with high-contrast neutrals. |
| **Blue is used only on interactive elements** (buttons, links, focus, active states) | Gives users one reliable signal for "this is clickable", and adds a pop of colour without decorative noise. |
| **Drop Playfair Display and the grey italic second lines** | Removes the AI-template look and the luxury/editorial tone. |
| **Light + dark theme with a toggle** | Requested by the client team. Dark suits the lattice and process visuals; light suits reading. |

### 2.1 References
| Reference | What was taken | Where it's used |
|---|---|---|
| anduril.com | Confident grotesk typography (Helvetica Now Display), black canvas, monospace data labels, industrial seriousness | Type system, labels, dark theme |
| coffee-tech.com | "Our Approach" list: heading list with hover underline progress, image swap, arrow links to detail pages | "What sets us apart" section |
| procreator.design | Bold geometric sans headlines (Gilroy), generous whitespace, single strong accent | Hero scale, spacing |
| EquitiFy Assets (client clip) | Hover fade on the hovered nav item | Header (round 3) |
| Loopsii (client clip) | Stacking feature cards with text + coloured visual panel | Technology › How our process works (round 3) |
| vastworld.ai (client screenshot) | News grid: picture, date · source, large headline, short summary; alternate cards offset | Media › Latest from LinkedIn (round 4) |
| LxL Creative (client clip) | Small video frame that grows to full-bleed as you scroll, then plays | Scroll-expand video section |
| View Transitions "circular reveal" theme switch | Classy drop/ripple from the toggle into the new theme | Theme toggle |

### 2.2 Typography
| Role | Font | Reason |
|---|---|---|
| Display / headings | **Inter Tight** (variable) | Free, open-licence neo-grotesk closest in feel to Anduril's Helvetica Now Display. Tight, engineered, technical. |
| Body | **Inter** (variable) | Excellent screen legibility at small sizes; pairs natively with Inter Tight. |
| Data, labels, specs | **IBM Plex Mono** | Industrial/engineering heritage; used sparingly for numbers and labels, like Anduril's mono tags. |

Fonts are self-hosted (Fontsource, WOFF2, `font-display: swap`): no third-party requests,
no fallback-font bug.

### 2.3 Section order (homepage)
Hero → Process video → Three advantages → India opportunity → Applications → Recognition →
Three steps → Closing CTA → Footer. The flow follows a buyer's questions: *what is it → how is
it made → why you → why now → for my industry? → can I trust you → how do I start*.

### 2.4 Colour tokens (WCAG-checked)
See `src/index.css`. Contrast ratios are verified in section 5.

### 2.5 Assets
| Asset | Source | Size |
|---|---|---|
| Logo | Official logo from the live site (`logo_main.png`), vectorised to SVG so it's sharp at any size and recolours with the theme | ~12 KB inline SVG |
| Hero lattice | Procedurally rendered graphene honeycomb (Python), not AI-generated; re-rendered in round 2 to fill the frame | 116 KB WebP (45 KB mobile) vs 1.4 MB PNG before |
| Scroll-expand video | Round 1: procedural graphite→graphene render. Round 2: the team's own graphene conductivity clip, 1280px H.264, no audio | 1.2 MB (from 5.5 MB), loads only near the viewport |
| Lab photo | Original site's `lab2.png` | 50 KB WebP (from 2.3 MB) |
| Icons | lucide-react (ISC licence), tree-shaken | only the icons used |
| "Three advantages" visuals | Data-led SVG graphics (cost bars, batch scale, closed loop) | inline, ~0 KB extra |

### 2.6 Tools
- Live-site audit: Chrome DevTools-style timing and style inspection in the browser.
- Prototype verification: Playwright with headless Chrome (screenshots at 390 / 1024 / 1440 px,
  automated contrast and focus checks).

---

## 3. Homepage changes (round 1)

| # | Section | Old | New | Reason |
|---|---|---|---|---|
| 1 | Top ticker | Scrolling "Weber Innovations has officially transitioned…" banner | **Removed**. The rename is a single quiet line in the hero: "Formerly Weber Innovations". | Moving text distracts, fails WCAG 2.2.2, and wastes the top of the page. The fact still matters for trust, so it stays as a statement. |
| 2 | Strip below hero | Scrolling taglines | **Removed** | Visual noise with no information. |
| 3 | Hero | Split layout: text left, boxed lattice image right | **Full-bleed lattice** across the whole section, fading from the page colour on the left to dark on the right. Text sits on the faded side. | Removes the template-like 50/50 split, gives a cinematic first impression, keeps text readable. The lattice is rendered procedurally (no AI imagery) and compressed. |
| 4 | Fonts | Playfair Display + Times New Roman fallback | Inter Tight / Inter / IBM Plex Mono | See 2.2 |
| 5 | Process story | Flat SVG graphite→graphene slider | **Scroll-expand video**: a small frame grows to full-bleed and plays a graphite→graphene animation | Shows the core science in ~8 s with no reading. Lighter than real-time 3D (the client found 3D laggy). |
| 6 | "Three bets. All paid off." | Three stacked text-heavy cards with ghosting | **Hover list** (Coffee-Tech style): Economical / Scalable / Sustainable on one side; one short line, a key figure and a visual on the other; each links to its detail page | You could not compare the three at once and the copy was too long. Now one line per idea, and the visual explains it. |
| 7 | India opportunity | Long paragraphs + three stat tiles + three bullet cards | Three large figures (92% / 11× / ₹2,400 Cr) with one-line captions | The numbers are the argument; the paragraphs repeated them. |
| 8 | Applications | Not on the homepage | Industry tiles (Defence, Energy & EV, Aerospace, Coatings, Construction) linking to /applications | Routes each buyer type to what matters to them. |
| 9 | Recognition | "World's most demanding selectors" | Plain, accurate labels: Forbes India DGEMS 2025 Select 200 nominee; Samsung Solve for Tomorrow 2025 national Top 100 | Accurate claims build more trust with B2B/B2G buyers. |
| 10 | Work with us | Three long cards with three different CTAs | A three-step timeline: Sample → Formulate → Scale, with one CTA | Same message, a third of the words, one clear action. |
| 11 | CTA labels | ~7 variants | Primary: **Request a sample**. Secondary: **Talk to our team** | Consistent, predictable actions. |
| 12 | Contact details | Two different phone numbers across the site | One number everywhere (+91 73028 32224, from the main site) | Prevents lost leads. *Assumption: the main-site number is the current one.* |
| 13 | Lite Mode link | Footer link to the older `/lite-v2` site | Removed from the redesign | Heavier than the main site, inconsistent content and branding. The redesign itself is built to be light. |
| 14 | Theme | Light only | Light/dark toggle (top right) with a circular "drop" reveal | Client request. Respects `prefers-color-scheme` and `prefers-reduced-motion`. |
| 15 | Logo | Raster PNG | Vector SVG of the official logo | Sharp on every screen and recolours automatically for dark mode. |

---

## 3b. Homepage changes (round 2, client review, 14 Nov 2026)

| # | Change | Reason |
|---|---|---|
| R2-1 | **Hero:** the *whole* lattice image now covers the section. A gradient washes it out (faded) on the left behind the copy and fades it into full dark on the right. The image was re-rendered so the lattice fills the frame edge to edge. | Client direction: the round-1 version hid most of the image behind solid page colour. The full image gives a richer, less template-like first screen. Contrast was verified pixel-by-pixel against the image (see 5.3). |
| R2-2 | **Light mode is the default.** Dark mode applies only when the visitor picks it with the toggle (remembered per browser). | Client preference; the brand reads as a light, clean industrial site first. |
| R2-3 | **Scroll-expand video now plays the team's own clip** (graphene sheet with current flowing across the lattice). Section title is now "Engineered at the atomic scale." (wording from the original hero panel); caption is "One atom thick. More conductive than copper." (claim from the original site). | A real brand asset replaces the placeholder. Title and caption were changed to match what the clip shows (conductivity, not layer separation). Re-encoded from 5.5 MB to 1.2 MB, audio track removed. |
| R2-4 | **Sections after "Three advantages" restored to the original site's content and layout:** Recognition → India's strategic opportunity → Clean production → Work with us → Future vision → Footer. | Client decision: keep the original structure and revise each section individually in later rounds. Round-1 replacements (condensed opportunity figures, industry tiles, accurate recognition labels, three-step timeline, closing CTA) were removed. They remain in git history and can be brought back section by section. |
| R2-5 | Replicated sections use the new type system, colour tokens and the original hex-grid texture. The original's grey Playfair *italic* second heading lines are rendered in the same sans in a lighter weight. | Keeps the original structure while honouring the earlier decisions (no italic AI-template font, no washed-out grey, WCAG contrast, dark-mode support). |
| R2-6 | The original "From graphite to graphene" slider section is **not** replicated. | It is replaced by the scroll-expand video (the client found the slider laggy). |
| R2-7 | Lab photo in "Clean production" reused from the original site (compressed to a 50 KB WebP, from a 2.3 MB PNG). | Faithful replication. *Note:* the audit flagged this image as likely AI-generated; recommend replacing it with a real facility photo. |
| R2-8 | Footer: the "Lite Mode" link is left out; one phone number (+91 73028 32224) is used throughout. | Lite Mode points to an older, heavier site with a different phone number (see 1.6). |

**Known claims carried over from the original, flagged for review:** "Recognised by the world's
most demanding selectors" (two national shortlists); "11×" vs "10× to 1000×" on /applications.

---

## 3c. Round 3: header interaction and Technology page (14 Nov 2026)

**Workflow decision:** all further work goes on the existing `redesign/homepage-v1` branch and
is merged by PR, rather than one branch per change.

### Header (reference: EquitiFy Assets, client clip)
| # | Change | Reason |
|---|---|---|
| R3-1 | Header layout unchanged from round 2 (solid bar, same links and button). Only the **hover** changed: the hovered or focused link fades to grey (#6b7380 light / #8a919c dark, 300 ms); the other links stay solid. Replaces the previous blue hover. | Client reference: the hovered item fades out while the rest stay put. The grey stays above 4.5:1 in both themes. |

*Revision:* a first pass also restyled the header (frosted pill, uppercase labels, dark-glass
switching, active dot). The client had not asked for that, so it was reverted; only the hover fade remains.

### Technology page (`/technology`)
| # | Section | Treatment | Reason |
|---|---|---|---|
| R3-6 | Hero, stats band, comparison, datasheet, quality gates, dispersion, FAQ, CTA | **Replicated** from the original page: same copy (verbatim), same order and layout, in the new type and colour system. Grey italic second heading lines → same sans, lighter weight. | Client direction: keep the original structure, revise section by section. |
| R3-7 | **How our process works** | **Redesigned** (reference: Loopsii, client clip). Was: a list of six steps on the left and one text panel on the right, only one stage visible at a time, ~60 words each, no visuals. Now: **six stacking cards**. Each stage card slides up over the previous one as you scroll; earlier cards scale back slightly and peek out above, so the sequence reads as a stack. Each card pairs the stage number, label, title, a one-sentence summary and three spec rows (Input / QA gate / Control) with a **diagram**. A sticky 01–06 rail shows progress and jumps to any stage. | The client found the section too text-heavy with no imagery. The stack shows sequence and progress physically, and each diagram explains its stage at a glance. All original detail (input, QA gate, mechanism) is kept as scannable rows; the full paragraphs remain in `src/lib/technology.js`. |
| R3-8 | Stage diagrams | Pattern-style SVG, not photos: contaminant screen (feedstock), cartridge cells filling (cartridge), reactor core with T/P gauges (reactor), sealed loop (collection), D50 size histogram with 5–15 µm band (refinement), Raman spectrum with D/G/2D peaks and ID/IG < 0.1 (verification). Spectrum and histogram are labelled *illustrative*. | No real process imagery exists, and the process is proprietary. Abstract diagrams explain without revealing reactor engineering, cost ~0 KB, and animate lightly only while in view. |
| R3-9 | Colour in the stack | Reference cards are multicoloured; ours use our palette: white/graphite cards, a stepped blue-grey frame tone per stage (so stacked edges stay distinguishable), dark diagram panels with a single blue highlight. | Client direction: replicate the effect in our colour theme. |
| R3-10 | Datasheet | Product switch + category list implemented as accessible **ARIA tabs** (arrow keys, Home/End, focus follows selection). | Original had clickable tabs without keyboard semantics. |
| R3-12 | FAQ ("Production consistency & order fulfillment") | Collapsed accordion (reference: WLX): question rows with dividers and a chevron; answers open on click; all closed by default. `aria-expanded`, `aria-controls`, and closed answers are `inert`. | Client direction: less text on screen; visitors open only the answers they need. |
| R3-11 | Routing | Minimal path-based routing (`/`, `/technology`), per-page `<title>`. `vercel.json` rewrites every path to `index.html`. | Without the rewrite, Vercel previews returned 404 for `/technology` (reported by the client). |

Verified (Playwright, 1440px and 390px, both themes): no runtime errors; no horizontal overflow;
text contrast on all 208 Technology text elements passes in dark, and in light once false alarms
from translucent pills were re-measured on real pixels (stage rail ≥ 7.8:1); diagram text uses
#a9b0bb on #0f1114 (8.8:1); datasheet tab keyboard focus confirmed.

---

## 3d. Round 4: Media page (14 Nov 2026)

Client reasons, as given: the LinkedIn section on the live Media page **has a lot of latency and
doesn't work** (the posts often load blank), and the client found a media layout (vastworld.ai)
that shows posts as articles, which they preferred. Instruction: replicate the Media page, redesign
the LinkedIn section in that style, keep the LinkedIn links, and use a picture from each post as its cover.

| # | Section | Treatment | Reason |
|---|---|---|---|
| R4-1 | Hero ("The story of advanced materials, frame by frame.") | **Replicated**: same copy, new type system, light hex texture. | Client: keep the original, revise section by section. |
| R4-2 | Gallery | **Replicated**: same six category filters, same 45 photos, titles and order; coverflow carousel (centre photo large, neighbours angled behind), arrows, drag/swipe, keyboard arrows, caption table (Milestone / Category / Archive index), click the centre photo to expand. | Faithful replication. Only the centre ±2 photos render, so at most five photos load at a time. |
| R4-3 | **Latest from LinkedIn** | **Redesigned** (reference: vastworld.ai news grid). Was: four live LinkedIn iframe embeds in a carousel. Now: static article cards, each with a **cover picture from that post**, "Month Year · Author", a headline, a two-line summary and "View post on LinkedIn ↗". Alternate cards sit lower, as in the reference. The original's arrows and swipe are kept (the row scrolls with snap). | **Latency:** the four embeds loaded LinkedIn's full widget (scripts, fonts, tracking) for each post and often rendered blank. Static cards load four small images (26–56 KB each) and nothing else. **Readability:** an article layout (picture, date, headline, summary) scans faster than embedded social posts. **Redirect kept:** each card opens its original post in a new tab, as requested. |
| R4-4 | Card content | Same four posts, same order as the original. Covers are the first picture of each post. Dates are decoded from each post's LinkedIn ID (Dec 2025, Oct 2026, Feb 2026, Aug 2026). Headlines: the original card labels, except the hackathon card (see R4-5); summaries condensed from each post's own text. | Accurate and traceable to the source posts. |
| R4-5 | Hackathon card headline | "Shortlisted for the MSME Idea Hackathon 6.0 Pitch Round" instead of the original label "MSME Idea Hackathon 3.0 Stage-2 Winner". | The post itself (and its cover image) says *shortlisted among 7 teams for the MSME Idea Hackathon 6.0 pitch round*; the old label contradicted the post. **To confirm with the client.** |
| R4-6 | Gallery photo files | Referenced from the live site (`velcorisindustries.com/assets/...`) for now. | The 45 originals (WhatsApp JPEGs up to 1600 px, several hundred KB each) could not be exported from this environment. **To do:** add the originals to `public/media/gallery/` as compressed WebP and switch the paths in `src/lib/media.js`. |
| R4-7 | Press relations | **Replicated**: same copy; button is the blue primary action. | Faithful replication, consistent with the blue-is-clickable rule. |

Verified: no runtime errors at 1440px and 390px; no horizontal overflow on mobile (fixed a bug where
off-screen screen-reader labels widened the page); all cards and gallery controls keyboard-operable.

---

## 4. Performance decisions
- No WebGL or Three.js on the homepage. The lattice is a pre-rendered image; the process
  story is a short compressed video (WebM + MP4, poster frame, `preload="none"` until near the viewport).
- Scroll effects use one passive scroll listener + `requestAnimationFrame` and CSS
  transforms only (no layout thrash), with no animation library dependency.
- Reveal animations are short (≤400 ms) and start before the section fully enters view,
  so there are no empty sections while scrolling.
- No `backdrop-filter` blur stacks.
- Self-hosted fonts; images in modern formats with explicit dimensions (no layout shift).
- Hero image preloaded with `fetchpriority="high"` so the first screen paints immediately
  (old site: blank hero for ~1.5 s).
- JS bundle: 84 KB gzipped (React + all homepage code). CSS: 8.6 KB gzipped.

## 5. Accessibility (WCAG 2.2 AA) measures
- All text/background pairs at 4.5:1 or above (3:1 for large text). Verified ratios are listed below.
- Visible `:focus-visible` ring (blue, 2px offset) on every interactive element.
- `prefers-reduced-motion`: disables the scroll-expand scaling, video autoplay and the theme reveal.
- No auto-moving text; the video has pause/play controls and is muted.
- Semantic landmarks, skip link, ordered heading levels, labelled controls (theme toggle has `aria-pressed` and a label).
- Minimum body size 16px; labels at least 12px.

### 5.1 Verified contrast ratios (design tokens)
| Pair | Light | Dark |
|---|---|---|
| Body text (ink) on page | 19.46:1 | 17.89:1 |
| Secondary text (muted) on page | 7.87:1 | 9.01:1 |
| Secondary text on surface panels | 7.15:1 | 8.22:1 |
| Blue link text on page | 6.46:1 | 8.09:1 |
| White text on blue button | 6.46:1 | 5.17:1 |
| UI borders (non-text, 3:1 needed) | 3.18:1 | n/a |

### 5.2 Automated check of the built homepage (Playwright + headless Chrome)
- Every visible text element checked against its real background: **0 of 118 fail** in light
  and **0 of 118 fail** in dark (round 2 build; old site: ~40 of 199 failed).
- 0 text elements under 12px (old site: 46).
- Keyboard focus: visible 2px blue outline confirmed on Tab.
- Theme toggle switches correctly; no horizontal overflow at 390px mobile width.
- No console or runtime errors at 1440px desktop (both themes) or 390px mobile.

### 5.3 Hero text over the image (round 2, pixel-level)
Text was hidden, the hero screenshotted, and each text colour compared with **every** background
pixel behind it (worst case, including bright lattice atoms):

| Element | Light 1440 | Dark 1440 | Light 1024 | Light 390 | Dark 390 |
|---|---|---|---|---|---|
| Eyebrow | 5.05 | 7.54 | 5.69 | 5.96 | 7.89 |
| Headline | 12.46 | 13.42 | 14.05 | 14.74 | 15.18 |
| Intro paragraph | 5.69 | 7.04 | 5.69 | 5.96 | 7.54 |
| "See the technology" link | 4.67 | 6.23 | 4.68 | 4.89 | 6.64 |
| "Formerly Weber Innovations" line | 5.06 | 6.92 | 5.70 | 5.16 | 6.53 |

All values are at or above the 4.5:1 AA minimum, even at the worst pixel.

---

## 6. Assumptions
- The logo is vectorised from the live site's PNG; replace it with the master SVG from the brand team.
- Blue accent chosen by the redesign team; the exact shade is open to the client's brand guidelines.
- Lattice and process visuals are procedural placeholders, to be replaced with real
  Velcoris footage, micrographs (TEM/Raman) and facility photos when available.
- Copy is condensed from the live site. Figures (11×, 92%, ₹2,400 Cr, 100 g → tonnes,
  0 L effluent) are taken from the live site and not independently verified.
- Inner pages /company, /applications and /contact are linked but not yet built; /technology (round 3) and /media (round 4) are built.
- Technology figures and specs are the original site's claims, copied verbatim and not independently verified.
