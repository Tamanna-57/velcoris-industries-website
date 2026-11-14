import { useState } from 'react'
import { APPROACH } from '../lib/content'
import { useReveal } from '../lib/hooks'
import { VISUALS } from './ApproachVisuals'
import { ArrowRight } from './icons'

/**
 * "What sets us apart" (reference: coffee-tech.com "Our Approach").
 * Replaces three stacked, text-heavy cards with a scannable hover list:
 * the headlines sit on the right, the active one reveals one line + a key figure,
 * and the panel on the left swaps to a visual. Each row links to its detail page.
 */
export default function Approach() {
  const [active, setActive] = useState(0)
  const ref = useReveal()

  return (
    <section ref={ref} aria-labelledby="approach-title" className="bg-bg py-14 md:py-20">
      <div className="container-x">
        <div className="reveal max-w-2xl">
          <p className="eyebrow">What sets us apart</p>
          <h2 id="approach-title" className="mt-4 text-[clamp(2.25rem,4.6vw,3.75rem)] text-ink">
            Three advantages. One facility.
          </h2>
        </div>

        <div className="mt-10 grid gap-10 md:mt-12 md:grid-cols-12 md:gap-8">
          {/* Visual panel */}
          <div className="reveal md:col-span-5">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-[#0f1114] md:sticky md:top-28">
              {APPROACH.map((item, i) => {
                const Viz = VISUALS[item.id]
                return (
                  <div
                    key={item.id}
                    className="absolute inset-0 transition-opacity duration-500"
                    style={{ opacity: active === i ? 1 : 0 }}
                    aria-hidden={active !== i}
                  >
                    <Viz active={active === i} />
                  </div>
                )
              })}
            </div>
          </div>

          {/* Headline list */}
          <ul className="reveal md:col-span-6 md:col-start-7">
            {APPROACH.map((item, i) => {
              const on = active === i
              return (
                <li key={item.id}>
                  <a
                    href={item.href}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    className="group relative block py-7 outline-offset-4"
                  >
                    <span className="flex items-center justify-between gap-6">
                      <span
                        className={`font-display text-[clamp(2rem,3.6vw,3.25rem)] font-semibold leading-none tracking-[-0.035em] transition-colors duration-300 ${
                          on ? 'text-ink' : 'text-muted max-md:text-ink'
                        }`}
                      >
                        {item.title}
                      </span>
                      <span
                        className={`grid size-11 shrink-0 place-items-center rounded-full border transition-all duration-300 ${
                          on ? 'border-accent-strong bg-accent-strong text-on-accent' : 'border-line text-ink'
                        }`}
                      >
                        <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5" />
                      </span>
                    </span>

                    {/* Detail: open for the active row (always open on small screens) */}
                    <span
                      className={`grid transition-[grid-template-rows,opacity] duration-400 ease-out max-md:grid-rows-[1fr] max-md:opacity-100 ${
                        on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                      }`}
                    >
                      <span className="overflow-hidden">
                        <span className="flex flex-col gap-4 pt-5 sm:flex-row sm:items-end sm:justify-between">
                          <span className="max-w-[26rem] text-base text-muted">{item.line}</span>
                          <span className="shrink-0 text-left sm:text-right">
                            <span className="block font-display text-3xl font-semibold tracking-tight text-ink">{item.metric}</span>
                            <span className="block font-mono text-xs uppercase tracking-[0.08em] text-muted">{item.metricLabel}</span>
                          </span>
                        </span>
                      </span>
                    </span>

                    {/* Rule + active progress line */}
                    <span className="absolute inset-x-0 bottom-0 h-px bg-line" aria-hidden="true" />
                    <span
                      className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-[width] duration-500 ease-out ${on ? 'w-1/3' : 'w-0'}`}
                      aria-hidden="true"
                    />
                  </a>
                </li>
              )
            })}
          </ul>
        </div>
      </div>
    </section>
  )
}
