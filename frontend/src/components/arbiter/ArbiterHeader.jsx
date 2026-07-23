export default function ArbiterHeader({ role, disputes, loading, onRefresh }) {
  return (
    <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">Dispute desk</div>
          <h1 className="mt-5 text-[clamp(42px,6vw,76px)] font-medium leading-[0.9] tracking-[-0.08em] text-[#ede9df]">Resolve rooms.</h1>
          <p className="mt-4 max-w-[640px] text-[14px] leading-[1.7] text-[#b9b2a5]">A calm queue for frozen escrow rooms. Review parties, value, proof, and evidence before sending an on-chain arbiter decision.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[340px]">
          <div className="border border-[#ede9df]/10 bg-[#111110] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#ede9df]/40">
            Role<br /><span className="text-[#d8b15f]">{role}</span>
          </div>
          <button onClick={onRefresh} disabled={loading} className="h-full min-h-14 border border-[#ede9df]/14 bg-[#111110] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df] disabled:opacity-40">
            {loading ? 'Refreshing…' : `Refresh · ${disputes.length}`}
          </button>
        </div>
      </div>
    </div>
  )
}
