import { useEffect, useState } from 'react'
import { OPPORTUNITY } from '../lib/content'
import { useInView, useReducedMotion } from '../lib/hooks'

function CountUp({ to, run, duration = 1200 }) {
  const reduced = useReducedMotion()
  const [n, setN] = useState(0)
  useEffect(() => {
    if (!run || reduced) return
    let raf
    const t0 = performance.now()
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / duration)
      setN(Math.round(to * (1 - Math.pow(1 - p, 3))))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [run, to, duration, reduced])
  return (reduced ? to : n).toLocaleString('en-IN')
}

/**
 * India opportunity. Was: two paragraphs + three stat tiles + three bullet cards that
 * repeated each other. Now: the three numbers carry the argument, one caption each.
 */
export default function Opportunity() {
  const [ref, inView] = useInView('0px 0px -15% 0px')
  return (
    <section ref={ref} aria-labelledby="opp-title" className="bg-surface py-24 md:py-32">
      <div className="container-x">
        <div className="grid gap-6 md:grid-cols-12 md:items-end">
          <div className="md:col-span-7">
            <p className="eyebrow">India’s strategic opportunity</p>
            <h2 id="opp-title" className="mt-4 text-[clamp(2.25rem,4.6vw,3.75rem)] text-ink">
              India imports its graphene. We make it here.
            </h2>
          </div>
          <p className="text-lg text-muted md:col-span-4 md:col-start-9">
            A sovereign supply chain for defence, EV, aerospace and infrastructure, priced for industrial volume.
          </p>
        </div>

        <dl className="mt-16 grid border-t border-line md:grid-cols-3">
          {OPPORTUNITY.map((s) => (
            <div key={s.label} className="flex flex-col-reverse border-b border-line py-10 md:border-b-0 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0">
              <dt className="mt-3 max-w-[18rem] text-base text-muted">{s.label}</dt>
              <dd className="whitespace-nowrap font-display text-[clamp(3.25rem,5.4vw,5.25rem)] font-semibold leading-none tracking-[-0.045em] text-ink tabular-nums">
                {s.prefix}
                <CountUp to={s.value} run={inView} />
                <span className="text-[0.55em] tracking-[-0.02em]">{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
