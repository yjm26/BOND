import { formatAddress, listingExpiryLabel, timeAgo } from './marketUtils'

export default function MarketListingCard({ listing, wallet, onOpenDeal, onDelete, onExpand }) {
  const isOwner = wallet && listing.creator?.toLowerCase() === wallet.address?.toLowerCase()
  const hasSocials = listing.socials && Object.keys(listing.socials).length > 0
  const isBuyerListing = listing.role === 'buyer'

  return (
    <div
      onClick={onExpand}
      className="group relative flex min-h-[188px] cursor-pointer flex-col border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-px hover:border-[var(--a-muted,#a3a3a3)]/34 hover:bg-[var(--a-surface,#111111)] focus-within:border-[var(--a-muted,#a3a3a3)]/50"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--a-inverse-bg,#fafafa)]/18 transition group-hover:bg-[var(--a-muted,#a3a3a3)]/45" />
      <div className="flex items-start justify-between gap-3">
        <div className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">
          {listing.category || 'Other'} / {timeAgo(listing.createdAt)}
        </div>
        <span className={`shrink-0 border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] ${listing.taken ? 'border-[#b87333]/30 text-[#b87333]' : 'border-[#8f9a88]/30 text-[#8f9a88]'}`}>
          {listing.taken ? 'Busy' : 'Active'}
        </span>
      </div>

      <h3 className="mt-5 line-clamp-2 min-h-[42px] text-[22px] font-medium leading-[0.96] tracking-[-0.06em] text-[var(--a-ink,#fafafa)]">
        {listing.title}
      </h3>

      <div className="mt-4 flex items-end justify-between gap-3 border-b border-[var(--a-line)] pb-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">Price</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[22px] leading-none tracking-[-0.04em] text-[var(--a-ink,#fafafa)]">{listing.price}</span>
            <span className="text-[11px] text-[color:var(--a-faint)]">USDC</span>
          </div>
        </div>
        <div className="text-right font-mono text-[8px] uppercase leading-[1.55] tracking-[0.12em] text-[color:var(--a-faint)]">
          {isBuyerListing ? 'Buyer' : 'Seller'}<br />{listingExpiryLabel(listing)}
        </div>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-[var(--a-muted,#a3a3a3)]">
        <div className="flex items-center justify-between gap-3">
          <span>Creator</span>
          <span className="font-mono text-[color:var(--a-muted)]">{formatAddress(listing.creator)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Delivery</span>
          <span className="font-mono text-[color:var(--a-muted)]">{listing.deliveryDays || 5}d</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Contact</span>
          <span className="font-mono text-[color:var(--a-muted)]">{hasSocials ? 'Ready' : 'None'}</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        {isOwner ? (
          listing.taken ? (
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#b87333]">Room active</span>
          ) : (
            <button
              onClick={(event) => { event.stopPropagation(); onDelete() }}
              className="h-8 w-full border border-[#b87333]/40 px-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#b87333] transition hover:bg-[#b87333]/10"
            >
              Delete
            </button>
          )
        ) : listing.taken ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#b87333]">Room in progress</span>
        ) : (
          <button
            onClick={(event) => { event.stopPropagation(); onOpenDeal() }}
            className="h-8 w-full border border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#111111] transition hover:bg-transparent hover:text-[var(--a-ink,#fafafa)]"
          >
            {listing.role === 'buyer' ? 'Sell' : 'Open deal'}
          </button>
        )}
      </div>
    </div>
  )
}
