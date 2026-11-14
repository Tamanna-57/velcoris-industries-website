import { useEffect, useState } from 'react'
import { NAV, SAMPLE_HREF } from '../lib/content'
import { ArrowRight } from './icons'
import Logo from './Logo'
import ThemeToggle from './ThemeToggle'

export default function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const current = typeof window === 'undefined' ? '/' : window.location.pathname

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
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

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled || open ? 'border-line bg-bg' : 'border-transparent bg-bg'
      }`}
    >
      <div className="container-x flex h-[72px] items-center justify-between gap-6">
        <a href="/" className="text-ink" aria-label="Velcoris Industries, home">
          <Logo className="h-8 w-auto sm:h-9" />
        </a>

        <nav aria-label="Primary" className="hidden lg:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={current.startsWith(item.href) ? 'page' : undefined}
                  className="nav-link rounded-full px-3.5 py-2 text-[0.9375rem] font-medium text-ink"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <a href={SAMPLE_HREF} className="btn-primary hidden sm:inline-flex">
            Request a sample <ArrowRight />
          </a>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-full border border-line text-ink lg:hidden"
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
