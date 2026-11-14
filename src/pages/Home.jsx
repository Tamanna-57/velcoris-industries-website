import Approach from '../components/Approach'
import CleanProduction from '../components/CleanProduction'
import { FutureVision } from '../components/Footer'
import Hero from '../components/Hero'
import IndiaOpportunity from '../components/IndiaOpportunity'
import ProcessVideo from '../components/ProcessVideo'
import Recognition from '../components/Recognition'
import WorkWithUs from '../components/WorkWithUs'

export default function Home() {
  return (
    <>
      {/* Redesigned */}
      <Hero />
      <ProcessVideo />
      <Approach />
      {/* Replicated from the original site (to be revised section by section) */}
      {/* Light section between the two dark bands, so dark and light alternate (client request). */}
      <Recognition />
      <CleanProduction />
      <IndiaOpportunity />
      <WorkWithUs />
      <FutureVision />
    </>
  )
}
