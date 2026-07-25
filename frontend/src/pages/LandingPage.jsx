import Hero from '../components/Hero'
import LandingCloseSection from '../components/landing/LandingCloseSection'
import LandingEndingsSection from '../components/landing/LandingEndingsSection'
import LandingManifesto from '../components/landing/LandingManifesto'
import LandingPillars from '../components/landing/LandingPillars'
import MarketStageSection from '../components/landing/MarketStageSection'

/**
 * Landing rhythm (Linear structure, BOND stark):
 * Hero room → manifesto → pillars → market chapter → endings (dark) → dual door
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <LandingManifesto />
      <LandingPillars />
      <MarketStageSection />
      <LandingEndingsSection />
      <LandingCloseSection />
    </>
  )
}
