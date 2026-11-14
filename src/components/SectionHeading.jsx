/**
 * Two-line heading, keeping the original site's structure ("Three steps from sample /
 * to production supply."). The original's grey Playfair italic second line is replaced
 * by the same typeface in a lighter weight: same rhythm, no AI-template look, full contrast.
 */
export default function SectionHeading({ eyebrow, first, second, id, align = 'left', tone = 'page', size = 'lg' }) {
  const ink = tone === 'band' ? 'text-band-ink' : 'text-ink'
  const eyebrowTone = tone === 'band' ? 'text-band-muted' : 'text-muted'
  const sizes = { lg: 'text-[clamp(2.25rem,4.6vw,3.75rem)]', md: 'text-[clamp(2rem,3.8vw,3rem)]' }
  return (
    <div className={align === 'center' ? 'mx-auto text-center' : ''}>
      {eyebrow && (
        <p className={`font-mono text-xs uppercase tracking-[0.12em] ${eyebrowTone}`}>{eyebrow}</p>
      )}
      <h2 id={id} className={`mt-4 ${sizes[size]} ${ink}`}>
        <span className="block">{first}</span>
        {second && <span className="block font-light">{second}</span>}
      </h2>
    </div>
  )
}
