import { SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import SectionHeading from './SectionHeading'
import StepRows from './StepRows'

const STEPS = [
  {
    title: 'Get Your Samples',
    text: 'Request high-purity graphene samples with full characterization data: Raman spectroscopy, TEM imaging, particle size distributions. Evaluate in your own lab, on your own terms.',
    cta: 'Request Samples',
    href: SAMPLE_HREF,
  },
  {
    title: 'Formulate Together',
    text: 'Our materials team works alongside your engineers to optimise graphene integration for your specific application, from dispersion parameters to performance targets.',
    cta: 'Discuss Application',
    href: '/contact?intent=application',
  },
  {
    title: 'Scale with Confidence',
    text: 'Move from validated lab results to consistent production-scale supply. Domestic sourcing means no import delays, no geopolitical risk, and pricing that works at volume.',
    cta: 'Explore Supply',
    href: '/contact?intent=supply',
  },
]

/** Homepage "Work with us" (reference: RSAShield "How it works"). */
export default function WorkWithUs() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="work-title" className="bg-bg py-12 md:py-16">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionHeading id="work-title" eyebrow="Work with us" first="Three steps from sample" second="to production supply." align="center" />
          <p className="mt-5 text-muted">
            We work directly with manufacturers, R&amp;D teams, and government procurement, moving efficiently from first
            contact to long-term supply partnership.
          </p>
        </div>
        <StepRows steps={STEPS} />
      </div>
    </section>
  )
}
