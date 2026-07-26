import Hero from '../components/Hero'
import ScrollReveal from '../components/ScrollReveal'
import LandingCloseSection from '../components/landing/LandingCloseSection'
import LandingEndingsSection from '../components/landing/LandingEndingsSection'
import LandingManifesto from '../components/landing/LandingManifesto'
import LandingRoomStatesSection from '../components/landing/LandingRoomStatesSection'
import LandingUseCasesSection from '../components/landing/LandingUseCasesSection'

/**
 * Landing composition only — each section is a separate module.
 * Flow: hero → manifesto → use cases → room states → endings → start.
 * Hero has its own entrance cascade; the rest reveal on scroll.
 */
export default function LandingPage() {
  return (
    <>
      <Hero />
      <ScrollReveal>
        <LandingManifesto />
      </ScrollReveal>
      <ScrollReveal>
        <LandingUseCasesSection />
      </ScrollReveal>
      <ScrollReveal>
        <LandingRoomStatesSection />
      </ScrollReveal>
      <ScrollReveal>
        <LandingEndingsSection />
      </ScrollReveal>
      <ScrollReveal>
        <LandingCloseSection />
      </ScrollReveal>
    </>
  )
}
