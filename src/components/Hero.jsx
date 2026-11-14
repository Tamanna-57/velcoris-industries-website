import { useEffect, useRef } from 'react'
import { HERO_STATS, SAMPLE_HREF } from '../lib/content'
import { useReducedMotion } from '../lib/hooks'
import { ArrowRight } from './icons'

/**
 * Full-bleed hero. The whole graphene lattice image covers the section; a gradient
 * washes it out (faded) on the left, where the copy sits, and lets it fade to full
 * dark on the right.
 * Replaces the old 50/50 text + boxed-image split and the top ticker.
 */
export default function Hero() {
  const imgRef = useRef(null)
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
      {/* Lattice backdrop */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {/* Light theme: light lattice (dark lines on white). Dark theme: the original dark lattice. */}
        <div ref={imgRef} className="h-full w-full scale-[1.04] transition-transform duration-700 ease-out will-change-transform">
          <picture className="hero-img-light">
            <source media="(max-width: 767px)" srcSet="/media/hero-lattice-light-960.webp" type="image/webp" />
            <img src="/media/hero-lattice-light.webp" alt="" width="1920" height="1080" fetchPriority="high" decoding="async" className="h-full w-full object-cover object-center" />
          </picture>
          <picture className="hero-img-dark">
            <source media="(max-width: 767px)" srcSet="/media/hero-lattice-960.webp" type="image/webp" />
            <img src="/media/hero-lattice.webp" alt="" width="1920" height="1080" decoding="async" className="h-full w-full object-cover object-center" />
          </picture>
        </div>
        {/* Left→right fade (desktop) / top→bottom fade (mobile) from the page colour into the dark lattice */}
        <div className="absolute inset-0 hidden md:block [background:linear-gradient(90deg,color-mix(in_srgb,var(--bg)_86%,transparent)_0,color-mix(in_srgb,var(--bg)_86%,transparent)_40rem,color-mix(in_srgb,var(--bg)_62%,transparent)_50rem,color-mix(in_srgb,var(--bg)_32%,transparent)_62rem,color-mix(in_srgb,var(--bg)_10%,transparent)_76rem,transparent_88rem)]" />
        <div className="absolute inset-0 md:hidden [background:linear-gradient(180deg,color-mix(in_srgb,var(--bg)_88%,transparent)_0,color-mix(in_srgb,var(--bg)_88%,transparent)_72%,color-mix(in_srgb,var(--bg)_40%,transparent)_88%,transparent_100%)]" />
      </div>

      <div className="container-x flex flex-1 flex-col justify-center pb-28 pt-12 md:py-20">
        <div className="max-w-[36rem]">
          <p className="eyebrow">Industrial graphene · Greater Noida, India</p>

          <h1
            id="hero-title"
            className="mt-6 text-[clamp(2.75rem,6vw,5.25rem)] font-semibold leading-[0.98] tracking-[-0.035em] text-ink"
          >
            Graphene at industrial scale. <span className="block">Made in India.</span>
          </h1>

          <p className="mt-6 max-w-[32rem] text-lg leading-relaxed text-muted md:text-xl">
            High-purity graphene for defence, energy and aerospace, at a fraction of the cost of imports.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3">
            <a href={SAMPLE_HREF} className="btn-primary">
              Request a sample <ArrowRight />
            </a>
            <a href="/technology" className="link-accent">
              See the technology <ArrowRight />
            </a>
          </div>

          {/* Former ticker, now a single statement */}
          <p className="mt-10 border-l-2 border-line-strong pl-3 text-sm text-muted">
            Formerly <strong className="font-semibold text-ink">Weber Innovations</strong>, now Velcoris Industries.
          </p>
        </div>
      </div>

      {/* Key figures */}
      <div className="relative border-t border-white/10 bg-[#0a0b0d]/85">
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
