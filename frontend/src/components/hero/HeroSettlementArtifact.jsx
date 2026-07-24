const LEDGER_ROWS = [
  ['room', 'BOND-042'],
  ['state', 'DELIVERED'],
  ['locked', '500.00 USDC'],
  ['next', 'RELEASE / DISPUTE'],
]

export default function HeroSettlementArtifact() {
  return (
    <div className="relative hidden min-h-[560px] overflow-hidden border-l border-[#0d0d0b]/10 lg:block">
      <div className="absolute inset-0 bg-[#20201f]" />
      <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(rgba(237,233,223,0.22)_1px,transparent_1px),linear-gradient(90deg,rgba(237,233,223,0.22)_1px,transparent_1px)] [background-size:42px_42px]" />
      <div className="absolute -right-20 top-10 h-[420px] w-[420px] rounded-full bg-[#d8b15f]/10 blur-[120px]" />
      <div className="absolute -bottom-24 left-12 h-[360px] w-[360px] rounded-full bg-[#b7c8a3]/10 blur-[130px]" />

      <img
        src="/brand/bond-logo-white.png"
        alt=""
        aria-hidden="true"
        draggable="false"
        className="absolute right-[-7vw] top-[9vh] w-[min(42vw,680px)] max-w-none select-none opacity-[0.08]"
      />

      <div className="relative z-10 flex min-h-[calc(100vh-72px)] flex-col justify-between p-10 xl:p-12">
        <div className="flex items-center justify-between border-b border-[#ede9df]/20 pb-4 font-mono text-[10px] uppercase tracking-[0.2em] text-[#ede9df]/60">
          <span>Settlement artifact</span>
          <span>Arc testnet</span>
        </div>

        <div className="mx-auto w-full max-w-[540px]">
          <div className="mb-8 font-mono text-[11px] uppercase leading-[1.8] tracking-[0.2em] text-[#ede9df]/60">
            buyer ───── room ───── seller<br />
            <span className="text-[#d8b15f]/80">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;│</span><br />
            <span className="text-[#ede9df]/40">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;arbiter fallback</span>
          </div>

          <div className="border border-[#ede9df]/25 bg-[#111110]/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.36)] backdrop-blur-sm">
            <div className="flex items-center justify-between border-b border-[#ede9df]/15 pb-4">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">Escrow room</div>
                <div className="mt-2 text-[30px] font-medium leading-none tracking-[-0.07em] text-[#ede9df]">money waits here</div>
              </div>
              <div className="grid h-12 w-12 place-items-center border border-[#ede9df]/15">
                <img src="/brand/bond-logo-white.png" alt="" aria-hidden="true" draggable="false" className="w-9 opacity-90" />
              </div>
            </div>

            <div className="divide-y divide-[#ede9df]/10">
              {LEDGER_ROWS.map(([label, value]) => (
                <div key={label} className="grid grid-cols-[120px_1fr] gap-5 py-4 font-mono text-[11px] uppercase tracking-[0.16em]">
                  <span className="text-[#ede9df]/50">{label}</span>
                  <span className="text-[#ede9df]/90">{value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-px bg-[#ede9df]/15 p-px font-mono text-[9px] uppercase tracking-[0.14em] text-[#ede9df]/60">
              <div className="bg-[#20201f] p-3">funded</div>
              <div className="bg-[#20201f] p-3 text-[#d8b15f]">proof</div>
              <div className="bg-[#20201f] p-3">settle</div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#ede9df]/20 pt-4 font-mono text-[10px] uppercase leading-[1.7] tracking-[0.18em] text-[#ede9df]/50">
          No hidden middleman moment. Release, refund, or dispute review.
        </div>
      </div>
    </div>
  )
}
