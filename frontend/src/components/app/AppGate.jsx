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

        <div className="border border-[#ede9df]/14 bg-[#252523] p-5 sm:p-7">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#ede9df]/38">No funds move at gate</div>
          <div className="mt-10 grid gap-3">
            {['Identify wallet', 'Load market and room context', 'Prepare create, profile, and settings access'].map((item, index) => (
              <div key={item} className="flex items-center justify-between border-t border-[#ede9df]/10 py-4">
                <span className="text-[15px] tracking-[-0.01em] text-[#ede9df]/82">{item}</span>
                <span className="font-mono text-[10px] text-[#d8b15f]">0{index + 1}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
