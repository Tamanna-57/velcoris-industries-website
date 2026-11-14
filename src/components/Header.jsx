import { useEffect, useState } from 'react'
import { NAV, SAMPLE_HREF } from '../lib/content'
import { ArrowRight } from './icons'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

/** Which nav item matches the current URL ("/technology#x" → "/technology"). */
function useCurrentPath() {
  const [path] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname.replace(/\/$/, '') || '/'))
  return path
}

/**
 * Floating header (reference: EquitiFy Assets).
 * - Nav sits in a frosted pill; the hovered item fades to grey while the rest stay solid.
 * - Over sections marked `data-header="dark"` the pill, logo and controls switch to a
 *   dark-glass tone so they stay legible (checked on scroll, rAF-throttled).
 */
export default function Header() {
  const [tone, setTone] = useState('page')
  const [open, setOpen] = useState(false)
  const current = useCurrentPath()

  useEffect(() => {
    let raf = 0
    const probeY = 36 // vertical centre of the header bar
    const update = () => {
      const dark = [...document.querySelectorAll('[data-header="dark"]')].some((el) => {
        const r = el.getBoundingClientRect()
        return r.top <= probeY && r.bottom >= probeY
      })
      setTone(dark ? 'dark' : 'page')
    }
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    // sections can change their own tone (e.g. the video once it's full-bleed)
    const mo = new MutationObserver(onScroll)
    mo.observe(document.body, { subtree: true, attributes: true, attributeFilter: ['data-header'] })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mo.disconnect()
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  const isCurrent = (href) => (href === '/' ? current === '/' : current.startsWith(href))

  return (
    <header className={`site-header fixed inset-x-0 top-0 z-50 ${open ? 'bg-bg' : ''}`} data-tone={open ? 'page' : tone}>
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <a href="/" className="text-[var(--hdr-ink)] transition-colors duration-300" aria-label="Velcoris Industries, home">
          <Logo className="h-8 w-auto sm:h-9" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="nav-pill flex items-center rounded-full border border-[var(--hdr-line)] bg-[var(--hdr-pill)] p-1 backdrop-blur-md transition-colors duration-300">
            {NAV.map((item) => {
              const on = isCurrent(item.href)
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    aria-current={on ? 'page' : undefined}
                    className="nav-link relative inline-flex min-h-10 items-center rounded-full px-4 text-[0.875rem] font-medium uppercase tracking-[0.04em] text-[var(--hdr-ink)]"
                  >
                    {item.label}
                    {on && <span className="absolute bottom-1.5 left-1/2 size-1 -translate-x-1/2 rounded-full bg-accent" aria-hidden="true" />}
                  </a>
                </li>
              )
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a href={SAMPLE_HREF} className="btn-primary hidden sm:inline-flex">
            Request a sample <ArrowRight />
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-[var(--hdr-line)] bg-[var(--hdr-pill)] text-[var(--hdr-ink)] backdrop-blur-md lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
              {open ? <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" /> : <path d="M4 8h16M4 16h16" strokeLinecap="round" />}
            </svg>
          </button>
        </div>
      </div>

      {open && (
        <nav id="mobile-menu" aria-label="Mobile" className="h-[calc(100svh-72px)] border-t border-line bg-bg lg:hidden">
          <ul className="container-x flex flex-col py-6">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={isCurrent(item.href) ? 'page' : undefined}
                  onClick={() => setOpen(false)}
                  className="nav-link flex items-center justify-between border-b border-line py-4 font-display text-2xl font-semibold text-ink"
                >
                  {item.label} <ArrowRight className="size-5" />
                </a>
              </li>
            ))}
            <li className="pt-8">
              <a href={SAMPLE_HREF} className="btn-primary w-full justify-center">
                Request a sample <ArrowRight />
              </a>
            </li>
          </ul>
        </nav>
      )}
    </header>
  )
}
