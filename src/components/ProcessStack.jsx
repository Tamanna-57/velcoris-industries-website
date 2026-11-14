import { useEffect, useRef, useState } from 'react'
import { PROCESS_INTRO, STAGES } from '../lib/technology'
import { useReducedMotion } from '../lib/hooks'
import { STAGE_VISUALS } from './StageVisuals'

const firstSentence = (t) => (t.match(/^.*?[.!?](\s|$)/) || [t])[0].trim()

/**
 * "How our process works" (reference: Loopsii feature stack).
 * Replaces a click-through list + text panel (one stage visible at a time, ~60 words each)
 * with six stacking cards: each stage slides up over the last, earlier cards scale back and
 * peek out above. Every card pairs a short description and three spec rows with a diagram.
 *
 * Mechanics: CSS `position: sticky` does the stacking; one rAF-throttled scroll listener
 * scales covered cards (transform only). Reduced motion: cards still stack, no scaling.
 */
export default function ProcessStack() {
  const listRef = useRef(null)
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  useEffect(() => {
    const list = listRef.current
    if (!list) return
    const cards = [...list.querySelectorAll('[data-stage-card]')]
    let raf = 0
    const update = () => {
      const tops = cards.map((c) => c.parentElement.getBoundingClientRect().top)
      const stickTop = cards.map((c) => parseFloat(getComputedStyle(c.parentElement).top) || 0)
      const h = cards.map((c) => c.offsetHeight)
      let current = 0
      cards.forEach((card, i) => {
        // how far later cards have slid over this one (0…n)
        let covered = 0
        for (let j = i + 1; j < cards.length; j++) {
          const dist = tops[j] - stickTop[j]
          covered += Math.min(1, Math.max(0, 1 - dist / h[i]))
        }
        if (tops[i] - stickTop[i] < h[i] * 0.5) current = i
        if (!reduced) {
          card.style.transform = `scale(${1 - covered * 0.04})`
          card.style.filter = covered > 0.02 ? `brightness(${1 - Math.min(covered, 3) * 0.05})` : ''
        }
      })
      setActive(current)
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

  return (
    <section aria-labelledby="process-title" className="bg-surface py-14 md:py-20">
      <div className="container-x">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow">{PROCESS_INTRO.eyebrow}</p>
          <h2 id="process-title" className="mt-4 text-[clamp(2.5rem,5.5vw,4.5rem)] text-ink">
            {PROCESS_INTRO.title}
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted">{PROCESS_INTRO.body}</p>
        </div>

        {/* progress rail: where you are in the 6 stages */}
        <ol className="sticky top-[76px] z-20 mx-auto mt-14 hidden w-fit items-center gap-1 rounded-full border border-line bg-bg/90 p-1 md:flex" aria-label="Process stages">
          {STAGES.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#stage-${s.id}`}
                aria-current={active === i ? 'step' : undefined}
                className={`inline-flex min-h-9 items-center rounded-full px-3.5 font-mono text-xs tracking-[0.08em] transition-colors ${
                  active === i ? 'bg-ink text-bg' : 'text-muted hover:text-ink'
                }`}
              >
                {String(i + 1).padStart(2, '0')}
                <span className="sr-only"> {s.title}</span>
              </a>
            </li>
          ))}
        </ol>

        <ol ref={listRef} className="relative mt-8 md:mt-10">
          {STAGES.map((s, i) => {
            const Viz = STAGE_VISUALS[s.id]
            return (
              <li
                key={s.id}
                id={`stage-${s.id}`}
                className="sticky mb-[10vh] scroll-mt-40 last:mb-0 [--stack-step:10px] [--stack-top:84px] md:[--stack-step:14px] md:[--stack-top:132px]"
                style={{ top: `calc(var(--stack-top) + ${i} * var(--stack-step))` }}
              >
                <article
                  data-stage-card
                  aria-labelledby={`stage-${s.id}-title`}
                  className="grid origin-top overflow-hidden rounded-3xl border border-line bg-bg shadow-[0_-8px_30px_-12px_rgba(0,0,0,0.12)] will-change-transform md:min-h-[460px] md:grid-cols-2"
                >
                  {/* text */}
                  <div className="flex flex-col p-7 sm:p-10">
                    <p className="font-mono text-sm text-muted">
                      <span className="text-ink">{String(i + 1).padStart(2, '0')}</span>/06
                    </p>
                    <p className="eyebrow mt-6">{s.stage}</p>
                    <h3 id={`stage-${s.id}-title`} className="mt-2 text-[clamp(1.75rem,2.8vw,2.5rem)] font-semibold text-ink">
                      {s.title}
                    </h3>
                    <p className="mt-4 max-w-md text-muted">{firstSentence(s.body)}</p>
                    <dl className="mt-auto pt-8">
                      {[
                        ['Input', s.input],
                        ['QA gate', s.qa],
                        ['Control', s.mechanism],
                      ].map(([k, v]) => (
                        <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-4 border-t border-line py-3 text-sm">
                          <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted">{k}</dt>
                          <dd className="text-ink">{v}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>

                  {/* diagram in a toned frame */}
                  <div className="p-3 sm:p-4 md:pl-0" style={{ background: `var(--stage-${i + 1})` }}>
                    <div className="relative h-full min-h-[260px] overflow-hidden rounded-2xl bg-[#0f1114]">
                      <Viz active={active >= i} />
                    </div>
                  </div>
                </article>
              </li>
            )
          })}
        </ol>

        <p className="mx-auto mt-12 max-w-2xl text-center text-sm text-muted">{PROCESS_INTRO.note}</p>
      </div>
    </section>
  )
}
