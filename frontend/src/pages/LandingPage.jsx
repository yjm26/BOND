import Hero from '../components/Hero'
import LandingCloseSection from '../components/landing/LandingCloseSection'
import LandingEndingsSection from '../components/landing/LandingEndingsSection'
import LandingManifesto from '../components/landing/LandingManifesto'

/**
 * Landing: hero room → manifesto → endings → dual door.
 * Market lives on /market.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <LandingManifesto />
      <LandingEndingsSection />
      <LandingCloseSection />
    </>
  )
}
