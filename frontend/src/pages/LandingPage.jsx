import Hero from '../components/Hero'
import LandingCloseSection from '../components/landing/LandingCloseSection'
import LandingEndingsSection from '../components/landing/LandingEndingsSection'
import LandingManifesto from '../components/landing/LandingManifesto'
import LandingRoomStatesSection from '../components/landing/LandingRoomStatesSection'
import LandingUseCasesSection from '../components/landing/LandingUseCasesSection'

/**
 * Landing composition only — each section is a separate module.
 * Flow: hero → manifesto → use cases → room states → endings → start.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <LandingManifesto />
      <LandingUseCasesSection />
      <LandingRoomStatesSection />
      <LandingEndingsSection />
      <LandingCloseSection />
    </>
  )
}
