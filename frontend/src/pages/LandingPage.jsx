import Hero from '../components/Hero'
import LandingCloseSection from '../components/landing/LandingCloseSection'
import MarketStageSection from '../components/landing/MarketStageSection'

/**
 * Landing: Room hero → Market stage → dual door close.
 * Linear density, BOND stark. No essay stacks.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <MarketStageSection />
      <LandingCloseSection />
    </>
  )
}
