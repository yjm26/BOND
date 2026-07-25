export default function ArbiterHeader({ role, disputes, loading, onRefresh }) {
  return (
    <div className="mb-5 border border-[var(--a-line)] bg-[var(--a-surface)] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--a-muted)]">Dispute desk</div>
          <h1 className="mt-5 text-[clamp(42px,6vw,76px)] font-medium leading-[0.9] tracking-[-0.08em] text-[var(--a-ink)]">Resolve rooms.</h1>
          <p className="mt-4 max-w-[640px] text-[14px] leading-[1.7] text-[var(--a-muted)]">A calm queue for frozen escrow rooms. Review parties, value, proof, and evidence before sending an on-chain arbiter decision.</p>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[340px]">
          <div className="border border-[var(--a-line)] bg-[var(--a-panel)] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[var(--a-ink)]/40">
            Role<br /><span className="text-[var(--a-muted)]">{role}</span>
          </div>
          <button onClick={onRefresh} disabled={loading} className="h-full min-h-14 border border-[var(--a-line)] bg-[var(--a-panel)] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] disabled:opacity-40">
            {loading ? 'Refreshing…' : `Refresh · ${disputes.length}`}
          </button>
        </div>
      </div>
    </div>
  )
}
