import { CONTACT, NAV, SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { ArrowRight, ArrowUpRight } from './icons'
import Logo from './Logo'

export function ClosingCTA() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="cta-title" className="bg-bg py-24 md:py-32">
      <div className="container-x">
        <div className="reveal relative overflow-hidden rounded-3xl bg-[#0a0b0d] px-6 py-16 text-center sm:px-12 md:py-24">
          <img
            src="/media/hero-lattice-960.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            width="960"
            height="540"
            className="absolute inset-0 h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(10,11,13,.65),rgba(10,11,13,.95))]" aria-hidden="true" />
          <div className="relative">
            <h2 id="cta-title" className="mx-auto max-w-3xl text-[clamp(2.25rem,5vw,4.25rem)] text-[#f3f4f6]">
              Bring graphene into your production line.
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-lg text-[#a9b0bb]">
              Samples ship with full characterisation data. Domestic supply, priced for volume.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              <a href={SAMPLE_HREF} className="btn-primary">
                Request a sample <ArrowRight />
              </a>
              <a
                href="/contact"
                className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-[#7da4ff] underline decoration-transparent underline-offset-[0.3em] transition-colors hover:decoration-current"
              >
                Talk to our team <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-line bg-bg">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="h-9 w-auto text-ink" />
          <p className="mt-6 max-w-sm text-muted">
            India’s industrial-scale graphene manufacturer, building a sovereign supply of advanced materials.
          </p>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="eyebrow">Explore</p>
          <ul className="mt-5 space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-10 items-center text-ink transition-colors hover:text-accent">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="eyebrow">Contact</p>
          <ul className="mt-5 space-y-1">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-10 items-center text-accent underline-offset-4 hover:underline">
                {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex min-h-10 items-center text-accent underline-offset-4 hover:underline">
                {CONTACT.phone}
              </a>
            </li>
            <li className="py-2 text-muted">{CONTACT.address}</li>
          </ul>
          <ul className="mt-4 flex gap-3">
            {[
              ['LinkedIn', CONTACT.linkedin],
              ['Instagram', CONTACT.instagram],
            ].map(([label, href]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-10 items-center gap-1 rounded-full border border-line px-4 text-sm font-medium text-ink transition-colors hover:border-accent hover:text-accent"
                >
                  {label} <ArrowUpRight className="size-3.5" />
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div className="border-t border-line">
        <div className="container-x flex flex-wrap justify-between gap-4 py-6 text-sm text-muted">
          <p>© 2026 Velcoris Industries. All rights reserved.</p>
          <p>Formerly Weber Innovations</p>
        </div>
      </div>
    </footer>
  )
}
