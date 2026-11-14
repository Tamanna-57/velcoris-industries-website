import { useId, useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { MATRICES, OPTIMIZER_INTRO, PROPERTIES, modelValue } from '../lib/optimizer'
import { useReveal } from '../lib/hooks'
import SectionHeading from './SectionHeading'
import { ArrowRight } from './icons'

const fmtNum = (o, v) => `${o.sign}${o.decimals ? v.toFixed(o.decimals) : Math.round(v).toLocaleString('en-IN')}`

/**
 * Interactive Matrix Optimizer, replicated from the original Applications page:
 * pick a host matrix, a target property and a graphene loading; the three outputs,
 * window status and interfacial mechanism update live.
 */
export default function MatrixOptimizer() {
  const ref = useReveal()
  const uid = useId()
  const [mIdx, setMIdx] = useState(0)
  const [prop, setProp] = useState(0)
  const m = MATRICES[mIdx]
  const [x, setX] = useState(m.start)

  const [a, b] = m.window
  const zone = x < a ? 'below' : x > b ? 'above' : 'optimal'
  const mech = m.mechanisms[prop]
  const pct = ((x - m.min) / (m.max - m.min)) * 100
  const winL = ((a - m.min) / (m.max - m.min)) * 100
  const winR = ((b - m.min) / (m.max - m.min)) * 100

  const status = {
    optimal: { dot: 'bg-[#2f9e6b]', text: `Optimal ${mech[0]} Window` },
    below: { dot: 'bg-[#c9871f]', text: 'Below percolation threshold: increase loading' },
    above: { dot: 'bg-[#c9871f]', text: 'Above optimal window: agglomeration risk' },
  }[zone]

  const firstSub = { optimal: 'At current loading', below: 'Below percolation threshold', above: 'Degraded by clumping' }[zone]
  const subs = [firstSub, 'Thermal pathways', 'Functional gain']

  return (
    <section ref={ref} aria-labelledby="optimizer-title" className="bg-surface py-24 md:py-28">
      <div className="container-x">
        <div className="reveal max-w-3xl">
          <SectionHeading id="optimizer-title" eyebrow={OPTIMIZER_INTRO.eyebrow} first={OPTIMIZER_INTRO.title} />
          <p className="mt-5 text-muted">{OPTIMIZER_INTRO.body}</p>
        </div>

        <div className="reveal mt-12 grid gap-5 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
          {/* controls */}
          <div className="rounded-3xl border border-line bg-bg p-7 md:p-9">
            <label htmlFor={`${uid}-matrix`} className="eyebrow block">1. Host matrix system</label>
            <div className="relative mt-3">
              <select
                id={`${uid}-matrix`}
                value={m.id}
                onChange={(e) => {
                  const i = MATRICES.findIndex((mm) => mm.id === e.target.value)
                  setMIdx(i)
                  setX(MATRICES[i].start)
                }}
                className="h-12 w-full appearance-none rounded-xl border border-line bg-bg pl-4 pr-10 text-ink outline-none focus-visible:border-accent"
              >
                {MATRICES.map((mm) => (
                  <option key={mm.id} value={mm.id}>{mm.name}</option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 size-4 -translate-y-1/2 text-muted" aria-hidden="true" />
            </div>
            <p className="mt-3 text-sm text-muted">{m.note}</p>

            <p className="eyebrow mt-8" id={`${uid}-prop`}>2. Primary target property</p>
            <div role="radiogroup" aria-labelledby={`${uid}-prop`} className="mt-3 grid grid-cols-3 gap-2">
              {PROPERTIES.map((p, i) => (
                <button
                  key={p}
                  type="button"
                  role="radio"
                  aria-checked={prop === i}
                  onClick={() => setProp(i)}
                  className={`h-11 rounded-xl border text-sm font-medium transition-colors ${prop === i ? 'border-ink bg-ink text-bg' : 'border-line bg-bg text-ink hover:border-line-strong'}`}
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-8 flex items-center justify-between gap-4">
              <label htmlFor={`${uid}-load`} className="eyebrow">3. Graphene loading weight</label>
              <output htmlFor={`${uid}-load`} className="rounded-md bg-ink px-2.5 py-1 font-mono text-sm text-bg">{x.toFixed(2)} wt%</output>
            </div>
            <div className="relative mt-5">
              {/* optimal window band */}
              <div className="pointer-events-none absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-[#2f9e6b]/25" style={{ left: `${winL}%`, width: `${winR - winL}%` }} aria-hidden="true" />
              <input
                id={`${uid}-load`}
                type="range"
                min={m.min}
                max={m.max}
                step={m.step}
                value={x}
                onChange={(e) => setX(parseFloat(e.target.value))}
                aria-valuetext={`${x.toFixed(2)} weight percent, ${zone === 'optimal' ? 'within' : zone} the optimal window`}
                className="optimizer-range relative w-full"
                style={{ '--pct': `${pct}%` }}
              />
            </div>
            <div className="mt-2 flex justify-between font-mono text-xs text-muted">
              <span>{m.min.toFixed(2)} wt%</span>
              <span>Max {m.max.toFixed(2)} wt%</span>
            </div>
            <p className="mt-6 text-sm text-muted">
              Optimal window: <span className="font-mono text-ink">{a.toFixed(2)}% – {b.toFixed(2)}% wt%</span>
            </p>
            <p className="mt-4 flex items-center gap-2.5 border-t border-line pt-4 text-sm text-ink" aria-live="polite">
              <span className={`size-2 shrink-0 rounded-full ${status.dot}`} aria-hidden="true" /> {status.text}
            </p>
          </div>

          {/* model output */}
          <div className="flex flex-col rounded-3xl border border-line bg-bg p-7 md:p-9">
            <div className="flex flex-col gap-3 border-b border-line pb-6 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="eyebrow">Kinetic performance model</p>
                <h3 className="mt-2 text-2xl font-semibold text-ink md:text-[1.75rem]">{m.name}</h3>
              </div>
              <p className="text-sm text-muted sm:max-w-[15rem] sm:shrink-0 sm:text-right">{m.dispersion}</p>
            </div>

            <dl className="mt-6 grid gap-3 sm:grid-cols-3" aria-live="polite">
              {m.outputs.map((o, i) => {
                const on = prop === i
                return (
                  <div key={o.label} className={`flex flex-col rounded-2xl p-5 transition-colors ${on ? 'hex-pattern bg-band text-band-ink' : 'border border-line bg-surface text-ink'}`}>
                    <dt className={`order-1 font-mono text-[0.75rem] uppercase tracking-[0.1em] ${on ? 'text-band-muted' : 'text-muted'}`}>{o.label}</dt>
                    <dd className="order-2 mt-4 whitespace-nowrap font-display text-[clamp(1.75rem,2.6vw,2.25rem)] font-semibold tabular-nums tracking-tight">
                      {fmtNum(o, modelValue(m, o, x))}
                      <span className={o.unit.trim().length > 1 ? 'ml-1 text-base font-medium' : ''}>{o.unit.trim()}</span>
                    </dd>
                    <dd className={`order-3 mt-1 text-sm ${on ? 'text-band-muted' : 'text-muted'}`}>{subs[i]}</dd>
                  </div>
                )
              })}
            </dl>

            <div className="mt-5 rounded-2xl border border-line bg-surface p-5">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="eyebrow">Interfacial mechanism</p>
                <p className="text-sm font-semibold text-ink">{mech[0]}</p>
              </div>
              <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted">“{mech[1]}”</p>
            </div>

            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-6 text-sm">
              <span className="text-muted">Tested to ASTM / DIN standards · illustrative model</span>
              <a href={`/contact?intent=formulation&matrix=${m.id}`} className="link-accent">
                Discuss formulation with an engineer <ArrowRight />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
