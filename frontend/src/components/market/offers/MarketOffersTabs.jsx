export default function MarketOffersTabs({ tab, onTabChange, incomingPendingCount }) {
  return (
    <div className="flex gap-2 border-b border-[var(--a-line)] px-5 py-4">
      <button onClick={() => onTabChange('incoming')} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${tab === 'incoming' ? 'border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] text-[var(--a-inverse-ink,#0a0a0a)]' : 'border-[var(--a-line)] text-[var(--a-ink,#fafafa)]/54 hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)]'}`}>
        Incoming {incomingPendingCount > 0 && <span className="ml-1 text-[#b87333]">{incomingPendingCount}</span>}
      </button>
      <button onClick={() => onTabChange('outgoing')} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${tab === 'outgoing' ? 'border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] text-[var(--a-inverse-ink,#0a0a0a)]' : 'border-[var(--a-line)] text-[var(--a-ink,#fafafa)]/54 hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)]'}`}>
        Sent
      </button>
    </div>
  )
}
