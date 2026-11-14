import Approach from './components/Approach'
import CleanProduction from './components/CleanProduction'
import Footer, { FutureVision } from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import IndiaOpportunity from './components/IndiaOpportunity'
import ProcessVideo from './components/ProcessVideo'
import Recognition from './components/Recognition'
import WorkWithUs from './components/WorkWithUs'

export default function App() {
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
        {/* Redesigned */}
        <Hero />
        <ProcessVideo />
        <Approach />
        {/* Replicated from the original site (to be revised section by section) */}
        <Recognition />
        <IndiaOpportunity />
        <CleanProduction />
        <WorkWithUs />
        <FutureVision />
      </main>
      <Footer />
    </>
  )
}
