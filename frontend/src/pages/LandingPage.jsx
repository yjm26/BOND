import Hero from '../components/Hero'
import HowItWorks from '../components/HowItWorks'
import RoomClaritySection from '../components/room-clarity/RoomClaritySection'
import UseCasesSection from '../components/use-cases/UseCasesSection'

export default function LandingPage({ wallet, onConnect }) {
  return (
    <>
      <Hero wallet={wallet} onConnect={onConnect} />
      <RoomClaritySection />
      <UseCasesSection />
      <HowItWorks />
    </>
  )
}
