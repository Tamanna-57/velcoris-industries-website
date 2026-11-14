import { useState } from 'react'
import { SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { FormulateIso, SampleIso, ScaleIso } from './IsoDiagrams'
import SectionHeading from './SectionHeading'
import { ArrowRight } from './icons'

const STEPS = [
  {
    n: '01',
    title: 'Get Your Samples',
    text: 'Request high-purity graphene samples with full characterization data: Raman spectroscopy, TEM imaging, particle size distributions. Evaluate in your own lab, on your own terms.',
    cta: 'Request Samples',
    href: SAMPLE_HREF,
    Diagram: SampleIso,
  },
  {
    n: '02',
    title: 'Formulate Together',
    text: 'Our materials team works alongside your engineers to optimise graphene integration for your specific application, from dispersion parameters to performance targets.',
    cta: 'Discuss Application',
    href: '/contact?intent=application',
    Diagram: FormulateIso,
  },
  {
    n: '03',
    title: 'Scale with Confidence',
    text: 'Move from validated lab results to consistent production-scale supply. Domestic sourcing means no import delays, no geopolitical risk, and pricing that works at volume.',
    cta: 'Explore Supply',
    href: '/contact?intent=supply',
    Diagram: ScaleIso,
  },
]

/**
 * "Work with us" (reference: RSAShield "How it works").
 * Was three equal cards. Now three alternating rows: number + title, the original text and its
 * button on one side, an interactive isometric diagram on the other. Hovering or focusing a row
 * animates its diagram.
 */
export default function WorkWithUs() {
  const ref = useReveal()
  const [hover, setHover] = useState(-1)
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

        <ol className="mt-16 space-y-20 md:mt-20 md:space-y-28">
          {STEPS.map(({ Diagram, ...s }, i) => (
            <li
              key={s.n}
              className="reveal grid items-center gap-10 md:grid-cols-2 md:gap-16"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(-1)}
              onFocus={() => setHover(i)}
              onBlur={() => setHover(-1)}
            >
              <div className={i % 2 ? 'md:order-2' : ''}>
                <h3 className="text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                  <span className="font-light text-muted">{s.n}.</span> {s.title}
                </h3>
                <p className="mt-5 max-w-lg text-lg text-muted">{s.text}</p>
                <a href={s.href} className="btn-primary mt-8">
                  {s.cta} <ArrowRight />
                </a>
              </div>
              <div className={`flex justify-center ${i % 2 ? 'md:order-1' : ''}`}>
                <Diagram active={hover === i} />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
