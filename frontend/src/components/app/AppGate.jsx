export default function AppGate({ connecting, connectError, onConnect }) {
  return (
    <section className="min-h-screen bg-[#20201f] px-6 pt-[112px] text-[#ede9df] sm:px-10 lg:px-14">
      <div className="grid min-h-[calc(100vh-112px)] gap-12 lg:grid-cols-[42%_1fr] lg:items-center">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">BOND Gate</div>
          <h1 className="mt-5 max-w-[640px] text-[clamp(48px,7vw,96px)] font-medium leading-[0.9] tracking-[-0.08em]">
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

        <div className="flex min-h-[300px] items-center justify-center lg:min-h-[420px]">
          <img
            src="/brand/bond-logo-white.png"
            alt="BOND"
            draggable="false"
            className="w-[min(72vw,520px)] max-w-full select-none object-contain opacity-[0.96] sm:w-[min(58vw,560px)] lg:w-[min(42vw,620px)]"
          />
        </div>
      </div>
    </section>
  )
}
