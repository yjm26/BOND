export default function MarketEmptyState({ search, wallet }) {
  const title = search ? 'No matching listings' : 'No listings yet'
  const body = search
    ? `Nothing matches “${search}”. Clear search or change filters.`
    : wallet
      ? 'Post a listing with price and terms. Escrow starts only when a room is funded on-chain.'
      : 'Browse is open. Connect in the app to post a listing.'

  return (
    <div className="grid min-h-[260px] place-items-center border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[var(--a-line)] bg-[var(--a-panel)] font-mono text-[20px] text-[color:var(--a-faint)]">
        ⌕
      </div>
      <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[var(--a-ink)]">{title}</h3>
      <p className="max-w-[420px] text-[14px] leading-[1.65] text-[var(--a-muted)]">{body}</p>
    </div>
  )
}
