import { Mail, MapPin, Phone } from 'lucide-react'
import { CONTACT, NAV, SAMPLE_HREF } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { ArrowRight } from './icons'
import Logo from './Logo'
import SectionHeading from './SectionHeading'

/** Replica of the original "Future vision" closing section. */
export function FutureVision() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="vision-title" className="bg-surface py-20 md:py-24">
      <div className="container-x">
        <div className="reveal hex-pattern rounded-3xl bg-band px-6 py-16 text-center shadow-2xl shadow-black/20 sm:px-12 md:py-20">
          <SectionHeading
            id="vision-title"
            eyebrow="Future vision"
            first="Position India as the global"
            second="advanced materials hub."
            align="center"
            tone="band"
          />
          <p className="mx-auto mt-5 max-w-2xl text-band-muted">
            Partner with Velcoris to integrate high-purity graphene into your production lines at disruptive commercial
            scale, with a sovereign, domestic supply guarantee.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <a href={SAMPLE_HREF} className="btn-primary">
              Request Graphene Sample <ArrowRight />
            </a>
            <a
              href="/applications"
              className="inline-flex min-h-11 items-center rounded-full border border-band-line px-5 font-semibold text-band-ink transition-colors hover:border-band-link hover:text-band-link"
            >
              Explore Industrial Solutions
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4z" />
    </svg>
  )
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[1.125rem]" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
    </svg>
  )
}

/** Replica of the original footer (dark, hex texture). */
export default function Footer() {
  return (
    <footer className="hex-pattern bg-band text-band-ink">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo className="h-9 w-auto text-band-ink" />
          <p className="mt-6 max-w-sm text-sm leading-relaxed text-band-muted">
            Reinventing industrial graphene production. Building India into a global hub for next-generation manufacturing
            and sovereign supply.
          </p>
          <ul className="mt-6 flex gap-3">
            {[
              ['LinkedIn', CONTACT.linkedin, LinkedInIcon],
              ['Instagram', CONTACT.instagram, InstagramIcon],
            ].map(([label, href, Icon]) => (
              <li key={label}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${label} (opens in a new tab)`}
                  className="grid size-11 place-items-center rounded-full border border-band-line text-band-ink transition-colors hover:border-band-link hover:text-band-link"
                >
                  <Icon />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav aria-label="Footer" className="md:col-span-3">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-band-muted">Explore</p>
          <ul className="mt-5 space-y-1">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="inline-flex min-h-10 items-center text-band-ink transition-colors hover:text-band-link">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="md:col-span-4">
          <p className="font-mono text-xs uppercase tracking-[0.12em] text-band-muted">Contacts</p>
          <ul className="mt-5 space-y-1">
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-flex min-h-10 items-center gap-3 text-band-link hover:underline">
                <Mail className="size-4 text-band-muted" aria-hidden="true" /> {CONTACT.email}
              </a>
            </li>
            <li>
              <a href={CONTACT.phoneHref} className="inline-flex min-h-10 items-center gap-3 text-band-link hover:underline">
                <Phone className="size-4 text-band-muted" aria-hidden="true" /> {CONTACT.phone}
              </a>
            </li>
            <li className="flex min-h-10 items-center gap-3 text-band-muted">
              <MapPin className="size-4" aria-hidden="true" /> {CONTACT.address}
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-band-line">
        <p className="container-x py-6 text-center text-sm text-band-muted">© 2026 Velcoris Industries. All rights reserved.</p>
      </div>
    </footer>
  )
}
