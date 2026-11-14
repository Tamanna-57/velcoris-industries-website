import { useRef, useState } from 'react'
import { SECTORS } from '../lib/applications'
import { useInView, useReducedMotion } from '../lib/hooks'
import { ArrowRight } from './icons'

/** Woven-fibre pattern for the Smart Textiles sector (its original photo does not load). */
function WovenPattern() {
  return (
    <svg viewBox="0 0 400 300" className="h-full w-full" role="img" aria-label="Woven conductive fibre pattern" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="300" fill="#15181d" />
      {Array.from({ length: 16 }).map((_, i) => (
        <path key={`w${i}`} d={`M0 ${10 + i * 19} C 100 ${2 + i * 19}, 300 ${18 + i * 19}, 400 ${10 + i * 19}`} stroke={i % 4 === 1 ? '#93abe0' : '#4b5260'} strokeWidth="5" fill="none" strokeLinecap="round" />
      ))}
      {Array.from({ length: 22 }).map((_, i) => (
        <path key={`v${i}`} d={`M${8 + i * 19} 0 C ${2 + i * 19} 100, ${14 + i * 19} 200, ${8 + i * 19} 300`} stroke="#2c323c" strokeWidth="4" fill="none" strokeDasharray="12 7" />
      ))}
    </svg>
  )
}

/**
 * One sector, in the layout of the client's reference (WLX "Work" list):
 * eyebrow, two-tone headline, paragraph, two-column facts with rules, tag line.
 * On entering the viewport the photo widens into place (clip reveal from the text side)
 * and the text fades in from a blur, staggered.
 */
function SectorRow({ s, index, imageLeft, headingRef }) {
  const reduced = useReducedMotion()
  const [ref, seen] = useInView('0px 0px -18% 0px')
  const on = reduced || seen
  const n = String(index + 1).padStart(2, '0')
  const blur = (i) => ({
    opacity: on ? 1 : 0,
    filter: on ? 'blur(0)' : 'blur(8px)',
    transform: on ? 'none' : 'translateY(10px)',
    transition: `opacity .7s ${0.15 + i * 0.09}s, filter .7s ${0.15 + i * 0.09}s, transform .7s ${0.15 + i * 0.09}s`,
  })

  return (
    <li ref={ref} id={`sector-${s.id}`} className="grid scroll-mt-28 items-center gap-10 md:grid-cols-12 md:gap-12">
      {/* photo */}
      <div className={`md:col-span-5 ${imageLeft ? '' : 'md:order-2 md:col-start-8'}`}>
        <div
          className="aspect-[4/3] overflow-hidden bg-surface"
          style={{
            clipPath: on ? 'inset(0 0 0 0)' : imageLeft ? 'inset(0 0 0 100%)' : 'inset(0 100% 0 0)',
            transition: 'clip-path 1.2s cubic-bezier(.65,0,.25,1)',
          }}
        >
          <div className="h-full w-full" style={{ transform: on ? 'scale(1)' : 'scale(1.18)', transition: 'transform 1.6s cubic-bezier(.2,.8,.2,1)' }}>
            {s.image ? (
              <img src={s.image} alt={s.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" />
            ) : (
              <WovenPattern />
            )}
          </div>
        </div>
      </div>

      {/* text */}
      <div className={`md:col-span-6 ${imageLeft ? 'md:col-start-7' : 'md:order-1'}`}>
        <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted" style={blur(0)}>
          Sector · {n} · {s.label}
        </p>
        <h3
          ref={headingRef}
          tabIndex={headingRef ? -1 : undefined}
          className="mt-5 text-[clamp(1.85rem,3vw,2.6rem)] leading-[1.08] tracking-[-0.03em] text-ink outline-none"
          style={blur(1)}
        >
          <span className="font-light">{s.title}.</span> <span className="font-semibold">{s.tagline}</span>
        </h3>
        <p className="mt-5 max-w-xl text-muted" style={blur(2)}>{s.body}</p>
        <dl className="mt-8 grid max-w-xl grid-cols-2 gap-x-8" style={blur(3)}>
          {s.stats.map(([v, k]) => (
            <div key={k} className="border-t border-line py-3 text-sm">
              <dt className="sr-only">{k}</dt>
              <dd className="text-ink">
                <span className="font-semibold">{v}</span> <span className="text-muted">{k}</span>
              </dd>
            </div>
          ))}
        </dl>
        <p className="mt-6 font-mono text-xs uppercase tracking-[0.1em] text-muted" style={blur(4)}>
          {s.stage} · Loading {s.loading} · {s.dispersion}
        </p>
        <a href={`/contact?intent=application&sector=${s.id}`} className="link-accent mt-4 text-sm" style={blur(5)}>
          Discuss {s.title} application <ArrowRight />
        </a>
      </div>
    </li>
  )
}

/**
 * Sector list. Shows the four commercial-scale sectors first (what Velcoris is known for);
 * "View all applications" reveals the five R&D sectors with the same animation.
 */
export default function SectorRows() {
  const [all, setAll] = useState(false)
  const firstNewRef = useRef(null)
  const commercial = SECTORS.filter((s) => s.group === 'commercial')
  const rnd = SECTORS.filter((s) => s.group === 'rnd')

  const expand = () => {
    setAll(true)
    requestAnimationFrame(() => requestAnimationFrame(() => firstNewRef.current?.focus({ preventScroll: false })))
  }

  return (
    <section aria-labelledby="sectors-title" className="bg-bg pb-24 md:pb-32">
      <div className="container-x">
        <h2 id="sectors-title" className="eyebrow mb-14 md:mb-20">Commercial focus</h2>
        <ol className="space-y-24 md:space-y-32">
          {commercial.map((s, i) => (
            <SectorRow key={s.id} s={s} index={i} imageLeft={i % 2 === 1} />
          ))}
        </ol>

        {all ? (
          <>
            <h2 className="eyebrow mb-14 mt-28 md:mb-20 md:mt-36">Strategic horizons &amp; R&amp;D</h2>
            <ol className="space-y-24 md:space-y-32">
              {rnd.map((s, i) => (
                <SectorRow key={s.id} s={s} index={commercial.length + i} imageLeft={(commercial.length + i) % 2 === 1} headingRef={i === 0 ? firstNewRef : undefined} />
              ))}
            </ol>
          </>
        ) : (
          <div className="mt-24 flex flex-col items-center gap-3 border-t border-line pt-12 text-center md:mt-28">
            <p className="text-muted">{rnd.length} more applications in R&amp;D and co-development</p>
            <button type="button" onClick={expand} className="btn-primary" aria-expanded={all}>
              View all {SECTORS.length} applications <ArrowRight />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
