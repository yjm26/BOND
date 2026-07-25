export default function MarketToolbar({ wallet, showOffers, showForm, onToggleOffers, onToggleForm }) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--a-muted,#a3a3a3)]">Market</div>
      {wallet && (
        <div className="flex flex-wrap gap-2">
          <button onClick={onToggleOffers} className={`h-10 border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition ${showOffers ? 'border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] text-[var(--a-inverse-ink,#0a0a0a)]' : 'border-[var(--a-line-strong)] text-[color:var(--a-soft)] hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)]'}`}>Offers</button>
          <button onClick={onToggleForm} className="h-10 border border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink,#0a0a0a)] transition hover:bg-transparent hover:text-[var(--a-ink,#fafafa)]">{showForm ? 'Cancel' : 'Post listing'}</button>
        </div>
      )}
    </div>
  )
}
