import { useCallback, useEffect, useState } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Admin from './pages/Admin'
import Applications from './pages/Applications'
import Company from './pages/Company'
import Contact from './pages/Contact'
import Media from './pages/Media'
import Technology from './pages/Technology'

// Path-based routing with instant client-side navigation between known pages. Unknown paths fall back to a normal page load.
// Hosting needs an SPA fallback to index.html (vercel.json); Vite dev/preview already do this.
const ROUTES = {
  '/': { page: Home, title: 'Velcoris Industries — Industrial Graphene, Made in India' },
  '/company': { page: Company, title: 'About Velcoris Industries | Indigenous Graphene Hub India' },
  '/technology': { page: Technology, title: 'Closed-Loop Graphene Technology & Specs | Velcoris Industries' },
  '/applications': { page: Applications, title: 'Graphene Applications: Defence, EV & Concrete | Velcoris Industries' },
  '/admin': { page: Admin, title: 'Enquiries · Velcoris Admin' },
  '/contact': { page: Contact, title: 'Contact Us & Request Samples | Velcoris Industries' },
  '/media': { page: Media, title: 'Graphene Media, Lab Research & Facility Footage | Velcoris Industries' },
}
const norm = (p) => p.replace(/\/$/, '') || '/'

// Deploy check: client-side navigation keeps the JS bundle that was loaded first, so a tab opened
// before a deploy would keep showing the old site. On each nav click we compare the bundle in the
// live index.html with ours; if it changed, the click becomes a full page load (fresh version).
const BUILD = document.querySelector('script[type="module"][src*="/assets/"]')?.getAttribute('src') ?? null
async function hasNewBuild() {
  if (!BUILD) return false // dev server
  try {
    const html = await (await fetch('/', { cache: 'no-store' })).text()
    const m = html.match(/\/assets\/index-[\w-]+\.js/)
    return Boolean(m && !BUILD.endsWith(m[0]))
  } catch {
    return false
  }
}
const withTimeout = (p, ms) => Promise.race([p, new Promise((r) => setTimeout(() => r(false), ms))])

export default function App() {
  const [path, setPath] = useState(() => norm(window.location.pathname))
  const route = ROUTES[path] ?? ROUTES['/']

  useEffect(() => {
    document.title = route.title
  }, [route.title])

  const go = useCallback(async (to, push = true) => {
    const url = new URL(to, window.location.href)
    if (await withTimeout(hasNewBuild(), 1500)) {
      window.location.assign(url.href) // a new deploy is live: load it fresh
      return
    }
    sessionStorage.setItem('vc-from', window.location.pathname) // where an enquiry came from
    if (push) window.history.pushState({}, '', url.pathname + url.search + url.hash)
    setPath(norm(url.pathname))
    window.scrollTo(0, 0)
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
      if (!ROUTES[next]) return
      if (next === norm(window.location.pathname) && url.search === window.location.search) {
        if (url.hash) return // in-page anchor
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
      e.preventDefault()
      go(url.href)
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
      <Header key={`header-${path}`} />
      <main id="main-content" key={`main-${path}`}>
        <Page />
      </main>
      <Footer />
    </>
  )
}
