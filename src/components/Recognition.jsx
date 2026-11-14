import { Heart, Landmark } from 'lucide-react'
import { useReveal } from '../lib/hooks'
import SectionHeading from './SectionHeading'

const AWARDS = [
  {
    icon: Landmark,
    badge: 'Stage 2 nominee',
    org: 'Forbes India',
    title: 'DGEMS 2025 Select 200',
    text: 'Nominated as one of India’s most promising Digital Giants & Emerging Market Startups, a national shortlist of 200 across all sectors.',
  },
  {
    icon: Heart,
    badge: 'National Top 100',
    org: 'Samsung',
    title: 'Solve for Tomorrow 2025',
    text: 'Shortlisted nationally in the Top 100 for developing high-grade graphene with an explicit focus on environmental sustainability and domestic supply security.',
  },
]

const FACTS = [
  { value: '2025', label: 'Year founded' },
  { value: '45+', label: 'Team members' },
  { value: 'B2B+B2G', label: 'Business model' },
  { value: 'Greater Noida', label: 'Facility' },
]

/** Replica of the original "Recognition" section (content and layout unchanged). */
export default function Recognition() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="recognition-title" className="hex-pattern bg-band py-24 md:py-28">
      <div className="container-x">
        <div className="reveal">
          <SectionHeading
            id="recognition-title"
            eyebrow="Recognition"
            first="Recognised by the world’s"
            second="most demanding selectors."
            align="center"
            tone="band"
          />
        </div>

        <ul className="reveal mx-auto mt-14 grid max-w-4xl gap-5 md:grid-cols-2">
          {AWARDS.map(({ icon: Icon, ...a }) => (
            <li key={a.title} className="rounded-2xl border border-band-line bg-band-card p-7">
              <div className="flex items-start justify-between gap-4">
                <span className="grid size-11 place-items-center rounded-xl bg-white/10 text-band-ink">
                  <Icon className="size-5" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <span className="rounded-full border border-band-line px-3 py-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] text-band-muted">
                  {a.badge}
                </span>
              </div>
              <p className="mt-6 font-mono text-xs uppercase tracking-[0.12em] text-band-muted">{a.org}</p>
              <h3 className="mt-2 text-2xl font-semibold text-band-ink">{a.title}</h3>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-band-muted">{a.text}</p>
            </li>
          ))}
        </ul>

        <dl className="reveal mx-auto mt-14 grid max-w-4xl grid-cols-2 gap-y-8 text-center md:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="mt-1 font-mono text-xs uppercase tracking-[0.12em] text-band-muted">{f.label}</dt>
              <dd className="font-display text-2xl font-semibold text-band-ink">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
