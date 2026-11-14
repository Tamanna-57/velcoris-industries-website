import { useMemo, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { GALLERY, GALLERY_CATEGORIES } from '../lib/media'

const wrap = (i, n) => ((i % n) + n) % n

/**
 * Replica of the original media gallery: category chips, a coverflow carousel (centre photo
 * large, neighbours angled behind), drag/arrow navigation, caption table, click-to-expand.
 * Only the centre ±2 photos are rendered, so at most five photos load at a time.
 */
export default function MediaGallery() {
  const [cat, setCat] = useState(GALLERY_CATEGORIES[0])
  const [idx, setIdx] = useState(0)
  const dialogRef = useRef(null)
  const drag = useRef(null)

  const items = useMemo(() => (cat === 'All Media' ? GALLERY : GALLERY.filter((g) => g.category === cat)), [cat])
  const n = items.length
  const current = items[wrap(idx, n)]
  const groupItems = GALLERY.filter((g) => g.title === current.title)
  const groupIndex = groupItems.findIndex((g) => g.src === current.src) + 1

  const go = (d) => setIdx((i) => i + d)

  const onPointerDown = (e) => {
    drag.current = { x: e.clientX, moved: false }
  }
  const onPointerUp = (e) => {
    if (!drag.current) return
    const dx = e.clientX - drag.current.x
    if (Math.abs(dx) > 40) {
      go(dx < 0 ? 1 : -1)
      drag.current.moved = true
    }
    setTimeout(() => (drag.current = null), 0)
  }

  return (
    <section aria-labelledby="gallery-title" className="overflow-hidden bg-surface py-20 [contain:paint] md:py-24">
      <h2 id="gallery-title" className="sr-only">Media gallery</h2>
      <div className="container-x">
        <div role="tablist" aria-label="Filter media" className="flex flex-wrap justify-center gap-2">
          {GALLERY_CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cat === c}
              onClick={() => {
                setCat(c)
                setIdx(0)
              }}
              className={`min-h-10 rounded-full border px-4 text-sm font-medium transition-colors ${
                cat === c ? 'border-ink bg-ink text-bg' : 'border-line bg-bg text-ink hover:border-line-strong'
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* coverflow */}
        <div
          className="relative mx-auto mt-12 h-[clamp(240px,34vw,440px)] select-none [perspective:1600px]"
          role="region"
          aria-roledescription="carousel"
          aria-label={`${cat} photos`}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') go(-1)
            if (e.key === 'ArrowRight') go(1)
          }}
          onPointerDown={onPointerDown}
          onPointerUp={onPointerUp}
        >
          {[-2, -1, 0, 1, 2].map((o) => {
            if (n < 2 && o !== 0) return null
            const item = items[wrap(idx + o, n)]
            const abs = Math.abs(o)
            return (
              <button
                key={`${o}-${item.src}`}
                type="button"
                tabIndex={o === 0 ? 0 : -1}
                aria-hidden={o !== 0}
                aria-label={o === 0 ? `Expand photo: ${item.title}` : undefined}
                onClick={() => {
                  if (drag.current?.moved) return
                  if (o === 0) dialogRef.current?.showModal()
                  else go(o)
                }}
                className="absolute left-1/2 top-1/2 aspect-[4/3] w-[clamp(220px,34vw,480px)] overflow-hidden rounded-2xl bg-line shadow-xl transition-[transform,opacity] duration-500 ease-out"
                style={{
                  transform: `translate(-50%, -50%) translateX(${o * 58}%) scale(${1 - abs * 0.16}) rotateY(${o * -16}deg)`,
                  zIndex: 10 - abs,
                  opacity: abs > 1 ? 0.55 : 1,
                }}
              >
                <img src={item.src} alt={o === 0 ? item.title : ''} loading="lazy" decoding="async" draggable="false" className="h-full w-full object-cover" />
              </button>
            )
          })}
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Previous photo"
            className="absolute left-0 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg text-ink shadow-sm hover:border-accent hover:text-accent"
          >
            <ChevronLeft className="size-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Next photo"
            className="absolute right-0 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full border border-line bg-bg text-ink shadow-sm hover:border-accent hover:text-accent"
          >
            <ChevronRight className="size-5" aria-hidden="true" />
          </button>
        </div>

        {/* caption */}
        <div className="mx-auto mt-10 max-w-md text-center" aria-live="polite">
          <p className="font-display text-xl font-semibold text-ink">{current.title}</p>
          <p className="mt-1 text-sm text-muted">{current.category}</p>
          <dl className="mt-6 divide-y divide-line border-y border-line text-left text-sm">
            {[
              ['Milestone', current.title],
              ['Category', current.category],
              ['Archive index', `${groupIndex} of ${groupItems.length}`],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-6 py-2.5">
                <dt className="text-muted">{k}</dt>
                <dd className="text-right font-medium text-ink">{v}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-5 text-xs text-muted">Drag horizontally to explore · Click center image to expand</p>
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
        <button
          type="button"
          onClick={() => dialogRef.current.close()}
          aria-label="Close"
          className="absolute -top-3 -right-3 grid size-11 place-items-center rounded-full bg-white text-black"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </dialog>
    </section>
  )
}
