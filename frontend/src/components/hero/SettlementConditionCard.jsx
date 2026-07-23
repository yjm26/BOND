export default function SettlementConditionCard() {
  return (
    <div className="absolute bottom-3 left-0 w-[330px] max-w-[82vw] border border-[#ede9df]/15 bg-[#ede9df] p-4 text-[#0d0d0b] shadow-[12px_12px_0_rgba(237,233,223,0.08)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#0d0d0b]/45">Current condition</div>
      <div className="mt-3 text-[22px] font-medium leading-none tracking-[-0.04em]">Release blocked until proof is accepted.</div>
      <div className="mt-4 grid grid-cols-2 gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#0d0d0b]/60">
        <span>Proof hash: attached</span>
        <span>Timeout: 7d</span>
      </div>
    </div>
  )
}
