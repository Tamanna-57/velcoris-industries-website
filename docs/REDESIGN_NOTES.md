# Velcoris Industries — Website Redesign Notes

Running log of the analysis, every change made, and the reason behind it.
This is the source material for the final Task 1 report.

**Task:** Analyse velcorisindustries.com, identify improvements in design, UX, content and
functionality, and build a working, responsive prototype that reflects Velcoris as an
advanced-materials and industrial-technology company.

**Status:** Round 7: Applications page completed (all original sections), sector rows rebalanced, smoother reveal.

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
| RSAShield (client screenshots) | Alternating "01. Title" rows with isometric diagrams | Home › Work with us (round 5) |
| WLX / Weiss Lameraner (client clip) | Alternating work rows: photo widens into place, text blur-in, two-tone headline, facts with rules, tag line | Applications › sector list (round 6) |
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
| R4-8 | Homepage scroll-expand video | Replaced with the team's new clip (graphene conductivity, a solid sheet, and a sheet floating beside a dandelion to show lightness); compressed from 5.9 MB to about 1.3 MB, audio removed. Caption unchanged. | Client supplied a newer brand video. The caption ("One atom thick. More conductive than copper.") still matches the content. |
| R4-9 | **Gallery rebuilt to match the original exactly** (client review). The first version stepped between five fixed positions; now it is the original's **continuous curved strip**: every photo's rotation (0° → 42° → 62° → 78°, capped at 82°), depth (≈ −0.65 × card × d^0.55) and opacity (−10% per step) are computed from its fractional distance to the centre. **Dragging moves the strip smoothly under the pointer** and it eases to the nearest photo on release (with flick momentum); arrows and keyboard use the same 0.5 s ease. Card size `clamp(220px, 28vw, 360px)`, square, 1.05× spacing, perspective 3× card: all measured from the live page. | Client: the original drag is very smooth and animated; ours was static. "Use Playwright to write the exact same one." Measurements were taken from the live page in the browser; drag continuity was verified with Playwright (fractional mid-drag rotations). |
| R4-10 | **Category filters restyled to the original's proportions**: 12px semibold labels, 32px-tall pills, 8px gaps, centred; inactive = white with a light border and grey text, active = solid black. | Client: our larger pills spread across the page looked "AI generated"; keep them professional, as on the original. |
| R4-11 | **Caption block redesigned** as one compact card: category + milestone title + drag hint on the left; "Archive index 05 / 08" with a small progress bar on the right. Section padding reduced. | Client: the caption area looked plain and empty (a sparse centred table with lots of white space). |
| R4-12 | LinkedIn card 1 cover repositioned (focus moved up) so people's heads are no longer cropped. | Client: heads were cut off in the first card. |
| R4-7 | Press relations | **Replicated**: same copy; button is the blue primary action. | Faithful replication, consistent with the blue-is-clickable rule. |

Verified: no runtime errors at 1440px and 390px; no horizontal overflow on mobile (fixed a bug where
off-screen screen-reader labels widened the page); all cards and gallery controls keyboard-operable.

---

## 3e. Round 5 (14 Nov 2026)

| # | Change | Client reason | Implementation notes |
|---|---|---|---|
| R5-1 | **Accent blue softened**: light `#1f4fe0` → `#4a66b8` (buttons, links, focus); dark-mode links `#7da4ff` → `#93abe0`, dark-mode buttons `#2f5bff` → `#4a66b8`. Diagram highlights and dark-band links updated to match. | "The blue is quite bright and looks harsh. It should still highlight, but less." | Still meets WCAG AA: white on `#4a66b8` 5.41:1; `#4a66b8` on white 5.41:1 and on the grey surface 4.91:1; `#93abe0` on the dark background 8.57:1. Blue is still reserved for clickable things. |
| R5-2 | **Nav hover matched to the reference** frame by frame: the hovered link fades from near-black to a neutral grey (`#737373` light / `#8f8f8f` dark) in 0.15 s; the other links stay solid. | "The hover animation isn't working the way the reference shows; make it exact." | Measured from the clip at 50 fps: only the hovered item changes, from ≈#2f2f2f to ≈#757575 in ~0.1–0.15 s, with no movement or underline. Previously 0.3 s to a bluish grey. |
| R5-3 | **"Work with us" (homepage) redesigned** (reference: RSAShield "How it works"). Was three equal text cards. Now three **alternating rows**: large "01. Title" with the number in grey, the original text and its original button (Request Samples / Discuss Application / Explore Supply), and an **interactive isometric diagram** on the other side. | "Replace the three-process section with this layout, with interactive diagrams generated in our theme." | Diagrams are SVG, theme-aware (light and dark tokens `--iso-*`): (1) sample jar + COA sheet whose checks tick on hover; (2) parameter tiles (wt%, RPM, D50, resin) with a graphene block that drops into the mix on hover; (3) batch stack that rises, with a consistency chart that draws and a COA badge. Idle float, motion off under reduced-motion. Copy unchanged from the original. |

*Note:* the client's screenshot for R5-3 came from the live Applications page, which uses the same three-step block; it is applied here to the homepage section (the Applications page is not built yet).

---

## 3f. Round 6: Applications page (14 Nov 2026)

Client reasons, as given: build the "Transforming core industries" section (nine sectors, each with
an image and information) in the style of the reference clip (WLX "Work" list), with the same effect
and animation. Show only the **four main sectors the company is known for**, so the client's time
isn't wasted, and add a **load-more** button for anyone who wants to see all nine; the rest should open
with the same effect and animation.

| # | Change | Reason / notes |
|---|---|---|
| R6-1 | **Hero** replicated from the original ("Transforming core industries with atomic-scale precision.") | Faithful replication. |
| R6-2 | **Sector list redesigned** (reference: WLX). Was: a sidebar of nine sector buttons with one large panel (photo, badge, title, italic tagline, paragraph, three stat tiles, a formulation box, a use-case list), only one sector visible at a time. Now: one **row per sector**, photo and text alternating sides: eyebrow "Sector · 01 · Coatings & Tribology", a two-tone headline (title light + tagline bold), the original paragraph, the three stats as two-column facts with rules, a tag line (stage · loading window · dispersion method), and a "Discuss … application" link. | Matches the reference layout; each sector is readable on its own while scrolling, with no clicking between tabs. All original figures are kept; the four use-case bullets per sector stay in `src/lib/applications.js` (not shown, to keep rows short, as in the reference). |
| R6-3 | **Animation** (from the reference): as each row enters the viewport the photo **widens into place** (clip reveal from the text side, 1.2 s) while zooming from 118% to 100%, and the text **fades in from a blur**, line by line. | Replicates the clip. Runs once per row; disabled under reduced-motion (content shows immediately). |
| R6-4 | **4 + "View all 9 applications"**: the four commercial-scale sectors (Coatings, Infrastructure, Energy Storage, Polymers) show first; the button reveals the five R&D / co-development sectors under "Strategic horizons & R&D" with the same animation, and keyboard focus moves to the first new sector. | Client: show the main four the company is known for; let interested visitors load the rest. The grouping is the original page's own ("Commercial focus" vs "Strategic horizons & R&D"). |
| R6-5 | Photos | The original page's Unsplash images (free under the Unsplash licence), served at 1200 px. Smart Conductive Textiles has **no working photo on the original site**, so a woven-fibre pattern stands in; replace it with a real photo when available. |

---

## 3g. Round 7: Applications page finalised (14 Nov 2026)

| # | Change | Client reason | Notes |
|---|---|---|---|
| R7-1 | **Photo and text balanced**: photos now take half the row and are square on desktop (were 5/12 width, 4:3); sector descriptions condensed by ~35% (e.g. 53 → 45 words, 58 → 33) keeping every figure. | "Increase the image size to match the text, and crisp the text a little so image and text stay level." | Full original paragraphs remain in `src/lib/applications.js` (`body`); rows show `short`. |
| R7-2 | **Smoother text reveal**: blur reduced from 8px to 3px; blur, fade and 10px rise share one easing curve (0.9 s) with a 60 ms stagger, so they finish together. | "Ours has a lot of blur; you can see it's blurry first and then the text comes. The reference is smooth." | Matches the subtle blur-in of the WLX reference. |
| R7-3 | **Faster loading**: preconnect to the image host; responsive images (640 / 960 / 1280 px via `srcset`); first sector photo loads eagerly at high priority; rows start revealing earlier (8% before entering vs 18%). | "There's latency when the Applications page loads." | Smaller images on phones; no blank wait on the first photo. |
| R7-4 | **Interactive Matrix Optimizer** (replicated from the original): host-matrix select (cement, epoxy, rubber, battery slurry), target property (mechanical / thermal / functional), loading slider with each matrix's own range and optimal-window band; three live outputs, window status, dispersion method and interfacial mechanism. | "Have you added the other sections of the Applications page?" | All labels, ranges, windows, dispersion methods and mechanism texts are the original's. Curves are calibrated to the original's peak/end values and labelled *illustrative model*. Accessible: labelled select, radio group, range with spoken value text, live-region status. |
| R7-5 | **Commercial integration pathway** ("From evaluation to plant-scale production"): Source & Evaluate / Formulate & Optimize / Scale & Deploy. *Superseded by R8-3: now replicated as the original three cards.* | — | — |
| R7-6 | **Closing CTA** ("Your industry. Our nanomaterials.") replicated. | Complete the page. | Same dark band as other pages. |

---

## 3h. Round 8: Applications corrections (14 Nov 2026)

| # | Change | Client reason | Notes |
|---|---|---|---|
| R8-1 | **Matrix Optimizer resized to the original's proportions**: panel split ~41/59, tighter padding, 44 px select, 36 px property buttons, smaller tiles. The whole tool (controls + outputs) now fits on one screen. | "Look at the difference of the ratios… see it on a single screen." | Measured 518 px tall at 1440×900 and 1920×1080 (original ≈ 468 px). |
| R8-2 | **Numbers in a distinct display font** (Space Grotesk, semibold, tabular) for the three live outputs and the wt% badge. | "Change the numbers font, it's not highlighting at all." | Self-hosted via Fontsource; units set smaller beside the figure so values stand out. |
| R8-4 | **Homepage "Work with us" compressed to the RSAShield ratios**: titles ~2.5vw (36 px max, was 48), 16 px body, diagram ≈ 27% of viewport (max 416 px), row gap 40 px (was 112). Section 1875 → 1623 px tall at 1536 px wide. | "It is quite expanded… why are you making such huge things… it has a fixed ratio… not too small, not too expanded." | Measured from the reference screenshot (title/viewport 2.6%, diagram/viewport 27%). |
| R8-5 | **Diagrams redrawn and made properly interactive**: rounded gradient platforms with soft shadow (as in the reference), tight viewBox so no part is cut; hover/focus drops the cube into its slot, lifts the jar lid, ticks the COA checks one by one, draws the chart and stacks batches; pointer tilt on mouse hover. | "The images are cutting… the diagrams are not properly interactive." | Theme tokens for light and dark; motion off under reduced-motion. |
| R8-6 | *Removed in R12-6.* **Page transition on nav clicks** replicated from the header reference video: a page-colour panel rises from the bottom (0.45 s), then retracts upward revealing the new page bottom-up with the header uncovered last (0.55 s). Colour fade on hover kept. Pages now switch client-side; back/forward work; titles and active nav update. | "Why are you unable to get that hover effect animation I have given you 3 times?" | Frame-by-frame analysis of the reference showed the missing part was the click transition, not the hover colour. Instant under reduced-motion. |
| R8-3 | **Commercial integration pathway restored to the original layout**: three cards (number, black icon square, title, text, tags) with the original copy. RSAShield rows removed from this page. | "I haven't told you [to change it]… keep the other page exactly the same as the original." | RSAShield layout stays only on the homepage "Work with us" section, where it was asked for. |

---

## 3i. Round 9: Company page (14 Nov 2026)

Sequence as the client asked: mission → founder → grid → leadership → join us.

| # | Change | Client reason | Notes |
|---|---|---|---|
| R9-1 | **Mission hero** replicated from the original ("We exist to make the world's most advanced material, truly accessible."). | Keep the rest of the page the same as the original. | Same hero pattern as the other pages. |
| R9-2 | **Founder's note condensed** from two long paragraphs to the founder's photo plus a two-line quote, name, role and LinkedIn. | "It's way too much bigger. We can just have 2 lines from the founder and his picture." | Quote wording is taken from the original note. Photo served from the live site. |
| R9-3 | **Grid section** (reference: Loopsii grid video): an 8 × 3 square-cell line grid; six staggered white cards that swap between two site facts each with a rolling text change (purity, layers, flake size, QC, effluent, production, cost, supply range, lab kits, COA, grades, functionalisation); blue hand-drawn notes with arrows that draw in ("Raman + XRD on every batch", "tuned to your resin or slurry", "solvent recovered, zero effluent", "no import delays"); the original's four stats (45+ specialists, 6 departments, 100% indigenous, 99.5% FLG) count up on the right, pinned to grid intersections with square markers. | "Have this grid section, make it a smoother version, with the numbers already in the original website; the orange markups in our blue; put specific pointers relevant to the website." | Every figure comes from the original Company, Technology or FAQ copy. Notes in Caveat (self-hosted), only for the annotations. Below 1024 px: 2-column cards + 2 × 2 stats. Reduced motion: no swaps, roll, count or draw. |
| R9-4 | **Leadership Board** and **Join us** replicated from the original (business-card and LinkedIn links kept; "View Careers" to contact). | Keep the rest the same as the original. | Join us uses the same dark band as other pages' CTAs. |
| R9-5 | **"Home" added as the first nav item** (Home, Company, Technology, Applications, Media, Contact), as on the original. Active state matches "/" exactly; link spacing tightens at 1024–1279 px so the bar still fits. | "Keep the sequence of the header the same; you have missed out the Home one." | Desktop and mobile menus. |
| R9-6 | **Homepage section order**: "Engineered clean, built to scale" (light) moved between "Recognised by…" and "Graphene is revolutionary" (both dark), so dark and light sections alternate. | "Two black sections together… move one section from below to above… it's not looking good at all." | Order now: Approach (light) → Recognition (dark) → Clean production (light) → India opportunity (dark) → Work with us (light) → Future vision (light) → footer (dark). |

---

## 3j. Round 10: Spacing, light hero, monochrome diagrams (14 Nov 2026)

| # | Change | Client reason | Notes |
|---|---|---|---|
| R10-1 | **Less white space between sections on every page**: section padding 96–128 px → 56–80 px (desktop 80 px); smaller CTA/strip sections 80–96 → 48–64 px; page heroes' bottom padding reduced; heading-to-content gaps 56–80 → 40–48 px. | "A lot of white space between the different sections… make it a little less so it looks smoother." | Applied through shared section classes on Home, Company, Technology, Applications and Media. |
| R10-2 | ~~**Light-mode hero image**~~ *Reverted in R11-1.*: a light version of the graphene lattice (dark-grey lines on white), generated from the same render; dark mode keeps the original dark lattice. The light image is preloaded (light is the default theme). | "The hero base image looks very bad in light mode; okay in dark mode." | `hero-lattice-light.webp` (97 KB) + 960 px mobile version. |
| R10-3 | **"Work with us" diagrams in the site's black/white/grey theme** (were blue): white/grey platforms and tiles, near-black blocks, black checks and chart line; in dark mode, dark platforms with light-grey blocks. Rows tightened further (section 1623 → 1447 px). | "A lot of space between them… you made it in the whole blue theme, but we have our black and white theme." | Blue stays only on the clickable buttons. |

---

## 3k. Round 11: Hero reverted; dispersion folders (14 Nov 2026)

| # | Change | Client reason | Notes |
|---|---|---|---|
| R11-1 | **Hero image reverted** to the previous dark lattice with the light fade (light-image version removed). | "What have you done, it's looking very bad, can we just go back to the previous one." | Hero code, preload and CSS restored exactly. |
| R11-2 | **Dispersion & integration protocols as 3D folders** (reference: Loopsii tiles video): four square folders (with tab) swing up into place in perspective as the row scrolls in; each cover shows the title, a handwritten key spec (NMP · DMF · IPA / 3,000–6,000 RPM / resin first, then hardener / 18–25 °C · sealed · dry) and an animated black glyph. Hover, keyboard focus or tap opens the folder: the cover tips forward in 3D and a sheet slides up with the one-line key point. | "A 3D folder effect; as we hover over the folder we see the text… reduce the text of the whole website… the exact same thing for this section." | Text cut from ~30 words per card to ~15 (original wording kept in data). Greyscale covers to stay in the black/white theme. Phones: one column of wider folders, tap to open. Accessible: button role, aria-expanded, Enter/Space/Escape, description linked; reduced motion disables tilt and glyph animation. |

---

## 3l. Round 12: Folder gradient, Approach photos, Contact page, navigation bug (14 Nov 2026)

| # | Change | Client reason | Notes |
|---|---|---|---|
| R12-1 | **Dispersion folders: soft blue gradient** (near-white top-left into the site blue bottom-right, a little deeper on each folder; tab one step darker) instead of flat grey. | "The grey looks very bad… not the whole folder blue nor grey… a little gradient so it has both the punch." | Same gradient logic in dark mode, tuned stronger so the blue reads. |
| R12-2 | **Homepage "Three advantages" panel uses real photos** from the original site's lab set instead of the dark pattern visuals: synthesis reactor head (Economical), production reactor rig (Scalable), thermal unit with energy recovery (Sustainable), with a small caption chip; soft zoom when a row becomes active. | "The patterns are not looking good at all… extract images from the website that go with the information." | Photos referenced from velcorisindustries.com like the media gallery (R4-6). Old `ApproachVisuals.jsx` removed. |
| R12-3 | **Contact page replicated** from the original: "Let's build what comes next." hero; "Have a question?" form (Name, Email ID, Phone optional, Message, hidden honeypot, Send Inquiry); Reach us (email, phone, headquarters, response time, LinkedIn). Site buttons with `?intent=sample/supply/application` prefill the message. | "Contact page as it is in the original website." | No backend in the prototype: Send Inquiry opens the visitor's email app addressed to contact@velcorisindustries.com with all fields filled in. |
| R12-4 | **Navigation bug fixed (two causes).** (1) The header and page content shared the same React key, so each client-side navigation left the previous header in the page, stacked and stale. Keys are now unique. (2) Client-side navigation keeps the first-loaded bundle, so a tab opened before a deploy kept showing the old site until reload. Each nav click now checks the live `index.html`; if a new build is out, the click does a full page load. Added explicit cache headers (`index.html` no-cache, hashed assets immutable). | "When I load it, it shows the old version; after reloading, the Home link and spacing appear… there is some glitch." | Verified: one header and one main after every navigation; simulated new deploy triggers a full reload. |
| R12-5 | **Font options prepared** (Inter Tight current vs Geist, Manrope, Instrument Sans with ~18% smaller headings), awaiting the client's choice. | "Not liking my font, it looks very big… use another font and show it to me." | Preview image shared; nothing switched yet. |
| R12-6 | **Page-change curtain removed**: clicking a nav link now switches pages instantly (no plain white/black panel). Hover colour fade on links kept; the new-deploy check and back/forward still work. | "The plain light or black screen is not looking good for the theme… just remove that animation and keep it simple." | Curtain CSS and timing code deleted. |

---

## 3m. Round 13: Loading speed for first-time visitors (14 Nov 2026)

| # | Change | Client reason | Measured result |
|---|---|---|---|
| R13-1 | **Remote photos served through Vercel Image Optimization** (`vercel.json` → `images`): gallery, lab, "Three advantages" and Company photos are fetched once from velcorisindustries.com, resized to the size shown, converted to WebP and cached at the edge for 31 days. `src/lib/img.js` builds the URLs and `srcset`. | "Pictures and videos take a lot of time to load in a new browser; fine with cache." | Founder photo 1.9 MB → 13 KB; leadership photo → 9 KB; lab photos 50–140 KB; gallery average 87 KB (originals 120–350 KB). First request per image is slower while Vercel creates the copy; later visitors get the cached copy. |
| R13-2 | **Video starts buffering 600 px before it is on screen** (was: only when visible), plus a **540p phone version** (580 KB vs 1.28 MB) chosen automatically on small screens; both files are web-optimised (fast start). | Same. | Phone video fully buffered (readyState 4) by the time the section is reached. |
| R13-3 | **Cache headers**: `/media/*` cached 30 days with background revalidation (was revalidated on every visit); hashed build files a year. | Same. | Repeat views of media skip the network. |
| R13-4 | **Hero preload matches the screen**: phones preload the 45 KB image only (the 114 KB desktop image was also downloading). | Found while measuring. | One hero download per visit. |
| R13-5 | Applications photos (Unsplash) at quality 60 instead of 70. | Same. | About a quarter smaller. |
| R13-6 | **Light-mode hero redone (option A of three previews)**: the lattice image itself now fades out (CSS mask) instead of being covered by a translucent white layer, which had turned the dark image muddy grey. The headline sits on clean white; the dark lattice rises in from the right, starting just past the text column at every width (phones: from the bottom). Dark mode unchanged. | "The hero image looks good in dark mode but very bad in light mode." Client picked A ("dark lattice from the right") from a side-by-side preview of three options. | Hero text contrast at the worst pixel: 7.87–19.46:1 at 390, 1024 and 1440 px (was as low as 4.57:1). |

---

## 3n. Round 14: Animated hero lattice (15 Nov 2026)

| # | Change | Client reason | Notes |
|---|---|---|---|
| R14-1 | **Static lattice image replaced by an animated 2D honeycomb** (`HexField.jsx`, canvas): hexagons grow out from just under the navigation bar until they fill the section (~1.7–2.6 s), then some cells slowly fade in and out and pulses of current run along the edges like circuitry, in the site blue. | "Instead of the static honeycomb, something animated: it forms from the top of the nav, mutates into other honeycombs until it fills the screen, then some fade and some flow like electrical wires, like in the movies." | 60 fps on desktop, ~56 fps on a 4× throttled phone CPU; pauses off screen / in background tabs; follows light and dark theme; reduced motion draws the finished lattice once. Removes the 114 KB hero image download. |
| R14-2 | **Centred, animated intro**: eyebrow, then the headline word by word (rise + blur-in), then the line, buttons and the "Formerly Weber Innovations" note, timed with the growth. | "While the honeycomb is forming, the introduction comes alive in the centre, in a much more animated form." | The lattice is cut out behind the text with a soft-edged mask fitted to the copy block, so every hero text element keeps its full contrast (7.9–19.5:1 light, 8.6–17.9:1 dark) at 390, 1024 and 1440 px. |

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
| Blue link text on page (round 5 blue) | 5.41:1 | 8.57:1 |
| White text on blue button (round 5 blue) | 5.41:1 | 5.41:1 |
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
- Inner pages /company and /contact are linked but not yet built; /technology (round 3), /media (round 4) and /applications (rounds 6–7, all sections) are built.
- Technology figures and specs are the original site's claims, copied verbatim and not independently verified.

### R14-3 — Thinner, uniform honeycomb behind the hero
- **User's reason:** "thin the lines… text background is white and around it has the structure… looking very odd… make a uniform structure behind on the landing page."
- Removed the white cut-out (mask) behind the copy, so the lattice now runs evenly across the whole hero.
- Lines are thinner (0.7 px) and fainter (light 7%, dark 8%). Each edge is drawn once, so overlapping lines don't stack up into darker spots.
- To keep the text readable, junction dots and the flowing pulses skip the area behind the copy. Every text item still passes WCAG AA (lowest is 4.54:1).

### R14-4 — Back to the earlier hero, with a thinner, animated honeycomb
- **User's reason:** "Go back to the one from before those two changes. Just thin the lines of that honeycomb and make it animated. The electric lines look very bad; change them a little and make them thinner."
- Restored the hero layout from before R14-1: copy on the left, dark honeycomb rising in from the right (light mode), full lattice with the left wash (dark mode).
- The lattice photo is replaced by a canvas drawing of the same perspective honeycomb (`LatticeField.jsx`). Its lines are thinner (0.4–0.65 px), and junction dots fade with depth.
- Animation: a slow glide towards the viewer plus a gentle surface wave.
- The thick "electric" pulses are replaced by a few small sparks: about 1 px thick, under two bonds long, kept to the right side, fading in and out.
- Removed: `HexField.jsx`, the centred word-by-word intro, and the uniform lattice.
- **Checks:**
  - About 60 fps at 1440 px (1× and 2× screens) and on a 390 px phone. Large canvases are capped at 1.5× resolution.
  - Pauses when off screen or in a background tab; reduced motion draws one still frame.
  - Hero text contrast: 7.3–19.5:1, with the link at 5.4:1 or above.
