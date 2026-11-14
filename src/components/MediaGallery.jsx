import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { GALLERY, GALLERY_CATEGORIES } from '../lib/media'
import { useReducedMotion } from '../lib/hooks'

// Values measured from the original velcorisindustries.com/media carousel.
const ANGLES = [0, 42, 62, 77.7, 82] // rotateY (deg) by distance from centre, capped at 82
const VISIBLE = 5 // render slides within ±5 of centre
const angleAt = (d) => {
  const a = Math.min(Math.abs(d), 4)
  const i = Math.floor(a)
  const t = a - i
  return ANGLES[i] + (ANGLES[Math.min(i + 1, 4)] - ANGLES[i]) * t
}
const wrapDist = (i, pos, n) => {
  let d = i - pos
  d -= Math.round(d / n) * n // shortest way round the loop
  return d
}
const mod = (i, n) => ((i % n) + n) % n

/**
 * Replica of the original media gallery: a continuous curved strip of photos. Every slide's
 * rotation, depth and opacity are computed from its (fractional) distance to the centre, so
 * dragging moves the whole strip smoothly and it eases to the nearest photo on release
 * (with flick velocity). Arrows / keyboard step with the same easing. Click the centre photo
 * to expand.
 */
export default function MediaGallery() {
  const reduced = useReducedMotion()
  const [cat, setCat] = useState(GALLERY_CATEGORIES[0])
  const items = useMemo(() => (cat === 'All Media' ? GALLERY : GALLERY.filter((g) => g.category === cat)), [cat])
  const n = items.length

  const [pos, setPos] = useState(0) // fractional index at centre
  const posRef = useRef(0)
  const anim = useRef(0)
  const drag = useRef(null)
  const stageRef = useRef(null)
  const dialogRef = useRef(null)

  const setP = (p) => {
    posRef.current = p
    setPos(p)
  }

  const animateTo = useCallback(
    (target) => {
      cancelAnimationFrame(anim.current)
      if (reduced) {
        posRef.current = target
        setPos(target)
        return
      }
      const from = posRef.current
      const t0 = performance.now()
      const dur = 520
      const step = (t) => {
        const k = Math.min(1, (t - t0) / dur)
        const e = 1 - Math.pow(1 - k, 3) // ease-out cubic
        posRef.current = from + (target - from) * e
        setPos(posRef.current)
        if (k < 1) anim.current = requestAnimationFrame(step)
      }
      anim.current = requestAnimationFrame(step)
    },
    [reduced],
  )

  useEffect(() => () => cancelAnimationFrame(anim.current), [])

  const centre = mod(Math.round(pos), n)
  const current = items[centre]
  const groupItems = GALLERY.filter((g) => g.title === current.title)
  const groupIndex = groupItems.findIndex((g) => g.src === current.src) + 1

  const spacing = () => (stageRef.current?.querySelector('[data-card]')?.offsetWidth || 300) * 1.05

  const onPointerDown = (e) => {
    if (e.button !== undefined && e.button !== 0) return
    cancelAnimationFrame(anim.current)
    drag.current = { x: e.clientX, start: posRef.current, lastX: e.clientX, lastT: performance.now(), v: 0, moved: false }
  }
  const onPointerMove = (e) => {
    const d = drag.current
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 4) {
      d.moved = true
      e.currentTarget.setPointerCapture?.(e.pointerId)
    }
    if (!d.moved) return
    const now = performance.now()
    d.v = (e.clientX - d.lastX) / Math.max(1, now - d.lastT) // px/ms
    d.lastX = e.clientX
    d.lastT = now
    setP(d.start - dx / spacing())
  }
  const onPointerUp = () => {
    const d = drag.current
    if (!d) return
    if (d.moved) {
      const flick = (-d.v * 180) / spacing() // carry momentum ~180ms
      animateTo(Math.round(posRef.current + flick))
    }
    setTimeout(() => (drag.current = null), 0)
  }

  const go = (k) => animateTo(Math.round(posRef.current) + k)

  return (
    <section aria-labelledby="gallery-title" className="overflow-hidden bg-surface py-16 [contain:paint] md:py-20">
      <h2 id="gallery-title" className="sr-only">Media gallery</h2>
      <div className="container-x">
        {/* category filter (sizes from the original: 12px, 32px-tall pills, 8px gap) */}
        <div role="tablist" aria-label="Filter media" className="mb-8 flex flex-wrap items-center justify-center gap-2 sm:mb-12">
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => {
                setCat(c)
                cancelAnimationFrame(anim.current)
                setP(0)
              }}
              className={`h-8 rounded-full px-4 text-xs font-semibold tracking-[0.02em] transition-colors duration-200 ${
                cat === c ? 'bg-ink text-bg' : 'border border-line bg-bg text-muted hover:border-line-strong hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* curved strip */}
      <div className="relative">
        <div
          ref={stageRef}
          className="relative cursor-grab touch-pan-y select-none overflow-hidden py-10 outline-none active:cursor-grabbing [--cf-card:clamp(220px,28vw,360px)]"
          style={{ perspective: 'calc(var(--cf-card) * 3)' }}
          role="region"
          aria-roledescription="carousel"
          aria-label={`${cat} photos`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerUp}
        >
          <div className="relative" style={{ height: 'var(--cf-card)', transformStyle: 'preserve-3d' }}>
            {items.map((item, i) => {
              const d = wrapDist(i, pos, n)
              if (Math.abs(d) > VISIBLE) return null
              const a = Math.abs(d)
              const isCenter = i === centre
              return (
                <button
                  key={item.src}
                  type="button"
                  data-card
                  tabIndex={isCenter ? 0 : -1}
                  aria-hidden={!isCenter}
                  aria-label={isCenter ? `Expand photo: ${item.title}` : undefined}
                  onClick={() => {
                    if (drag.current?.moved) return
                    if (isCenter) dialogRef.current?.showModal()
                    else animateTo(Math.round(posRef.current + d))
                  }}
                  className="absolute left-1/2 top-0 aspect-square overflow-hidden rounded-2xl border border-line bg-line shadow-[0_12px_36px_rgba(0,0,0,0.12)] will-change-transform hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                  style={{
                    width: 'var(--cf-card)',
                    transform: `translateX(calc(-50% + ${d.toFixed(4)} * var(--cf-card) * 1.05)) translateZ(calc(var(--cf-card) * ${(-0.65 * Math.pow(a, 0.55)).toFixed(4)})) rotateY(${(-Math.sign(d) * angleAt(a)).toFixed(2)}deg)`,
                    opacity: Math.max(0, 1 - a * 0.1),
                    zIndex: 100 - Math.round(a * 10),
                  }}
                >
                  <img src={item.src} alt={isCenter ? item.title : ''} loading="lazy" decoding="async" draggable="false" className="pointer-events-none h-full w-full object-cover" />
                </button>
              )
            })}
          </div>
        </div>
        <div className="container-x pointer-events-none absolute inset-x-0 top-1/2 z-[200] flex -translate-y-1/2 justify-between">
          <button type="button" onClick={() => go(-1)} aria-label="Previous photo" className="pointer-events-auto grid size-11 place-items-center rounded-full border border-line bg-bg text-ink shadow-sm transition-colors hover:border-accent hover:text-accent">
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Next photo" className="pointer-events-auto grid size-11 place-items-center rounded-full border border-line bg-bg text-ink shadow-sm transition-colors hover:border-accent hover:text-accent">
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* caption: compact card (was a sparse centred table) */}
      <div className="container-x">
        <div className="mx-auto mt-6 grid max-w-3xl items-center gap-6 rounded-2xl border border-line bg-bg p-6 sm:grid-cols-[1fr_auto] sm:gap-10 md:p-7" aria-live="polite">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{current.category}</p>
            <p className="mt-2 font-display text-[clamp(1.25rem,2vw,1.6rem)] font-semibold leading-tight tracking-[-0.02em] text-ink">{current.title}</p>
            <p className="mt-3 text-sm text-muted">Drag horizontally to explore · Click the centre image to expand</p>
          </div>
          <div className="min-w-[10rem] sm:text-right">
            <p className="font-mono text-xs uppercase tracking-[0.12em] text-muted">Archive index</p>
            <p className="mt-1 font-display text-3xl font-semibold tabular-nums tracking-tight text-ink">
              {String(groupIndex).padStart(2, '0')}
              <span className="text-lg font-normal text-muted"> / {String(groupItems.length).padStart(2, '0')}</span>
            </p>
            <div className="mt-3 flex gap-1 sm:justify-end" aria-hidden="true">
              {groupItems.map((g, k) => (
                <span key={g.src} className={`h-1 w-5 rounded-full transition-colors ${k + 1 === groupIndex ? 'bg-ink' : 'bg-line'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <dialog
        ref={dialogRef}
        aria-label={current.title}
        className="m-auto max-h-[92vh] max-w-[92vw] overflow-visible bg-transparent p-0 backdrop:bg-black/85"
        onClick={(e) => e.target === dialogRef.current && dialogRef.current.close()}
      >
        <img src={current.src} alt={current.title} className="max-h-[86vh] max-w-[92vw] rounded-xl object-contain" />
        <p className="mt-3 text-center text-sm text-white">{current.title} · {groupIndex} of {groupItems.length}</p>
        <button type="button" onClick={() => dialogRef.current.close()} aria-label="Close" className="absolute -right-3 -top-3 grid size-11 place-items-center rounded-full bg-white text-black">
          <X className="size-5" aria-hidden="true" />
        </button>
      </dialog>
    </section>
  )
}
