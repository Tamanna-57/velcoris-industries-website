import LinkedInNews from '../components/LinkedInNews'
import MediaGallery from '../components/MediaGallery'
import { ArrowRight } from '../components/icons'
import { MEDIA_HERO, PRESS } from '../lib/media'

/* Media page. Hero, gallery and press section replicate the original
   velcorisindustries.com/media; "Latest from LinkedIn" is redesigned (LinkedInNews). */

function MediaHero() {
  return (
    <section aria-labelledby="media-title" className="hex-pattern-light bg-bg pb-16 pt-[calc(72px+5rem)] md:pb-20 md:pt-[calc(72px+7rem)]">
      <div className="container-x">
        <p className="eyebrow">{MEDIA_HERO.eyebrow}</p>
        <h1 id="media-title" className="mt-5 max-w-5xl text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
          <span className="block">{MEDIA_HERO.first}</span>
          <span className="block font-light">{MEDIA_HERO.second}</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-muted">{MEDIA_HERO.body}</p>
      </div>
    </section>
  )
}

function Press() {
  return (
    <section aria-labelledby="press-title" className="bg-surface py-20 md:py-24">
      <div className="container-x flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
        <div className="max-w-2xl">
          <p className="eyebrow">{PRESS.eyebrow}</p>
          <h2 id="press-title" className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] text-ink">{PRESS.title}</h2>
          <p className="mt-4 text-muted">{PRESS.body}</p>
        </div>
        <a href="/contact?intent=press" className="btn-primary shrink-0">
          {PRESS.cta} <ArrowRight />
        </a>
      </div>
    </section>
  )
}

export default function Media() {
  return (
    <>
      <MediaHero />
      <MediaGallery />
      <LinkedInNews />
      <Press />
    </>
  )
}
