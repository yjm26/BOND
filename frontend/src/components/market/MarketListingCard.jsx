import { formatAddress, listingExpiryLabel, timeAgo } from './marketUtils'

export default function MarketListingCard({ listing, wallet, onOpenDeal, onDelete, onExpand }) {
  const isOwner = wallet && listing.creator?.toLowerCase() === wallet.address?.toLowerCase()
  const hasSocials = listing.socials && Object.keys(listing.socials).length > 0
  const isBuyerListing = listing.role === 'buyer'

  return (
    <div
      onClick={onExpand}
      className="group relative flex min-h-[188px] cursor-pointer flex-col border border-[#ede9df]/12 bg-[#181817] p-4 shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition hover:-translate-y-px hover:border-[#d8b15f]/34 hover:bg-[#20201f] focus-within:border-[#d8b15f]/50"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[#ede9df]/18 transition group-hover:bg-[#d8b15f]/45" />
      <div className="flex items-start justify-between gap-3">
        <div className="truncate font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede9df]/38">
          {listing.category || 'Other'} / {timeAgo(listing.createdAt)}
        </div>
        <span className={`shrink-0 border px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-[0.12em] ${listing.taken ? 'border-[#c98b4a]/30 text-[#c98b4a]' : 'border-[#b7c8a3]/30 text-[#b7c8a3]'}`}>
          {listing.taken ? 'Busy' : 'Active'}
        </span>
      </div>

      <h3 className="mt-5 line-clamp-2 min-h-[42px] text-[22px] font-medium leading-[0.96] tracking-[-0.06em] text-[#ede9df]">
        {listing.title}
      </h3>

      <div className="mt-4 flex items-end justify-between gap-3 border-b border-[#ede9df]/10 pb-3">
        <div>
          <div className="font-mono text-[8px] uppercase tracking-[0.16em] text-[#ede9df]/34">Price</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[22px] leading-none tracking-[-0.04em] text-[#ede9df]">{listing.price}</span>
            <span className="text-[11px] text-[#ede9df]/42">USDC</span>
          </div>
        </div>
        <div className="text-right font-mono text-[8px] uppercase leading-[1.55] tracking-[0.12em] text-[#ede9df]/38">
          {isBuyerListing ? 'Buyer' : 'Seller'}<br />{listingExpiryLabel(listing)}
        </div>
      </div>

      <div className="mt-3 grid gap-1.5 text-[11px] text-[#b9b2a5]">
        <div className="flex items-center justify-between gap-3">
          <span>Creator</span>
          <span className="font-mono text-[#ede9df]/58">{formatAddress(listing.creator)}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Delivery</span>
          <span className="font-mono text-[#ede9df]/58">{listing.deliveryDays || 5}d</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span>Contact</span>
          <span className="font-mono text-[#ede9df]/58">{hasSocials ? 'Ready' : 'None'}</span>
        </div>
      </div>

      <div className="mt-auto pt-4">
        {isOwner ? (
          listing.taken ? (
            <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#c98b4a]">Room active</span>
          ) : (
            <button
              onClick={(event) => { event.stopPropagation(); onDelete() }}
              className="h-8 w-full border border-[#c98b4a]/40 px-3 font-mono text-[9px] uppercase tracking-[0.14em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10"
            >
              Delete
            </button>
          )
        ) : listing.taken ? (
          <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#c98b4a]">Room in progress</span>
        ) : (
          <button
            onClick={(event) => { event.stopPropagation(); onOpenDeal() }}
            className="h-8 w-full border border-[#ede9df] bg-[#ede9df] font-mono text-[9px] font-semibold uppercase tracking-[0.14em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]"
          >
            {listing.role === 'buyer' ? 'Sell' : 'Open deal'}
          </button>
        )}
      </div>
    </div>
  )
}
