import { useRef, useState } from 'react'
import { FormulateIso, SampleIso, ScaleIso } from './IsoDiagrams'
import { ArrowRight } from './icons'
import { useReducedMotion } from '../lib/hooks'

const DIAGRAMS = [SampleIso, FormulateIso, ScaleIso]

/** Diagram wrapper: gentle pointer tilt while hovered (off for reduced motion). */
function Tilt({ children, enabled }) {
  const ref = useRef(null)
  const onMove = (e) => {
    if (!enabled || e.pointerType !== 'mouse') return
    const r = ref.current.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5
    const y = (e.clientY - r.top) / r.height - 0.5
    ref.current.style.transform = `perspective(900px) rotateX(${(-y * 8).toFixed(2)}deg) rotateY(${(x * 10).toFixed(2)}deg)`
  }
  const reset = () => {
    if (ref.current) ref.current.style.transform = ''
  }
  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className="w-full max-w-[26rem] transition-transform duration-300 ease-out will-change-transform"
    >
      {children}
    </div>
  )
}

/**
 * Alternating "01. Title" rows with an interactive isometric diagram (reference: RSAShield).
 * Proportions follow the reference: ~2.5vw titles, 16px body, diagram ≈ 27% of the viewport.
 * Hovering or focusing a row animates its diagram.
 */
export default function StepRows({ steps }) {
  const [hover, setHover] = useState(-1)
  const reduced = useReducedMotion()
  return (
    <ol className="mt-8 space-y-10 md:mt-6 md:space-y-0">
      {steps.map((s, i) => {
        const Diagram = DIAGRAMS[i % DIAGRAMS.length]
        return (
          <li
            key={s.title}
            className="reveal grid items-center gap-8 md:grid-cols-2 md:gap-12"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(-1)}
          >
            <div className={i % 2 ? 'md:order-2 md:pl-6' : 'md:pl-10'}>
              <h3 className="text-[clamp(1.6rem,2.5vw,2.25rem)] font-semibold leading-[1.12] tracking-[-0.025em] text-ink">
                <span className="font-light text-muted">{String(i + 1).padStart(2, '0')}.</span> {s.title}
              </h3>
              <p className="mt-3 max-w-md text-muted">{s.text}</p>
              {s.tags && (
                <p className="mt-4 font-mono text-xs uppercase tracking-[0.1em] text-muted">{s.tags.join(' · ')}</p>
              )}
              {s.cta && (
                <a href={s.href} className="btn-primary mt-6">
                  {s.cta} <ArrowRight />
                </a>
              )}
            </div>
            <div className={`flex justify-center ${i % 2 ? 'md:order-1' : ''}`}>
              <Tilt enabled={!reduced}>
                <Diagram active={hover === i} />
              </Tilt>
            </div>
          </li>
        )
      })}
    </ol>
  )
}
