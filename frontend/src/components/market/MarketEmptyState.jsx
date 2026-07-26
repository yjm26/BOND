export default function MarketEmptyState({ search, wallet, onPostListing }) {
  const title = search ? 'No matching listings' : 'No listings yet'
  const body = search
    ? `Nothing matches “${search}”. Clear search or change filters.`
    : wallet
      ? 'Post a listing with price and terms. Escrow starts only when a room is funded on-chain.'
      : 'Browse is open. Connect in the app to post a listing.'

  const showCta = Boolean(wallet && !search && onPostListing)

  return (
    <div className="grid min-h-[360px] place-items-center border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center sm:min-h-[420px]">
      <div className="flex flex-col items-center">
        <div className="flex h-16 w-16 items-center justify-center border border-[var(--a-line-strong)] bg-[var(--a-panel)] font-mono text-[24px] leading-none text-[color:var(--a-faint)]">
          {search ? '⌕' : '＋'}
        </div>
        <h3 className="mt-6 text-[28px] font-medium tracking-[-0.06em] text-[var(--a-ink)]">{title}</h3>
        <p className="mt-2.5 max-w-[420px] text-[14px] leading-[1.65] text-[var(--a-muted)]">{body}</p>
        {showCta && (
          <button
            type="button"
            onClick={onPostListing}
            className="group mt-7 inline-flex h-11 items-center gap-2 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition-[transform,background-color,color] duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97]"
          >
            Post a listing
            <span className="inline-block transition-transform duration-200 ease-out group-hover:translate-x-0.5">→</span>
          </button>
        )}
      </div>
    </div>
  )
}
