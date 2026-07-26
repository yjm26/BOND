export default function MarketToolbar({ wallet, showOffers, showForm, onToggleOffers, onToggleForm }) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--a-muted)]">Market</div>
      {wallet && (
        <div className="flex flex-wrap gap-2">
          <button onClick={onToggleOffers} className={`h-10 border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition-[transform,background-color,border-color,color] duration-160 ease-out active:scale-[0.97] ${showOffers ? 'border-[var(--a-ink)] bg-[var(--a-inverse-bg)] text-[var(--a-inverse-ink)]' : 'border-[var(--a-line-strong)] text-[color:var(--a-soft)] hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]'}`}>Offers</button>
          <button onClick={onToggleForm} className="h-10 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition-[transform,background-color,color] duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97]">{showForm ? 'Cancel' : 'Post listing'}</button>
        </div>
      )}
    </div>
  )
}
