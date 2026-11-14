import { useState } from 'react'
import { APPLICATIONS } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { ArrowUpRight } from './icons'

/**
 * Industries. New on the homepage: routes each buyer type straight to what matters to
 * them (reference: Anduril's Sea / Land / Air / Space split). On desktop the hovered
 * tile widens to reveal one line; on mobile every tile shows its line.
 */
export default function Applications() {
  const [active, setActive] = useState(0)
  const ref = useReveal()

  return (
    <section ref={ref} aria-labelledby="apps-title" className="bg-[var(--apps-bg)] py-24 text-[var(--apps-ink)] md:py-32">
      <div className="container-x">
        <div className="reveal flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] opacity-80">Applications</p>
            <h2 id="apps-title" className="mt-4 text-[clamp(2.25rem,4.6vw,3.75rem)]">Where our graphene goes to work.</h2>
          </div>
          <a
            href="/applications"
            className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-[var(--apps-link)] underline decoration-transparent underline-offset-[0.3em] transition-colors hover:decoration-current"
          >
            All applications <ArrowUpRight />
          </a>
        </div>

        <ul className="reveal mt-14 flex flex-col gap-3 lg:h-[26rem] lg:flex-row">
          {APPLICATIONS.map((app, i) => {
            const on = active === i
            return (
              <li
                key={app.id}
                className={`transition-[flex-grow] duration-500 ease-out lg:min-w-0 lg:basis-0 ${on ? 'lg:grow-[2.4]' : 'lg:grow'}`}
              >
                <a
                  href={`/applications#${app.id}`}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl border p-6 transition-colors duration-300 lg:p-7 ${
                    on ? 'border-transparent bg-[var(--apps-tile-on)]' : 'border-[var(--apps-line)] bg-transparent'
                  }`}
                >
                  <span className="flex items-start justify-between gap-4">
                    <span className="font-mono text-xs tracking-[0.12em] opacity-80">{String(i + 1).padStart(2, '0')}</span>
                    <span
                      className={`grid size-10 place-items-center rounded-full transition-colors ${
                        on ? 'bg-accent-strong text-on-accent' : 'border border-[var(--apps-line)]'
                      }`}
                    >
                      <ArrowUpRight />
                    </span>
                  </span>
                  <span className="mt-10 block lg:mt-0">
                    <span className="block font-display text-2xl font-semibold tracking-[-0.025em] lg:whitespace-nowrap lg:text-[1.75rem]">{app.name}</span>
                    <span
                      className={`mt-2 block max-w-[22rem] text-[0.9375rem] leading-relaxed opacity-85 transition-opacity duration-300 ${
                        on ? 'lg:opacity-85' : 'lg:opacity-0'
                      }`}
                    >
                      {app.line}
                    </span>
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
