import { Award, Leaf, ShieldCheck } from 'lucide-react'
import { useReveal } from '../lib/hooks'
import SectionHeading from './SectionHeading'

const POINTS = [
  {
    icon: ShieldCheck,
    title: 'Zero Liquid Effluent',
    text: 'The Greater Noida facility operates with a completely clean effluent profile: no liquid waste, no discharge.',
  },
  {
    icon: Leaf,
    title: 'Cleaner Than Imports',
    text: 'Domestic production eliminates the environmental footprint of long-haul chemical imports from overseas suppliers.',
  },
  {
    icon: Award,
    title: 'No Toxic Chemical Inputs',
    text: 'Unlike conventional routes relying on corrosive acids, our process is clean from feedstock to finished material.',
  },
]

/** Replica of the original "Clean production" section. */
export default function CleanProduction() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="clean-title" className="bg-surface py-24 md:py-28">
      <div className="container-x grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
        <div className="reveal">
          <SectionHeading id="clean-title" eyebrow="Clean production" first="Engineered clean," second="built to scale." />
          <p className="mt-6 max-w-xl text-muted">
            Our proprietary synthesis route was designed from the ground up to eliminate the toxic byproducts that plague
            conventional graphene production, while maintaining structural integrity at any batch volume.
          </p>
          <ul className="mt-10 space-y-6">
            {POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-bg text-ink">
                  <Icon className="size-[1.125rem]" strokeWidth={1.6} aria-hidden="true" />
                </span>
                <div>
                  <h3 className="font-sans text-base font-semibold tracking-normal text-ink">{title}</h3>
                  <p className="mt-1 max-w-lg text-sm leading-relaxed text-muted">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <figure className="reveal rounded-2xl border border-line bg-bg p-3 shadow-xl shadow-black/5">
          <img
            src="/media/greater-noida-lab.webp"
            alt="Velcoris graphene research and development laboratory in Greater Noida"
            width="668"
            height="418"
            loading="lazy"
            decoding="async"
            className="aspect-[16/10] w-full rounded-xl object-cover"
          />
          <figcaption className="flex items-center justify-between px-2 pb-1 pt-4">
            <span className="text-sm text-muted">Greater Noida R&amp;D Plant</span>
            <span className="rounded-full border border-line px-3 py-1 text-xs font-medium text-ink">Zero Liquid Effluent</span>
          </figcaption>
        </figure>
      </div>
    </section>
  )
}
