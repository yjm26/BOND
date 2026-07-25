import Hero from '../components/Hero'
import LandingCloseSection from '../components/landing/LandingCloseSection'
import LandingEndingsSection from '../components/landing/LandingEndingsSection'
import LandingManifesto from '../components/landing/LandingManifesto'
import LandingPillars from '../components/landing/LandingPillars'

/**
 * Landing: room hero + short system copy.
 * Market lives on /market — header and CTAs route there, no fake market UI.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <LandingManifesto />
      <LandingPillars />
      <LandingEndingsSection />
      <LandingCloseSection />
    </>
  )
}
