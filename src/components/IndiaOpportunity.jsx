import { ArrowUpRight, Award, Globe, TrendingUp } from 'lucide-react'
import { useReveal } from '../lib/hooks'
import SectionHeading from './SectionHeading'

const STATS = [
  { label: 'Import dependency', value: '92%', note: 'Of India’s graphene demand' },
  { label: 'Cost advantage', value: '11×', note: 'vs import pricing' },
  { label: 'Market at stake', value: '₹2,400Cr', note: 'Annual import bill' },
]

const POINTS = [
  {
    icon: TrendingUp,
    title: 'Pricing That Unlocks Industry',
    text: 'At import prices, graphene is a lab curiosity. At Velcoris prices, it becomes an industrial input, viable at tonnage volume.',
  },
  {
    icon: Globe,
    title: 'Domestic Supply Assurance',
    text: 'A sovereign graphene supply chain eliminates exposure to Chinese import volatility, tariff risk, and geopolitical disruption.',
  },
  {
    icon: Award,
    title: 'Make in India, for India',
    text: 'End-to-end domestic production from feedstock to finished material, strengthening national advanced materials capability.',
  },
]

/** Replica of the original "India's strategic opportunity" section. */
export default function IndiaOpportunity() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="india-title" className="hex-pattern bg-band py-14 md:py-20">
      <div className="container-x grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-14">
        <div className="reveal">
          <SectionHeading
            id="india-title"
            eyebrow="India’s strategic opportunity"
            first="Graphene is revolutionary."
            second="It has been inaccessible."
            tone="band"
            size="md"
          />
          <p className="mt-6 text-band-muted">
            India imports over 92% of its graphene demand, predominantly from China, at costs that place the material out
            of reach for all but the most well-funded research labs. Critical industries that could benefit most have been
            locked out entirely.
          </p>
          <p className="mt-4 text-band-muted">
            Velcoris has re-engineered production from the ground up. The result: graphene that is over{' '}
            <strong className="font-semibold text-band-ink">11× more affordable</strong> than import pricing, making
            domestic industrial adoption viable for the first time.
          </p>

          <dl className="mt-10 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-col rounded-xl border border-band-line bg-band-card p-5">
                <dt className="order-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-band-muted">{s.label}</dt>
                <dd className="order-2 mt-3 font-display text-3xl font-semibold tracking-tight text-band-ink">{s.value}</dd>
                <dd className="order-3 mt-1 text-sm text-band-muted">{s.note}</dd>
              </div>
            ))}
          </dl>
        </div>

        {/* "Why now, why India" card */}
        <div className="reveal rounded-2xl bg-bg p-7 text-ink shadow-2xl shadow-black/30 md:p-9">
          <p className="eyebrow">The opportunity</p>
          <h3 className="mt-3 text-[1.75rem] font-semibold">Why now, why India</h3>
          <p className="mt-3 text-muted">
            As India accelerates across defence, EV, aerospace, and smart infrastructure, the demand for advanced materials
            is growing faster than imports can sustain. At prices the market cannot bear.
          </p>
          <ul className="mt-8 space-y-6">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line text-ink">
                  <Icon className="size-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <h4 className="font-sans text-base font-semibold tracking-normal">{title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
            <p className="text-sm text-muted">B2B &amp; B2G supply available</p>
            <a href="/contact" className="link-accent text-sm">
              Inquire <ArrowUpRight className="size-4" aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
