import MatrixOptimizer from '../components/MatrixOptimizer'
import SectionHeading from '../components/SectionHeading'
import SectorRows from '../components/SectorRows'
import { FlaskConical, Microscope, ArrowRight } from 'lucide-react'
import { ArrowRight as ArrowIcon } from '../components/icons'
import { APPS_HERO } from '../lib/applications'
import { SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { APPS_CTA, PATHWAY } from '../lib/optimizer'

/* Applications page. Hero, Matrix Optimizer, integration pathway and CTA replicate the
   original; only the sector list is redesigned (WLX reference). */

function AppsHero() {
  return (
    <section aria-labelledby="apps-title" className="hex-pattern-light bg-bg pb-20 pt-[calc(72px+5rem)] md:pb-28 md:pt-[calc(72px+7rem)]">
      <div className="container-x">
        <p className="eyebrow">{APPS_HERO.eyebrow}</p>
        <h1 id="apps-title" className="mt-5 max-w-5xl text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
          <span className="block">{APPS_HERO.first}</span>
          <span className="block font-light">{APPS_HERO.second}</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-muted">{APPS_HERO.body}</p>
      </div>
    </section>
  )
}

/** Commercial integration pathway, replicated from the original: three cards with number,
    icon, title, text and tags. */
function Pathway() {
  const ref = useReveal()
  const icons = [FlaskConical, Microscope, ArrowRight]
  return (
    <section ref={ref} aria-labelledby="pathway-title" className="bg-bg py-24 md:py-28">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionHeading id="pathway-title" eyebrow={PATHWAY.eyebrow} first="From evaluation to" second="plant-scale production." align="center" />
          <p className="mt-5 text-muted">{PATHWAY.body}</p>
        </div>
        <ol className="reveal mt-14 grid gap-6 md:grid-cols-3">
          {PATHWAY.steps.map((st, i) => {
            const Icon = icons[i]
            return (
              <li
                key={st.title}
                className="flex flex-col rounded-3xl border border-line bg-bg p-8 transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-18px_rgba(0,0,0,0.25)]"
              >
                <div className="flex items-start justify-between">
                  <span className="font-[family-name:var(--font-num)] text-3xl font-light text-muted">{String(i + 1).padStart(2, '0')}</span>
                  <span className="grid size-11 place-items-center rounded-xl bg-ink text-bg">
                    <Icon className="size-5" strokeWidth={1.7} aria-hidden="true" />
                  </span>
                </div>
                <h3 className="mt-7 text-xl font-semibold text-ink">{st.title}</h3>
                <p className="mt-3 flex-1 text-[0.9375rem] leading-relaxed text-muted">{st.text}</p>
                <p className="mt-8 border-t border-line pt-6 font-mono text-xs uppercase leading-relaxed tracking-[0.1em] text-muted">{st.tags.join(' · ')}</p>
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}

function AppsCta() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="apps-cta-title" className="bg-surface py-20 md:py-24">
      <div className="container-x">
        <div className="reveal hex-pattern rounded-3xl bg-band px-6 py-16 text-center sm:px-12 md:py-20">
          <SectionHeading id="apps-cta-title" eyebrow={APPS_CTA.eyebrow} first={APPS_CTA.first} second={APPS_CTA.second} align="center" tone="band" />
          <p className="mx-auto mt-5 max-w-2xl text-band-muted">{APPS_CTA.body}</p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={SAMPLE_HREF} className="btn-primary">
              Request Evaluation Sample <ArrowIcon />
            </a>
            <a href="/contact?intent=consultation" className="inline-flex min-h-11 items-center rounded-full border border-band-line px-5 font-semibold text-band-ink transition-colors hover:border-band-link hover:text-band-link">
              Technical Consultation
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Applications() {
  return (
    <>
      <AppsHero />
      <SectorRows />
      <MatrixOptimizer />
      <Pathway />
      <AppsCta />
    </>
  )
}
