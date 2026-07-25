import AppBackToLanding from './AppBackToLanding'

export default function AppGate({ connecting, connectError, onConnect }) {
  return (
    <section className="relative min-h-screen bg-[#20201f] px-6 pt-6 text-[#ede9df] sm:px-10 lg:px-14">
      <div className="mb-6 sm:mb-8">
        <AppBackToLanding />
      </div>
      <div className="grid min-h-[calc(100vh-120px)] gap-10 py-6 lg:grid-cols-[44%_1fr] lg:items-center lg:gap-4 lg:py-0 xl:grid-cols-[42%_1fr]">
        <div className="relative z-10 max-w-[680px]">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">BOND Gate</div>
          <h1 className="mt-5 max-w-[620px] text-[clamp(48px,7vw,96px)] font-medium leading-[0.9] tracking-[-0.08em]">
            Connect wallet to enter your deal workspace.
          </h1>
          <button
            onClick={onConnect}
            disabled={connecting}
            className="mt-9 inline-flex h-12 items-center justify-center border border-[#ede9df] bg-[#ede9df] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
          >
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </button>
          {connectError && (
            <div className="mt-4 max-w-[540px] border border-[#8d2f2f]/40 bg-[#8d2f2f]/10 px-4 py-3 text-[13px] leading-[1.55] text-[#f0c2b8]">
              {connectError}
            </div>
          )}
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center overflow-visible lg:min-h-[520px] lg:justify-end">
          <div className="relative flex w-full flex-col items-center lg:-mr-10 lg:items-end xl:-mr-16 2xl:-mr-20">
            <img
              src="/brand/bond-logo-white.png"
              alt="BOND"
              draggable="false"
              className="w-[min(86vw,540px)] max-w-none select-none object-contain opacity-[0.96] sm:w-[min(70vw,620px)] lg:w-[min(54vw,760px)] xl:w-[min(56vw,860px)] 2xl:w-[900px]"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
