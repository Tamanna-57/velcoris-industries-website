import { FACTS, RECOGNITION } from '../lib/content'
import { useReveal } from '../lib/hooks'

/**
 * Recognition + company facts. Old heading ("Recognised by the world's most demanding
 * selectors") overstated two national shortlists; plain, accurate labels earn more
 * trust with B2B/B2G buyers.
 */
export default function Credentials() {
  const ref = useReveal()
  return (
    <section ref={ref} aria-labelledby="cred-title" className="bg-bg py-20 md:py-24">
      <div className="container-x grid gap-12 md:grid-cols-12">
        <div className="reveal md:col-span-4">
          <p className="eyebrow">Recognition</p>
          <h2 id="cred-title" className="mt-4 text-[clamp(1.75rem,3vw,2.5rem)] text-ink">Early, independent validation.</h2>
        </div>

        <ul className="reveal grid gap-4 sm:grid-cols-2 md:col-span-8">
          {RECOGNITION.map((r) => (
            <li key={r.title} className="rounded-2xl border border-line p-6">
              <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{r.org}</p>
              <p className="mt-3 font-display text-xl font-semibold tracking-[-0.02em] text-ink">{r.title}</p>
              <p className="mt-6 inline-flex rounded-full bg-surface px-3 py-1 text-sm font-medium text-ink">{r.status}</p>
            </li>
          ))}
        </ul>

        <dl className="reveal grid grid-cols-2 gap-y-8 border-t border-line pt-10 md:col-span-12 md:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="flex flex-col-reverse">
              <dt className="mt-1 font-mono text-xs uppercase tracking-[0.1em] text-muted">{f.label}</dt>
              <dd className="font-display text-2xl font-semibold tracking-[-0.02em] text-ink md:text-3xl">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
