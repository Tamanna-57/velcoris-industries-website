import { useEffect, useState } from 'react'
import { flushSync } from 'react-dom'

function currentTheme() {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light'
}

/**
 * Light/dark toggle with a circular "drop" reveal that ripples out from the button
 * (View Transitions API). Falls back to an instant switch where unsupported or when
 * the user prefers reduced motion.
 */
export default function ThemeToggle() {
  const [theme, setTheme] = useState(currentTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try {
      localStorage.setItem('theme', theme)
    } catch {
      /* storage unavailable */
    }
  }, [theme])

  async function toggle(e) {
    const next = theme === 'dark' ? 'light' : 'dark'
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!document.startViewTransition || reduce) {
      setTheme(next)
      return
    }
    const rect = e.currentTarget.getBoundingClientRect()
    const x = rect.left + rect.width / 2
    const y = rect.top + rect.height / 2
    const r = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    const t = document.startViewTransition(() => {
      flushSync(() => {
        document.documentElement.dataset.theme = next
        setTheme(next)
      })
    })
    await t.ready
    document.documentElement.animate(
      { clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${r}px at ${x}px ${y}px)`] },
      { duration: 650, easing: 'cubic-bezier(0.7, 0, 0.25, 1)', pseudoElement: '::view-transition-new(root)' },
    )
  }

  const dark = theme === 'dark'
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={dark}
      aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
      title={dark ? 'Light theme' : 'Dark theme'}
      className="relative grid size-11 place-items-center rounded-full border border-line text-ink transition-colors hover:border-accent hover:text-accent"
    >
      <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
        {/* sun/moon morph: the mask circle slides in to carve the moon */}
        <mask id="moon-cut">
          <rect width="24" height="24" fill="white" />
          <circle
            cx={dark ? 17 : 30}
            cy={dark ? 7 : -6}
            r="6"
            fill="black"
            style={{ transition: 'cx .45s ease, cy .45s ease' }}
          />
        </mask>
        <circle
          cx="12"
          cy="12"
          r={dark ? 8 : 4.5}
          fill="currentColor"
          stroke="none"
          mask="url(#moon-cut)"
          style={{ transition: 'r .45s ease' }}
        />
        <g style={{ opacity: dark ? 0 : 1, transition: 'opacity .3s ease' }} strokeLinecap="round">
          <path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </g>
      </svg>
    </button>
  )
}
