import { useState } from 'react'
import { DISPERSION } from '../lib/technology'
import { useInView } from '../lib/hooks'
import SectionHeading from './SectionHeading'

// Technology "Dispersion & integration protocols" as 3D folders (reference: Loopsii tiles).
// Folders swing up into place in perspective as the row scrolls in; each cover carries the
// title, a handwritten key spec and an animated black glyph. Hover / focus / tap opens the
// folder: the cover tips forward and a sheet with the one-line key point slides up.

function Glyph({ kind }) {
  const common = { viewBox: '0 0 120 48', className: 'h-auto w-[62%] text-ink', 'aria-hidden': true }
  if (kind === 0)
    // Solvent: droplets swelling in turn
    return (
      <svg {...common}>
        {[0, 1, 2, 3].map((i) => (
          <ellipse key={i} className="fg-pulse" style={{ animationDelay: `${i * 0.18}s` }} cx={16 + i * 29} cy="24" rx="13" ry="20" fill="currentColor" />
        ))}
      </svg>
    )
  if (kind === 1)
    // Shear: rotor spinning
    return (
      <svg {...common}>
        <g className="fg-spin" style={{ transformOrigin: '24px 24px' }}>
          {[0, 60, 120, 180, 240, 300].map((a) => (
            <path key={a} d="M24 24 C 30 14, 40 10, 46 12 C 40 18, 32 22, 24 24 Z" fill="currentColor" transform={`rotate(${a} 24 24)`} />
          ))}
        </g>
      </svg>
    )
  if (kind === 2)
    // Resin compounding: two halves folding together
    return (
      <svg {...common}>
        <path className="fg-merge-l" d="M34 4 A 20 20 0 0 0 34 44 Z" fill="currentColor" />
        <path className="fg-merge-r" d="M40 4 A 20 20 0 0 1 40 44 Z" fill="currentColor" />
      </svg>
    )
  // Storage: sealed cells lighting in turn
  return (
    <svg {...common}>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="fg-blink" style={{ animationDelay: `${i * 0.35}s` }} x={2 + i * 28} y="22" width="20" height="22" rx="3" fill="currentColor" />
      ))}
    </svg>
  )
}

function Folder({ item, i }) {
  const [open, setOpen] = useState(false)
  const id = `fold-${i}`
  return (
    <li className="folder-in" style={{ '--i': i }}>
      <div
        className="folder"
        data-open={open}
        tabIndex={0}
        role="button"
        aria-expanded={open}
        aria-labelledby={`${id}-t`}
        aria-describedby={`${id}-d`}
        onClick={() => setOpen((v) => !v)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            setOpen((v) => !v)
          }
          if (e.key === 'Escape') setOpen(false)
        }}
        onMouseLeave={() => setOpen(false)}
        style={{ '--fold': `var(--fold-${i + 1})` }}
      >
        <span className="folder-back" aria-hidden="true" />
        <div className="folder-paper">
          <p className="font-mono text-xs uppercase tracking-[0.1em] text-muted">{item.title}</p>
          <p id={`${id}-d`} className="mt-2 text-[15px] leading-snug text-ink">{item.short}</p>
        </div>
        <div className="folder-front">
          <h3 id={`${id}-t`} className="font-sans text-[17px] font-semibold leading-tight tracking-[-0.01em] text-ink">{item.title}</h3>
          <p className="folder-label mt-1">{item.label}</p>
          <div className="mt-auto">
            <Glyph kind={i} />
          </div>
        </div>
      </div>
    </li>
  )
}

export default function DispersionFolders() {
  const [ref, inView] = useInView('0px 0px -12% 0px')
  return (
    <section aria-labelledby="dispersion-title" className="bg-surface py-14 md:py-20">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <SectionHeading id="dispersion-title" eyebrow={DISPERSION.eyebrow} first={DISPERSION.title} align="center" size="md" />
          <p className="mt-4 text-muted">{DISPERSION.body}</p>
        </div>
        <ul ref={ref} data-in={inView} className="folders mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {DISPERSION.items.map((item, i) => (
            <Folder key={item.title} item={item} i={i} />
          ))}
        </ul>
        <p className="mt-6 text-center font-mono text-xs uppercase tracking-[0.1em] text-muted">
          <span className="hidden [@media(hover:hover)]:inline">Hover a folder to open it</span>
          <span className="[@media(hover:hover)]:hidden">Tap a folder to open it</span>
        </p>
      </div>
    </section>
  )
}
