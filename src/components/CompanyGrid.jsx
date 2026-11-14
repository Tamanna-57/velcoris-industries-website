import { useEffect, useRef, useState } from 'react'
import { GRID_CARDS, GRID_INTRO, GRID_NOTES, GRID_STATS } from '../lib/company'
import { useInView, useReducedMotion } from '../lib/hooks'
import SectionHeading from './SectionHeading'

// Company "people powering the material" grid (reference: Loopsii grid).
// Desktop (lg+): 8 × 3 square-cell line grid; staggered white cards swap facts with a roll,
// blue hand-drawn notes and arrows draw in, and the original company stats count up on the
// right, pinned to grid intersections. Below lg it becomes a 2-column card grid + stats.

const TONES = ['#dbe3f6', '#c3d0ef', '#a7b6e2', '#8ea2da', '#7189cf', '#4a66b8']
const SWAP_MS = 2400

/** Rolls the old text up and the new text in from below when `children` key changes. */
function Roll({ id, children, className = '' }) {
  return (
    <span className={`relative block overflow-hidden ${className}`}>
      <span key={id} className="grid-roll block">
        {children}
      </span>
    </span>
  )
}

function Card({ card, index, className = '', style }) {
  const it = card.items[index % card.items.length]
  return (
    <div className={`flex flex-col rounded-2xl bg-bg p-3 shadow-[0_1px_2px_rgba(0,0,0,0.04)] xl:p-4 ${className}`} style={style}>
      <span aria-hidden="true" className="size-6 rounded-md xl:size-7" style={{ background: TONES[card.tone - 1] }} />
      <Roll id={it.title} className="mt-3">
        <span className="block text-[15px] font-semibold leading-tight text-ink">{it.title}</span>
        <span className="block text-[13px] leading-snug text-muted">{it.sub}</span>
      </Roll>
      <Roll id={it.value} className="mt-auto pt-2">
        <span className="block font-[family-name:var(--font-num)] text-[clamp(1.25rem,1.8vw,1.75rem)] font-semibold leading-none tracking-[-0.02em] text-ink tabular-nums">
          {it.value}
        </span>
      </Roll>
    </div>
  )
}

function useCount(target, decimals, run) {
  const [v, setV] = useState(run ? 0 : target)
  useEffect(() => {
    if (!run) return
    let raf
    const t0 = performance.now()
    const D = 1400
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / D)
      setV(target * (1 - Math.pow(1 - p, 3)))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [target, run])
  return run ? v.toFixed(decimals) : target.toFixed(decimals)
}

function Stat({ s, run }) {
  const v = useCount(s.value, s.decimals ?? 0, run)
  return (
    <>
      <span className="block font-[family-name:var(--font-num)] text-[clamp(2rem,3.2vw,3rem)] font-semibold leading-none tracking-[-0.03em] text-ink tabular-nums">
        {v}
        <sup className="ml-0.5 align-super text-[0.45em] font-semibold">{s.suffix}</sup>
      </span>
      <span className="mt-1.5 block whitespace-pre-line text-[15px] font-medium leading-tight text-ink">{s.label}</span>
    </>
  )
}

export default function CompanyGrid() {
  const reduced = useReducedMotion()
  const [ref, inView] = useInView('0px 0px -20% 0px')
  const [swaps, setSwaps] = useState(() => GRID_CARDS.map(() => 0))
  const step = useRef(0)

  // Swap one card at a time, in a steady order (reference rhythm).
  useEffect(() => {
    if (!inView || reduced) return
    const order = [0, 3, 1, 4, 2, 5]
    const id = setInterval(() => {
      const slot = order[step.current++ % order.length]
      setSwaps((s) => s.map((v, i) => (i === slot ? v + 1 : v)))
    }, SWAP_MS)
    return () => clearInterval(id)
  }, [inView, reduced])

  const drawn = inView || reduced
  const cell = (c, r) => ({ left: `${c * 12.5}%`, top: `${(r / 3) * 100}%`, width: '12.5%', height: `${100 / 3}%` })
  // Grid-line ragged ends, as in the reference (extra length below the grid, per column line).
  const tails = [0, 0.18, 0.5, 0.75, 0.2, 0.55, 0.1, 0.35, 0]

  return (
    <section aria-labelledby="grid-title" className="overflow-hidden bg-surface py-20 md:py-24">
      <div className="container-x">
        <SectionHeading id="grid-title" eyebrow={GRID_INTRO.eyebrow} first={GRID_INTRO.first} second={GRID_INTRO.second} size="md" />
      </div>

      {/* Desktop: line grid */}
      <div ref={ref} className="relative mx-auto mt-12 hidden aspect-[8/3] w-full max-w-[1440px] lg:block">
        {/* lines */}
        <div aria-hidden="true" className="absolute inset-0">
          {tails.map((t, i) => (
            <span key={`v${i}`} className="absolute top-[-6%] w-px bg-line" style={{ left: `${i * 12.5}%`, height: `${106 + t * 30}%` }} />
          ))}
          {[1, 2, 3].map((r) => (
            <span key={`h${r}`} className="absolute h-px bg-line" style={{ top: `${(r / 3) * 100}%`, left: r === 3 ? '12.5%' : 0, right: r === 3 ? '25%' : 0 }} />
          ))}
          {/* intersection markers beside the stats */}
          {GRID_STATS.map((s) => (
            <span key={s.label} className="absolute size-[7px] -translate-x-1/2 -translate-y-1/2 bg-ink" style={{ left: `${s.col * 12.5}%`, top: `${((s.row + 1) / 3) * 100}%` }} />
          ))}
        </div>

        {/* cards */}
        {GRID_CARDS.map((c, i) => (
          <div key={i} className="absolute p-1" style={cell(c.col, c.row)}>
            <Card card={c} index={swaps[i]} className="h-full" />
          </div>
        ))}

        {/* arrows */}
        <svg aria-hidden="true" viewBox="0 0 800 300" className="pointer-events-none absolute inset-0 h-full w-full overflow-visible">
          <defs>
            <marker id="grid-arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="9" markerHeight="9" orient="auto-start-reverse">
              <path d="M1 1.5 L7 5 L1 8.5" fill="none" stroke="var(--accent)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
            </marker>
          </defs>
          {GRID_NOTES.map((n, i) => (
            <path
              key={n.text}
              d={n.path}
              fill="none"
              stroke="var(--accent)"
              strokeWidth="0.8"
              markerEnd="url(#grid-arrow)"
              pathLength="1"
              strokeDasharray="1"
              strokeDashoffset={drawn ? 0 : 1}
              style={{ transition: reduced ? 'none' : `stroke-dashoffset .9s cubic-bezier(.65,0,.35,1) ${0.3 + i * 0.35}s` }}
            />
          ))}
        </svg>

        {/* notes */}
        {GRID_NOTES.map((n, i) => (
          <p
            key={n.text}
            className={`grid-note absolute flex justify-center px-2 text-center ${n.at === 'top' ? 'items-start pt-3 xl:pt-4' : 'items-end pb-4 xl:pb-5'}`}
            style={{ ...cell(n.col, n.row), '--note-delay': `${0.7 + i * 0.35}s` }}
            data-drawn={drawn}
          >
            <span className="whitespace-pre-line">{n.text}</span>
          </p>
        ))}

        {/* stats: bottom-left of their cell, on the grid line */}
        {GRID_STATS.map((s) => (
          <div key={s.label} className="absolute flex flex-col justify-end pb-3 pl-3" style={cell(s.col, s.row)}>
            <Stat s={s} run={inView && !reduced} />
          </div>
        ))}
      </div>

      {/* Mobile / tablet */}
      <div className="container-x mt-10 lg:hidden">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {GRID_CARDS.map((c, i) => (
            <Card key={i} card={c} index={0} className="min-h-40" />
          ))}
        </div>
        <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-line pt-8">
          {GRID_STATS.map((s) => (
            <div key={s.label}>
              <Stat s={s} run={false} />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
