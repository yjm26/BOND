import AppBackToLanding from './AppBackToLanding'
import AppGateCopy from './gate/AppGateCopy'
import AppGateMark from './gate/AppGateMark'

export default function AppGate({ connecting, connectError, onConnect }) {
  return (
    <section className="relative min-h-screen bg-[#20201f] px-6 pt-6 text-[#ede9df] sm:px-10 lg:px-14">
      <div className="mb-4 sm:mb-6">
        <AppBackToLanding />
      </div>

      <div className="grid min-h-[calc(100vh-108px)] items-center gap-10 py-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:gap-8 lg:py-2 xl:gap-12">
        <AppGateCopy connecting={connecting} connectError={connectError} onConnect={onConnect} />
        <AppGateMark />
      </div>
    </section>
  )
}
