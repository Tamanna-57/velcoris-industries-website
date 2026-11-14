import { useEffect, useRef } from 'react'
import { HERO_STATS, SAMPLE_HREF } from '../lib/content'
import { useReducedMotion } from '../lib/hooks'
import { ArrowRight } from './icons'
import LatticeField from './LatticeField'

/**
 * Full-bleed hero: an animated graphene lattice (canvas, thin lines) fills the whole section and
 * follows the light / dark theme; the copy sits centred on top. Small sparks avoid the copy block.
 */
export default function Hero() {
  const imgRef = useRef(null)
  const copyRef = useRef(null)
  const reduced = useReducedMotion()

  // Subtle pointer parallax on the lattice (desktop, motion allowed only)
  useEffect(() => {
    if (reduced || !window.matchMedia('(pointer: fine)').matches) return
    let raf = 0
    const onMove = (e) => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const dx = (e.clientX / innerWidth - 0.5) * -14
        const dy = (e.clientY / innerHeight - 0.5) * -10
        if (imgRef.current) imgRef.current.style.transform = `translate3d(${dx}px, ${dy}px, 0) scale(1.04)`
      })
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  return (
    <section aria-labelledby="hero-title" className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bg pt-[72px]">
      {/* Animated lattice across the whole hero (follows light / dark theme) */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        <div ref={imgRef} className="h-full w-full scale-[1.04] transition-transform duration-700 ease-out will-change-transform">
          <LatticeField protectRef={copyRef} />
        </div>
      </div>

      <div className="container-x flex flex-1 flex-col items-center justify-center pb-24 pt-10 text-center md:py-20">
        <div ref={copyRef} className="flex max-w-full flex-col items-center">
          <p className="eyebrow">Industrial graphene · Greater Noida, India</p>

          <h1
            id="hero-title"
            className="mt-6 max-w-6xl text-[clamp(2.5rem,5.4vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
          >
            <span className="md:whitespace-nowrap">Graphene at industrial scale.</span> <span className="block">Made in India.</span>
          </h1>

          <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-muted md:text-xl">
            High-purity graphene for defence, energy and aerospace, at a fraction of the cost of imports.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
            <a href={SAMPLE_HREF} className="btn-primary">
              Request a sample <ArrowRight />
            </a>
            <a href="/technology" className="link-accent">
              See the technology <ArrowRight />
            </a>
          </div>

          {/* Former ticker, now a single statement */}
          <p className="mt-10 text-sm text-muted">
            Formerly <strong className="font-semibold text-ink">Weber Innovations</strong>, now Velcoris Industries.
          </p>
        </div>
      </div>

      {/* Key figures */}
      <div className="relative border-t border-white/10 bg-[#0a0b0d]">
        <dl className="container-x grid grid-cols-3 divide-x divide-white/10">
          {HERO_STATS.map((s) => (
            <div key={s.label} className="flex flex-col-reverse py-5 pl-4 first:pl-0 sm:py-6 sm:pl-8">
              <dt className="mt-1 font-mono text-[0.75rem] uppercase tracking-[0.08em] text-[#a9b0bb]">{s.label}</dt>
              <dd className="font-display text-xl font-semibold tracking-tight text-[#f3f4f6] sm:text-3xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
