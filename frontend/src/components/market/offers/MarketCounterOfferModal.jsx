export default function MarketCounterOfferModal({ target, price, message, onPriceChange, onMessageChange, onCancel, onSubmit }) {
  if (!target) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-sm border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5 text-[var(--a-ink,#fafafa)] shadow-2xl shadow-black/40" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-[var(--a-line)] pb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted,#a3a3a3)]">Counter offer</div>
          <h4 className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-[var(--a-ink,#fafafa)]">{target.listingTitle}</h4>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--a-ink,#fafafa)]/40">Counter price</span>
            <div className="relative mt-2">
              <input type="number" step="0.01" min="0.01" value={price} onChange={(event) => onPriceChange(event.target.value)} className="h-12 w-full border border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] px-4 pr-16 text-[14px] text-[var(--a-ink,#fafafa)] outline-none focus:border-[var(--a-muted,#a3a3a3)]/60" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--a-faint)]">USDC</span>
            </div>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--a-ink,#fafafa)]/40">Message</span>
            <textarea value={message} onChange={(event) => onMessageChange(event.target.value)} rows={2} className="mt-2 w-full resize-none border border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] px-4 py-3 text-[14px] text-[var(--a-ink,#fafafa)] outline-none placeholder:text-[var(--a-ink,#fafafa)]/28 focus:border-[var(--a-muted,#a3a3a3)]/60" placeholder="Short counter note" maxLength={200} />
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="h-10 flex-1 border border-[var(--a-line)] font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink,#fafafa)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)]">Cancel</button>
            <button onClick={() => onSubmit(target.id)} disabled={!price || Number(price) <= 0} className="h-10 flex-1 border border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink,#0a0a0a)] transition hover:bg-transparent hover:text-[var(--a-ink,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40">Counter →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
