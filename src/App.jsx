import { useEffect } from 'react'
import Footer from './components/Footer'
import Header from './components/Header'
import Home from './pages/Home'
import Media from './pages/Media'
import Technology from './pages/Technology'

// Minimal path-based routing (plain links, full page loads) — enough for the prototype.
// Hosting needs an SPA fallback to index.html; Vite dev/preview already do this.
const ROUTES = {
  '/': { page: Home, title: 'Velcoris Industries — Industrial Graphene, Made in India' },
  '/technology': { page: Technology, title: 'Closed-Loop Graphene Technology & Specs | Velcoris Industries' },
  '/media': { page: Media, title: 'Graphene Media, Lab Research & Facility Footage | Velcoris Industries' },
}

export default function App() {
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  const route = ROUTES[path] ?? ROUTES['/']
  useEffect(() => {
    document.title = route.title
  }, [route.title])
  const Page = route.page
  return (
    <>
      <a
        href="#main-content"
        className="sr-only z-[60] rounded-full bg-accent-strong px-4 py-2 text-on-accent focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <Header />
      <main id="main-content">
        <Page />
      </main>
      <Footer />
    </>
  )
}
