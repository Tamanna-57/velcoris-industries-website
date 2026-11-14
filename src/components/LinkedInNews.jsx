import { useEffect, useRef, useState } from 'react'
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { LINKEDIN_INTRO, LINKEDIN_POSTS } from '../lib/media'
import SectionHeading from './SectionHeading'

/**
 * "Latest from LinkedIn" (reference: vastworld.ai news grid).
 * Replaces four live LinkedIn iframe embeds (slow, often blank) with static article cards:
 * cover image, date · author, headline, short summary. Alternate cards sit lower, as in the
 * reference. Every card still opens its original LinkedIn post. The original's arrows and
 * swipe are kept: the row scrolls horizontally with snap.
 */
export default function LinkedInNews() {
  const rowRef = useRef(null)
  const [edge, setEdge] = useState({ start: true, end: false })

  const update = () => {
    const el = rowRef.current
    if (!el) return
    setEdge({ start: el.scrollLeft < 8, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 8 })
  }
  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  const scroll = (d) => {
    const el = rowRef.current
    const card = el?.querySelector('li')
    if (!el || !card) return
    el.scrollBy({ left: d * (card.offsetWidth + 32), behavior: 'smooth' })
  }

  const arrow = 'grid size-11 place-items-center rounded-full border border-line bg-bg text-ink transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-35'

  return (
    <section aria-labelledby="linkedin-title" className="bg-bg py-24 md:py-28">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-2xl">
            <SectionHeading id="linkedin-title" eyebrow={LINKEDIN_INTRO.eyebrow} first={LINKEDIN_INTRO.first} second={LINKEDIN_INTRO.second} />
            <p className="mt-4 text-muted">{LINKEDIN_INTRO.body}</p>
          </div>
          <div className="flex gap-2">
            <button type="button" className={arrow} onClick={() => scroll(-1)} disabled={edge.start} aria-label="Previous posts">
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button type="button" className={arrow} onClick={() => scroll(1)} disabled={edge.end} aria-label="More posts">
              <ChevronRight className="size-5" aria-hidden="true" />
            </button>
          </div>
        </div>

        <ul
          ref={rowRef}
          onScroll={update}
          className="-mx-5 mt-12 flex snap-x snap-mandatory gap-8 overflow-x-auto scroll-px-5 px-5 pb-4 [scrollbar-width:none] md:mt-14 [&::-webkit-scrollbar]:hidden"
        >
          {LINKEDIN_POSTS.map((p, i) => (
            <li key={p.id} className={`w-[85%] shrink-0 snap-start sm:w-[calc((100%-2rem)/2)] lg:w-[calc((100%-4rem)/3)] ${i % 2 ? 'lg:pt-24' : ''}`}>
              <a href={p.href} target="_blank" rel="noopener noreferrer" className="group relative block">
                <div className="aspect-[16/9] overflow-hidden bg-surface">
                  <img src={p.cover} alt={p.alt} loading="lazy" decoding="async" className="h-full w-full object-cover" style={{ objectPosition: p.position }} />
                </div>
                <p className="mt-8 text-sm uppercase tracking-[0.04em] text-muted">
                  {p.date} · {p.author}
                </p>
                <h3 className="mt-5 text-[clamp(1.6rem,2.4vw,2.25rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-ink">
                  {p.title}
                </h3>
                <p className="mt-4 text-muted">{p.summary}</p>
                <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-accent group-hover:underline">
                  View post on LinkedIn <ArrowUpRight className="size-4" aria-hidden="true" />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
