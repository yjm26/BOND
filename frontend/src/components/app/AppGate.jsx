import AppBackToLanding from './AppBackToLanding'
import AppGateCopy from './gate/AppGateCopy'
import AppGateMark from './gate/AppGateMark'

export default function AppGate({ connecting, connectError, onConnect }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#111111] text-[#fafafa]">
      <div className="absolute inset-x-0 top-0 z-20 px-6 pt-6 sm:px-10 lg:px-14">
        <AppBackToLanding />
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center px-6 py-24 sm:px-10">
        <div className="flex w-full max-w-[720px] flex-col items-center">
          <AppGateMark />
          <div className="mt-10 w-full sm:mt-12">
            <AppGateCopy connecting={connecting} connectError={connectError} onConnect={onConnect} />
          </div>
        </div>
      </div>
    </section>
  )
}
