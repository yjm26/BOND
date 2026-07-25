import AppBackToLanding from './AppBackToLanding'
import AppGateCopy from './gate/AppGateCopy'
import AppGateMark from './gate/AppGateMark'

export default function AppGate({ connecting, connectError, onConnect }) {
  return (
    <section className="relative min-h-screen bg-[#20201f] px-6 pt-6 text-[#ede9df] sm:px-10 lg:px-14">
      <div className="mb-6 sm:mb-8">
        <AppBackToLanding />
      </div>

      <div className="grid min-h-[calc(100vh-120px)] items-center gap-12 py-8 lg:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] lg:gap-16 lg:py-4 xl:grid-cols-[minmax(0,1fr)_340px]">
        <AppGateCopy connecting={connecting} connectError={connectError} onConnect={onConnect} />
        <AppGateMark />
      </div>
    </section>
  )
}
