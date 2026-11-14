import SectorRows from '../components/SectorRows'
import { APPS_HERO } from '../lib/applications'

/* Applications page. Hero replicates the original; the sector list is redesigned in the
   style of the client's reference (WLX "Work" list) with 4 sectors + "View all". */

function AppsHero() {
  return (
    <section aria-labelledby="apps-title" className="hex-pattern-light bg-bg pb-20 pt-[calc(72px+5rem)] md:pb-28 md:pt-[calc(72px+7rem)]">
      <div className="container-x">
        <p className="eyebrow">{APPS_HERO.eyebrow}</p>
        <h1 id="apps-title" className="mt-5 max-w-5xl text-[clamp(2.5rem,5.4vw,4.75rem)] font-semibold leading-[1.0] tracking-[-0.035em] text-ink">
          <span className="block">{APPS_HERO.first}</span>
          <span className="block font-light">{APPS_HERO.second}</span>
        </h1>
        <p className="mt-7 max-w-2xl text-lg text-muted">{APPS_HERO.body}</p>
      </div>
    </section>
  )
}

export default function Applications() {
  return (
    <>
      <AppsHero />
      <SectorRows />
    </>
  )
}
