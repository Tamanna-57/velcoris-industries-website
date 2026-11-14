import { ArrowUpRight, Box, FlaskConical, Users } from 'lucide-react'
import { SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import SectionHeading from './SectionHeading'

const STEPS = [
  {
    n: '01',
    icon: FlaskConical,
    title: 'Get Your Samples',
    text: 'Request high-purity graphene samples with full characterization data: Raman spectroscopy, TEM imaging, particle size distributions. Evaluate in your own lab, on your own terms.',
    cta: 'Request Samples',
    href: SAMPLE_HREF,
  },
  {
    n: '02',
    icon: Users,
    title: 'Formulate Together',
    text: 'Our materials team works alongside your engineers to optimise graphene integration for your specific application, from dispersion parameters to performance targets.',
    cta: 'Discuss Application',
    href: '/contact?intent=application',
  },
  {
    n: '03',
    icon: Box,
    title: 'Scale with Confidence',
    text: 'Move from validated lab results to consistent production-scale supply. Domestic sourcing means no import delays, no geopolitical risk, and pricing that works at volume.',
    cta: 'Explore Supply',
    href: '/contact?intent=supply',
  },
]

/** Replica of the original "Work with us" section. */
export default function WorkWithUs() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="work-title" className="bg-bg py-24 md:py-28">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionHeading
            id="work-title"
            eyebrow="Work with us"
            first="Three steps from sample"
            second="to production supply."
            align="center"
          />
          <p className="mt-5 text-muted">
            We work directly with manufacturers, R&amp;D teams, and government procurement, moving efficiently from first
            contact to long-term supply partnership.
          </p>
        </div>

        <ol className="reveal mt-14 grid gap-5 md:grid-cols-3">
          {STEPS.map(({ icon: Icon, ...s }) => (
            <li key={s.n} className="flex flex-col rounded-2xl border border-line bg-surface p-7">
              <div className="flex items-start justify-between">
                <span className="font-display text-3xl font-light text-muted">{s.n}</span>
                <span className="grid size-10 place-items-center rounded-lg border border-line bg-bg text-ink">
                  <Icon className="size-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
                </span>
              </div>
              <h3 className="mt-6 text-xl font-semibold text-ink">{s.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted">{s.text}</p>
              <a href={s.href} className="link-accent mt-6 self-start text-sm">
                {s.cta} <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
