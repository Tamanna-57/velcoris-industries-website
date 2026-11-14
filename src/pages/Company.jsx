import CompanyGrid from '../components/CompanyGrid'
import SectionHeading from '../components/SectionHeading'
import { ArrowRight, ArrowUpRight } from '../components/icons'
import { FOUNDER, JOIN, LEADERSHIP, MISSION } from '../lib/company'
import { useReveal } from '../lib/hooks'

function Linkedin({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3zM9.5 9.75h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.15-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92h-4z" />
    </svg>
  )
}

/** Our mission: replicated from the original. */
function MissionHero() {
  return (
    <section aria-labelledby="company-title" className="hex-pattern-light bg-bg pb-10 pt-[calc(72px+5rem)] md:pb-14 md:pt-[calc(72px+6rem)]">
      <div className="container-x">
        <p className="eyebrow">{MISSION.eyebrow}</p>
        <h1 id="company-title" className="mt-5 max-w-6xl text-[clamp(2.5rem,4.6vw,4.25rem)] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
          <span className="block">{MISSION.first}</span>
          <span className="block font-light">{MISSION.second}</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-muted">{MISSION.body}</p>
      </div>
    </section>
  )
}

/** Founder's note, condensed to the founder's photo and two lines (client request). */
function FounderNote() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="founder-title" className="bg-bg pb-12 md:pb-16">
      <div className="container-x">
        <figure className="reveal grid items-center gap-8 border-t border-line pt-12 md:grid-cols-[minmax(0,15rem)_minmax(0,1fr)] md:gap-12 lg:grid-cols-[minmax(0,17rem)_minmax(0,1fr)]">
          <img
            src={FOUNDER.photo}
            alt={`${FOUNDER.name}, ${FOUNDER.role}`}
            width="1097"
            height="1097"
            loading="lazy"
            className="aspect-square w-48 rounded-2xl bg-surface object-cover md:w-full"
          />
          <div>
            <p id="founder-title" className="font-mono text-xs uppercase tracking-[0.12em] text-muted">{FOUNDER.eyebrow}</p>
            <blockquote className="mt-4 max-w-3xl text-[clamp(1.35rem,2.2vw,1.9rem)] font-medium leading-[1.3] tracking-[-0.015em] text-ink">
              “{FOUNDER.quote}”
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              <span>
                <span className="block font-semibold text-ink">{FOUNDER.name}</span>
                <span className="block text-sm text-muted">{FOUNDER.role}</span>
              </span>
              <a href={FOUNDER.linkedin} target="_blank" rel="noreferrer" className="ml-2 inline-flex size-10 items-center justify-center rounded-full border border-line text-accent transition-colors hover:border-accent" aria-label={`${FOUNDER.name} on LinkedIn (opens in a new tab)`}>
                <Linkedin className="size-4" aria-hidden="true" />
              </a>
            </figcaption>
          </div>
        </figure>
      </div>
    </section>
  )
}

/** Leadership Board: replicated from the original. */
function Leadership() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="leadership-title" className="bg-bg py-12 md:py-16">
      <div className="container-x">
        <div className="reveal mx-auto max-w-2xl text-center">
          <SectionHeading id="leadership-title" eyebrow={LEADERSHIP.eyebrow} first={LEADERSHIP.first} second={LEADERSHIP.second} align="center" size="md" />
          <p className="mt-5 text-muted">{LEADERSHIP.body}</p>
        </div>
        <ul className="mt-12 flex justify-center">
          {LEADERSHIP.people.map((p) => (
            <li key={p.name} className="reveal grid w-full max-w-3xl gap-6 rounded-3xl border border-line bg-bg p-6 sm:grid-cols-[10rem_minmax(0,1fr)] sm:items-center md:p-8">
              <img src={p.photo} alt={p.name} width="1015" height="1015" loading="lazy" className="aspect-square w-32 rounded-2xl bg-surface object-cover sm:w-full" />
              <div>
                <h3 className="text-xl font-semibold text-ink">{p.name}</h3>
                <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{p.role}</p>
                <p className="mt-3 text-muted">{p.bio}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4">
                  <a href={p.card} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-accent">
                    View Business Card <ArrowUpRight />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                  <a href={p.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-accent">
                    <Linkedin className="size-4" aria-hidden="true" /> LinkedIn
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

/** Join us: replicated from the original. */
function JoinUs() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="join-title" className="bg-surface py-12 md:py-16">
      <div className="container-x">
        <div className="reveal hex-pattern rounded-3xl bg-band px-6 py-16 text-center sm:px-12 md:py-20">
          <SectionHeading id="join-title" eyebrow={JOIN.eyebrow} first={JOIN.first} second={JOIN.second} align="center" tone="band" />
          <p className="mx-auto mt-5 max-w-2xl text-band-muted">{JOIN.body}</p>
          <a href={JOIN.href} className="btn-primary mt-9">
            {JOIN.cta} <ArrowRight />
          </a>
        </div>
      </div>
    </section>
  )
}

export default function Company() {
  return (
    <>
      <MissionHero />
      <FounderNote />
      <CompanyGrid />
      <Leadership />
      <JoinUs />
    </>
  )
}
