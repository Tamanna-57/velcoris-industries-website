import Applications from './components/Applications'
import Approach from './components/Approach'
import Credentials from './components/Credentials'
import Footer, { ClosingCTA } from './components/Footer'
import Header from './components/Header'
import Hero from './components/Hero'
import Opportunity from './components/Opportunity'
import ProcessVideo from './components/ProcessVideo'
import Steps from './components/Steps'

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
        <Hero />
        <ProcessVideo />
        <Approach />
        <Opportunity />
        <Applications />
        <Credentials />
        <Steps />
        <ClosingCTA />
      </main>
      <Footer />
    </>
  )
}
