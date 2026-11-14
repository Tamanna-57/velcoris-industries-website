import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from '../lib/hooks'

const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v))
const ease = (t) => 1 - Math.pow(1 - clamp(t), 3)

/**
 * Scroll-expand video (reference: LxL Creative). A small framed clip grows to full-bleed
 * as the visitor scrolls, then plays a graphene conductivity clip (supplied by the team).
 * Replaces the old flat SVG slider: shows the material in seconds, with no reading.
 *
 * Perf: one passive scroll listener + rAF; only `clip-path` / `opacity` / `transform`
 * change (compositor-friendly). The video doesn't load until the section is near view.
 */
export default function ProcessVideo() {
  const sectionRef = useRef(null)
  const stageRef = useRef(null)
  const videoRef = useRef(null)
  const reduced = useReducedMotion()
  const [nearRef, near] = useInView('600px 0px')
  const [userPaused, setUserPaused] = useState(false)
  const [playing, setPlaying] = useState(false)
  const progressRef = useRef(0)
  const [expanded, setExpanded] = useState(false)
  const expandedRef = useRef(false)

  // Scroll → expansion progress
  useEffect(() => {
    if (reduced) return
    let raf = 0
    const update = () => {
      const sec = sectionRef.current
      const stage = stageRef.current
      if (!sec || !stage) return
      const r = sec.getBoundingClientRect()
      const total = r.height - innerHeight
      const p = clamp(-r.top / total)
      progressRef.current = p
      const e = ease(p / 0.55) // expansion happens in the first ~55% of the scroll
      const w0 = Math.min(520, innerWidth * 0.72)
      const h0 = (w0 * 9) / 16
      const shift = innerHeight * 0.1 // start the frame below centre so it clears the title
      const insetX = ((innerWidth - w0) / 2) * (1 - e)
      const insetY = ((innerHeight - h0) / 2) * (1 - e)
      stage.style.setProperty('--ix', `${insetX}px`)
      stage.style.setProperty('--it', `${insetY + shift * (1 - e)}px`)
      stage.style.setProperty('--ib', `${Math.max(0, insetY - shift * (1 - e))}px`)
      stage.style.setProperty('--ir', `${18 * (1 - e)}px`)
      stage.style.setProperty('--title-o', String(clamp(1 - e * 1.6)))
      stage.style.setProperty('--title-y', `${-40 * e}px`)
      stage.style.setProperty('--cap-o', String(ease((p - 0.6) / 0.18)))
      const isExpanded = e > 0.85
      if (isExpanded !== expandedRef.current) {
        expandedRef.current = isExpanded
        setExpanded(isExpanded)
      }
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [reduced])

  // Play while the section is on screen (unless the user paused, or reduced motion)
  useEffect(() => {
    const v = videoRef.current
    const sec = sectionRef.current
    if (!v || !sec || reduced) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !userPaused) v.play().catch(() => {})
        else v.pause()
      },
      { threshold: 0.15 },
    )
    io.observe(sec)
    return () => io.disconnect()
  }, [reduced, userPaused, near])

  function togglePlay() {
    const v = videoRef.current
    if (!v) return
    if (v.paused) {
      setUserPaused(false)
      v.play().catch(() => {})
    } else {
      setUserPaused(true)
      v.pause()
    }
  }

  const video = (
    <video
      ref={videoRef}
      className="absolute inset-0 h-full w-full object-cover"
      poster="/media/graphene-conductivity-poster.webp"
      muted
      loop
      playsInline
      preload="none"
      aria-describedby="process-desc"
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
    >
      {near && <source src="/media/graphene-conductivity.mp4" type="video/mp4" />}
    </video>
  )

  const control = (
    <button
      type="button"
      onClick={togglePlay}
      className="absolute bottom-5 right-5 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 bg-black/55 px-4 text-sm font-medium text-white transition-colors hover:border-[#7da4ff] hover:text-[#7da4ff]"
      aria-label={playing ? 'Pause graphene animation' : 'Play graphene animation'}
    >
      <svg viewBox="0 0 16 16" className="size-3.5" fill="currentColor" aria-hidden="true">
        {playing ? <path d="M4 3h3v10H4zM9 3h3v10H9z" /> : <path d="M4 2.5v11l9-5.5z" />}
      </svg>
      {playing ? 'Pause' : 'Play'}
    </button>
  )

  const caption = (
    <p id="process-desc" className="sr-only">
      Animation: a single-atom graphene sheet with electrical current flowing across its honeycomb lattice.
    </p>
  )

  // Reduced motion: a normal framed section, no scroll choreography or autoplay
  if (reduced) {
    return (
      <section ref={nearRef} aria-labelledby="process-title" className="bg-bg py-24">
        <div className="container-x">
          <p className="eyebrow">The science</p>
          <h2 id="process-title" className="mt-4 text-[clamp(2.25rem,5vw,4rem)] text-ink">Engineered at the atomic scale.</h2>
          <div ref={sectionRef} className="relative mt-10 aspect-video overflow-hidden rounded-2xl bg-[#0a0b0d]">
            {video}
            {control}
          </div>
          {caption}
        </div>
      </section>
    )
  }

  return (
    <section ref={sectionRef} aria-labelledby="process-title" className="relative h-[260vh] bg-bg">
      <div ref={nearRef} className="absolute inset-x-0 top-0 h-px" aria-hidden="true" />
      <div
        ref={stageRef}
        data-header={expanded ? 'dark' : undefined}
        className="sticky top-0 h-[100svh] overflow-hidden"
        style={{ '--ix': '30vw', '--it': '40vh', '--ib': '20vh', '--ir': '18px', '--title-o': 1, '--title-y': '0px', '--cap-o': 0 }}
      >
        {/* Title sits behind the frame and is covered as it grows */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[11vh] z-0 px-5 text-center"
          style={{ opacity: 'var(--title-o)', transform: 'translateY(var(--title-y))' }}
        >
          <p className="eyebrow">The science</p>
          <h2 id="process-title" className="mt-4 text-[clamp(2.5rem,7vw,6.5rem)] font-semibold tracking-[-0.04em] text-ink">
            Engineered at the atomic scale.
          </h2>
        </div>
        <p
          className="pointer-events-none absolute inset-x-0 bottom-[6vh] z-0 text-center font-mono text-xs uppercase tracking-[0.12em] text-muted"
          style={{ opacity: 'var(--title-o)' }}
          aria-hidden="true"
        >
          Scroll to watch it happen
        </p>

        {/* Expanding frame */}
        <div
          className="absolute inset-0 z-10 bg-[#0a0b0d]"
          style={{ clipPath: 'inset(var(--it) var(--ix) var(--ib) var(--ix) round var(--ir))' }}
        >
          {video}
          <div
            className="absolute inset-0 flex items-end bg-gradient-to-t from-black/75 via-black/10 to-transparent"
            style={{ opacity: 'var(--cap-o)' }}
          >
            <div className="container-x pb-24 md:pb-20">
              <p className="font-mono text-xs uppercase tracking-[0.12em] text-[#a9b0bb]">Single-atom carbon network</p>
              <p className="mt-3 max-w-[36rem] font-display text-[clamp(1.75rem,3.6vw,3rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-[#f3f4f6]">
                One atom thick. More conductive than copper.
              </p>
            </div>
          </div>
          {expanded && control}
        </div>
        {caption}
      </div>
    </section>
  )
}
