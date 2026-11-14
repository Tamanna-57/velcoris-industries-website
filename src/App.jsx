import { useCallback, useEffect, useRef, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Applications from './pages/Applications'
import Company from './pages/Company'
import Media from './pages/Media'
import Technology from './pages/Technology'

// Path-based routing with client-side navigation between known pages, so the page transition
// (reference: header_hover_animation) can play. Unknown paths fall back to a normal page load.
// Hosting needs an SPA fallback to index.html (vercel.json); Vite dev/preview already do this.
const ROUTES = {
  '/': { page: Home, title: 'Velcoris Industries — Industrial Graphene, Made in India' },
  '/company': { page: Company, title: 'About Velcoris Industries | Indigenous Graphene Hub India' },
  '/technology': { page: Technology, title: 'Closed-Loop Graphene Technology & Specs | Velcoris Industries' },
  '/applications': { page: Applications, title: 'Graphene Applications: Defence, EV & Concrete | Velcoris Industries' },
  '/media': { page: Media, title: 'Graphene Media, Lab Research & Facility Footage | Velcoris Industries' },
}
const norm = (p) => p.replace(/\/$/, '') || '/'

// Reference timing: page-colour panel rises from the bottom (~0.45 s), short hold while the next
// page mounts, then the panel retracts upward so the new page is revealed bottom-up and the
// header appears last (~0.55 s).
const COVER_MS = 450
const HOLD_MS = 120
const REVEAL_MS = 550

export default function App() {
  const [path, setPath] = useState(() => norm(window.location.pathname))
  const [phase, setPhase] = useState('idle') // idle | cover | reveal
  const busy = useRef(false)
  const route = ROUTES[path] ?? ROUTES['/']

  useEffect(() => {
    document.title = route.title
  }, [route.title])

  const go = useCallback((to, push = true) => {
    const url = new URL(to, window.location.href)
    const next = norm(url.pathname)
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const swap = () => {
      if (push) window.history.pushState({}, '', url.pathname + url.search)
      setPath(next)
      window.scrollTo(0, 0)
    }
    if (reduced) {
      swap()
      return
    }
    busy.current = true
    setPhase('cover')
    setTimeout(() => {
      swap()
      setTimeout(() => {
        setPhase('reveal')
        setTimeout(() => {
          setPhase('idle')
          busy.current = false
        }, REVEAL_MS)
      }, HOLD_MS)
    }, COVER_MS)
  }, [])

  // Intercept same-origin links to known pages (plain left clicks only).
  useEffect(() => {
    const onClick = (e) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = e.target.closest('a[href]')
      if (!a || a.target === '_blank' || a.hasAttribute('download')) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      const next = norm(url.pathname)
      if (!ROUTES[next] || url.search) return
      if (next === norm(window.location.pathname)) {
        if (url.hash) return // in-page anchor
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      e.preventDefault()
      if (!busy.current) go(url.href)
    }
    const onPop = () => setPath(norm(window.location.pathname))
    document.addEventListener('click', onClick)
    window.addEventListener('popstate', onPop)
    return () => {
      document.removeEventListener('click', onClick)
      window.removeEventListener('popstate', onPop)
    }
  }, [go])

  const Page = route.page
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-full bg-accent-strong px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Header key={path} />
      <main id="main-content" key={path}>
        <Page />
      </main>
      <Footer />
      <div aria-hidden="true" className={`page-curtain page-curtain--${phase}`} />
    </>
  )
}
