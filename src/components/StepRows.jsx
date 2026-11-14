import { useState } from 'react'
import { FormulateIso, SampleIso, ScaleIso } from './IsoDiagrams'
import { ArrowRight } from './icons'

const DIAGRAMS = [SampleIso, FormulateIso, ScaleIso]

/**
 * Alternating "01. Title" rows with an interactive isometric diagram (reference: RSAShield).
 * Used by the homepage "Work with us" and the Applications "Commercial integration pathway".
 * Hovering or focusing a row animates its diagram.
 */
export default function StepRows({ steps }) {
  const [hover, setHover] = useState(-1)
  return (
    <ol className="mt-16 space-y-20 md:mt-20 md:space-y-28">
      {steps.map((s, i) => {
        const Diagram = DIAGRAMS[i % DIAGRAMS.length]
        return (
          <li
            key={s.title}
            className="reveal grid items-center gap-10 md:grid-cols-2 md:gap-16"
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(-1)}
            onFocus={() => setHover(i)}
            onBlur={() => setHover(-1)}
          >
            <div className={i % 2 ? 'md:order-2' : ''}>
              <h3 className="text-[clamp(2rem,3.6vw,3rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                <span className="font-light text-muted">{String(i + 1).padStart(2, '0')}.</span> {s.title}
              </h3>
              <p className="mt-5 max-w-lg text-lg text-muted">{s.text}</p>
              {s.tags && (
                <p className="mt-5 font-mono text-xs uppercase tracking-[0.1em] text-muted">{s.tags.join(' · ')}</p>
              )}
              {s.cta && (
                <a href={s.href} className="btn-primary mt-8">
                  {s.cta} <ArrowRight />
                </a>
              )}
            </div>
            <div className={`flex justify-center ${i % 2 ? 'md:order-1' : ''}`}>
              <Diagram active={hover === i} />
            </div>
          </li>
        )
      })}
    </ol>
  )
}
