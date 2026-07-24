export default function AppGate({ connecting, connectError, onConnect }) {
  return (
    <section className="min-h-screen bg-[#20201f] px-6 pt-[112px] text-[#ede9df] sm:px-10 lg:px-14">
      <div className="grid min-h-[calc(100vh-112px)] gap-10 py-10 lg:grid-cols-[46%_1fr] lg:items-center lg:gap-8 lg:py-0 xl:grid-cols-[44%_1fr]">
        <div className="relative z-10 max-w-[680px]">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">BOND Gate</div>
          <h1 className="mt-5 max-w-[620px] text-[clamp(48px,7vw,96px)] font-medium leading-[0.9] tracking-[-0.08em]">
            Connect wallet to enter your deal workspace.
          </h1>
          <button
            onClick={onConnect}
            disabled={connecting}
            className="mt-9 inline-flex h-12 items-center justify-center border border-[#ede9df] bg-[#ede9df] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </button>
          {connectError && (
            <div className="mt-4 max-w-[540px] border border-[#8d2f2f]/40 bg-[#8d2f2f]/10 px-4 py-3 text-[13px] leading-[1.55] text-[#f0c2b8]">
              {connectError}
            </div>
          )}
        </div>

        <div className="relative flex min-h-[280px] items-center justify-center lg:min-h-[520px] lg:justify-start">
          <div className="absolute left-0 top-1/2 hidden h-px w-[18vw] -translate-y-1/2 bg-[#ede9df]/12 lg:block" />
          <div className="relative flex w-full flex-col items-center lg:items-start lg:pl-[12vw] xl:pl-[10vw]">
            <img
              src="/brand/bond-logo-white.png"
              alt="BOND"
              draggable="false"
              className="w-[min(76vw,440px)] max-w-full select-none object-contain opacity-[0.96] sm:w-[min(58vw,500px)] lg:w-[min(36vw,560px)] xl:w-[min(38vw,620px)]"
            />
            <div className="mt-8 grid w-full max-w-[430px] gap-3 border-t border-[#ede9df]/12 pt-5 text-center lg:text-left">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">One wallet. One clean session.</div>
              <p className="text-[14px] leading-[1.6] tracking-[-0.01em] text-[#ede9df]/54">
                BOND loads rooms, market context, and profile access only after the wallet is confirmed.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
