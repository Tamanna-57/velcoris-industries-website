import { SAMPLE_HREF, STEPS } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { ArrowRight } from './icons'

/**
 * Work with us. Was three long cards with three different CTAs; now a three-step
 * timeline with one action.
 */
export default function Steps() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="steps-title" className="bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-end justify-between gap-8">
          <div className="max-w-2xl">
            <p className="eyebrow">Work with us</p>
            <h2 id="steps-title" className="mt-4 text-[clamp(2.25rem,4.6vw,3.75rem)] text-ink">From sample to supply in three steps.</h2>
          </div>
          <a href={SAMPLE_HREF} className="btn-primary">
            Request a sample <ArrowRight />
          </a>
        </div>

        <ol className="reveal relative mt-16 grid gap-10 md:grid-cols-3 md:gap-8">
          {/* connecting rail (desktop) */}
          <span className="absolute left-0 right-0 top-[1.375rem] hidden h-px bg-line-strong md:block" aria-hidden="true" />
          {STEPS.map((s) => (
            <li key={s.n} className="relative">
              <span className="relative z-10 grid size-11 place-items-center rounded-full border border-line-strong bg-surface font-mono text-sm text-ink">
                {s.n}
              </span>
              <h3 className="mt-6 text-2xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-2 max-w-[22rem] text-muted">{s.line}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
