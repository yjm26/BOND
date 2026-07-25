import { formatAddress, listingExpiryLabel, timeAgo } from '../market/marketUtils'

export default function PublicListingCard({ listing, onOpen }) {
  const isBuyerListing = listing.role === 'buyer'

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[200px] flex-col border border-[#0a0a0a]/12 bg-[#fafafa] p-5 text-left transition duration-160 ease-out hover:-translate-y-px hover:border-[#0a0a0a]/28 hover:bg-white active:scale-[0.995]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="truncate font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">
          {listing.category || 'Other'} · {timeAgo(listing.createdAt)}
        </div>
        <span
          className={`shrink-0 border px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] ${
            listing.taken
              ? 'border-[#0a0a0a]/16 text-[#737373]'
              : 'border-[#0a0a0a]/20 text-[#0a0a0a]'
          }`}
        >
          {listing.taken ? 'In room' : 'Open'}
        </span>
      </div>

      <h2 className="mt-5 line-clamp-2 text-[24px] font-medium leading-[1.02] tracking-[-0.05em] text-[#0a0a0a]">
        {listing.title}
      </h2>

      <div className="mt-5 flex items-end justify-between gap-3 border-b border-[#0a0a0a]/10 pb-4">
        <div>
          <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Price</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="font-mono text-[26px] leading-none tracking-[-0.04em] text-[#0a0a0a]">{listing.price}</span>
            <span className="text-[12px] text-[#737373]">USDC</span>
          </div>
        </div>
        <div className="text-right font-mono text-[9px] uppercase leading-[1.55] tracking-[0.12em] text-[#737373]">
          {isBuyerListing ? 'Buyer' : 'Seller'}
          <br />
          {listingExpiryLabel(listing)}
        </div>
      </div>

      <div className="mt-4 space-y-1.5 text-[12px] text-[#525252]">
        <div className="flex justify-between gap-3">
          <span>Creator</span>
          <span className="font-mono text-[#0a0a0a]/70">{formatAddress(listing.creator)}</span>
        </div>
        <div className="flex justify-between gap-3">
          <span>Delivery</span>
          <span className="font-mono text-[#0a0a0a]/70">{listing.deliveryDays || 5}d</span>
        </div>
      </div>

      <div className="mt-auto pt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0a0a0a]/45 transition group-hover:text-[#0a0a0a]">
        View details →
      </div>
    </button>
  )
}
