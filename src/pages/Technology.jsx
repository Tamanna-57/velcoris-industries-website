import { useId, useState } from 'react'
import { Activity, ChartColumn, ChevronDown, CircleCheck, CircleX, Download, Layers } from 'lucide-react'
import DispersionFolders from '../components/DispersionFolders'
import ProcessStack from '../components/ProcessStack'
import SectionHeading from '../components/SectionHeading'
import { ArrowRight } from '../components/icons'
import { SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { COMPARISON, DATASHEET, FAQ, QUALITY, TECH_CTA, TECH_HERO, TECH_STATS } from '../lib/technology'

/* Technology page. Everything except "How our process works" (ProcessStack) replicates the
   original velcorisindustries.com/technology layout and copy, in the new type and colour
   system, for section-by-section review. */

function TechHero() {
  return (
    <section aria-labelledby="tech-title" className="hex-pattern-light bg-bg pb-12 pt-[calc(72px+5rem)] md:pb-16 md:pt-[calc(72px+7rem)]">
      <div className="container-x">
        <p className="eyebrow">{TECH_HERO.eyebrow}</p>
        <h1 id="tech-title" className="mt-5 max-w-5xl text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
          <span className="block">{TECH_HERO.first}</span>
          <span className="block font-light">{TECH_HERO.second}</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-muted">{TECH_HERO.body}</p>
      </div>
    </section>
  )
}

function TechStats() {
  return (
    <section aria-label="Key material figures" className="hex-pattern bg-band">
      <dl className="container-x grid grid-cols-2 lg:grid-cols-4">
        {TECH_STATS.map((s, i) => (
          <div key={s.label} className={`flex flex-col py-9 lg:px-8 lg:first:pl-0 ${i ? 'lg:border-l lg:border-band-line' : ''}`}>
            <dd className="order-1 font-display text-[clamp(1.6rem,2.6vw,2.25rem)] font-semibold tracking-tight text-band-ink">{s.value}</dd>
            <dt className="order-2 mt-2 font-mono text-xs uppercase tracking-[0.12em] text-band-muted">{s.label}</dt>
            <dd className="order-3 mt-1 text-sm text-band-muted">{s.note}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}

function Comparison() {
  const ref = useReveal()
  const card = (side, dark) => {
    const d = COMPARISON[side]
    const Icon = dark ? CircleCheck : CircleX
    return (
      <article className={`flex flex-col rounded-3xl p-7 md:p-9 ${dark ? 'hex-pattern bg-band text-band-ink' : 'border border-line bg-surface text-ink'}`}>
        <p className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] ${dark ? 'border-band-line text-band-muted' : 'border-line text-muted'}`}>
          <Icon className="size-3.5" aria-hidden="true" /> {d.label}
        </p>
        <h3 className="mt-5 text-2xl font-semibold">{d.title}</h3>
        <ul className="mt-6 space-y-4">
          {d.points.map(([t, body]) => (
            <li key={t} className={`border-t pt-4 text-[0.9375rem] leading-relaxed ${dark ? 'border-band-line text-band-muted' : 'border-line text-muted'}`}>
              <strong className={`font-semibold ${dark ? 'text-band-ink' : 'text-ink'}`}>{t}:</strong> {body}
            </li>
          ))}
        </ul>
        <div className={`mt-auto flex flex-wrap justify-between gap-3 pt-8 text-sm ${dark ? 'text-band-muted' : 'text-muted'}`}>
          {d.footer.map((f) => (
            <span key={f}>{f}</span>
          ))}
        </div>
      </article>
    )
  }
  return (
    <section ref={ref} aria-labelledby="compare-title" className="bg-bg py-14 md:py-20">
      <div className="container-x">
        <div className="reveal mx-auto max-w-3xl text-center">
          <SectionHeading id="compare-title" eyebrow={COMPARISON.eyebrow} first={COMPARISON.title} align="center" />
          <p className="mt-5 text-muted">{COMPARISON.body}</p>
        </div>
        <div className="reveal mt-10 grid gap-5 lg:grid-cols-2">
          {card('legacy', false)}
          {card('velcoris', true)}
        </div>
      </div>
    </section>
  )
}

/** Datasheet: product switch + category tabs (ARIA tabs pattern, arrow-key support). */
function Datasheet() {
  const ref = useReveal()
  const uid = useId()
  const [prodIdx, setProdIdx] = useState(0)
  const [catIdx, setCatIdx] = useState(0)
  const product = DATASHEET.products[prodIdx]
  const cat = product.categories[catIdx]

  const onTabKey = (e, count, set, idx) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return
    e.preventDefault()
    const list = e.currentTarget.parentElement // read before React clears currentTarget
    let n = idx
    if (e.key === 'Home') n = 0
    else if (e.key === 'End') n = count - 1
    else n = (idx + (e.key === 'ArrowDown' || e.key === 'ArrowRight' ? 1 : -1) + count) % count
    set(n)
    requestAnimationFrame(() => list.children[n]?.focus())
  }

  return (
    <section ref={ref} aria-labelledby="specs-title" className="bg-surface py-14 md:py-20">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionHeading id="specs-title" eyebrow={DATASHEET.eyebrow} first={DATASHEET.title} align="center" />
          <p className="mt-5 text-muted">{DATASHEET.body}</p>
        </div>

        <div className="reveal mt-10 flex justify-center">
          <div role="tablist" aria-label="Product" className="inline-flex rounded-full border border-line bg-bg p-1">
            {DATASHEET.products.map((p, i) => (
              <button
                key={p.id}
                role="tab"
                type="button"
                aria-selected={prodIdx === i}
                tabIndex={prodIdx === i ? 0 : -1}
                onKeyDown={(e) => onTabKey(e, DATASHEET.products.length, (n) => { setProdIdx(n); setCatIdx(0) }, prodIdx)}
                onClick={() => { setProdIdx(i); setCatIdx(0) }}
                className={`min-h-11 rounded-full px-5 text-sm font-semibold transition-colors ${prodIdx === i ? 'bg-ink text-bg' : 'text-ink hover:text-accent'}`}
              >
                {p.name}
              </button>
            ))}
          </div>
        </div>

        <div className="reveal mt-10 grid gap-5 lg:grid-cols-[22rem_1fr]">
          <div role="tablist" aria-orientation="vertical" aria-label={`${product.name} categories`} className="flex flex-col gap-2">
            {product.categories.map((c, i) => (
              <button
                key={c.id}
                role="tab"
                type="button"
                id={`${uid}-tab-${c.id}`}
                aria-controls={`${uid}-panel`}
                aria-selected={catIdx === i}
                tabIndex={catIdx === i ? 0 : -1}
                onKeyDown={(e) => onTabKey(e, product.categories.length, setCatIdx, catIdx)}
                onClick={() => setCatIdx(i)}
                className={`rounded-2xl border p-5 text-left transition-colors ${
                  catIdx === i ? 'hex-pattern border-transparent bg-band text-band-ink' : 'border-line bg-bg text-ink hover:border-line-strong'
                }`}
              >
                <span className={`block font-mono text-xs uppercase tracking-[0.1em] ${catIdx === i ? 'text-band-muted' : 'text-muted'}`}>{c.label}</span>
                <span className="mt-1 block font-semibold">{c.title}</span>
              </button>
            ))}
          </div>

          <div id={`${uid}-panel`} role="tabpanel" aria-labelledby={`${uid}-tab-${cat.id}`} className="rounded-3xl border border-line bg-bg p-7 md:p-9">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="eyebrow">{cat.label}</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink">{cat.title}</h3>
                <p className="mt-1 text-sm text-muted">Output: {product.name}</p>
              </div>
              <a href="/contact?intent=datasheet" className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line px-4 text-sm font-semibold text-accent transition-colors hover:border-accent">
                <Download className="size-4" aria-hidden="true" /> Request Datasheet
              </a>
            </div>
            <dl className="mt-8 grid gap-x-10 sm:grid-cols-2">
              {cat.specs.map(([k, v]) => (
                <div key={k} className="border-t border-line py-4">
                  <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{k}</dt>
                  <dd className="mt-1.5 font-medium text-ink">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>
    </section>
  )
}

function QualityGates() {
  const ref = useReveal()
  const icons = [Activity, Layers, ChartColumn]
  return (
    <section ref={ref} aria-labelledby="quality-title" className="bg-bg py-14 md:py-20">
      <div className="container-x">
        <div className="reveal mx-auto max-w-3xl text-center">
          <SectionHeading id="quality-title" eyebrow={QUALITY.eyebrow} first={QUALITY.title} align="center" />
          <p className="mt-5 text-muted">{QUALITY.body}</p>
        </div>
        <ul className="reveal mt-10 grid gap-5 md:grid-cols-3">
          {QUALITY.gates.map((g, i) => {
            const Icon = icons[i]
            return (
              <li key={g.n} className="flex flex-col rounded-3xl border border-line bg-surface p-7">
                <div className="flex items-start justify-between">
                  <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Quality gate {g.n}</p>
                  <span className="grid size-10 place-items-center rounded-lg bg-band text-band-ink">
                    <Icon className="size-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-6 text-xl font-semibold text-ink">{g.title}</h3>
                <p className="mt-1 font-mono text-sm text-ink">{g.spec}</p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-muted">{g.body}</p>
                <p className="mt-6 flex items-center gap-2 border-t border-line pt-4 text-xs text-muted">
                  <CircleCheck className="size-3.5" aria-hidden="true" /> {QUALITY.footnote}
                </p>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

/** FAQ as a collapsed accordion (reference: WLX): questions only, answers open on demand. */
function Faq() {
  const ref = useReveal()
  const uid = useId()
  const [open, setOpen] = useState(-1)
  return (
    <section ref={ref} aria-labelledby="faq-title" className="bg-bg py-14 md:py-20">
      <div className="container-x">
        <div className="reveal max-w-3xl">
          <SectionHeading id="faq-title" eyebrow={FAQ.eyebrow} first={FAQ.title} size="md" />
        </div>
        <ul className="reveal mt-12 border-t border-line">
          {FAQ.items.map(([q, a], i) => {
            const isOpen = open === i
            return (
              <li key={q} className="border-b border-line">
                <h3 className="font-sans text-base tracking-normal">
                  <button
                    type="button"
                    id={`${uid}-q${i}`}
                    aria-expanded={isOpen}
                    aria-controls={`${uid}-a${i}`}
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="group flex w-full items-center justify-between gap-6 py-6 text-left text-[clamp(1.125rem,1.8vw,1.5rem)] font-medium text-ink transition-colors hover:text-muted"
                  >
                    {q}
                    <ChevronDown
                      className={`size-5 shrink-0 text-ink transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </h3>
                <div
                  id={`${uid}-a${i}`}
                  role="region"
                  aria-labelledby={`${uid}-q${i}`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out ${isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}
                >
                  <div className="overflow-hidden" inert={!isOpen}>
                    <p className="max-w-3xl pb-6 text-muted">{a}</p>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}

function TechCta() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="tech-cta-title" className="bg-surface py-12 md:py-16">
      <div className="container-x">
        <div className="reveal hex-pattern rounded-3xl bg-band px-6 py-16 text-center sm:px-12 md:py-20">
          <SectionHeading id="tech-cta-title" eyebrow={TECH_CTA.eyebrow} first={TECH_CTA.first} second={TECH_CTA.second} align="center" tone="band" />
          <p className="mx-auto mt-5 max-w-2xl text-band-muted">{TECH_CTA.body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={SAMPLE_HREF} className="btn-primary">
              Request Evaluation Sample <ArrowRight />
            </a>
            <a
              href="/contact?intent=consultation"
              className="inline-flex min-h-11 items-center rounded-full border border-band-line px-5 font-semibold text-band-ink transition-colors hover:border-band-link hover:text-band-link"
            >
              Technical Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Technology() {
  return (
    <>
      <TechHero />
      <TechStats />
      <ProcessStack />
      <Comparison />
      <Datasheet />
      <QualityGates />
      <DispersionFolders />
      <Faq />
      <TechCta />
    </>
  )
}
