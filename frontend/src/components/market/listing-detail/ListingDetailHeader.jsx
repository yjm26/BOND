import { CATEGORY_ICON } from '../marketConstants'
import { formatAddress, timeAgo } from '../marketUtils'

export default function ListingDetailHeader({ listing, isBuyerListing, catStyle, onClose }) {
  return (
    <header className="border-b border-[#ede9df]/10 p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${isBuyerListing ? 'border-[#b7c8a3]/26 bg-[#b7c8a3]/8 text-[#b7c8a3]' : 'border-[#ede9df]/14 bg-[#ede9df]/6 text-[#ede9df]/72'}`}>
            {isBuyerListing ? 'Buyer listing' : 'Seller listing'}
          </span>
          <span
            className="inline-flex items-center gap-1.5 border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em]"
            style={{ background: catStyle.bg, color: catStyle.color, borderColor: catStyle.border }}
          >
            {CATEGORY_ICON[listing.category] || '▪'} {listing.category || 'Other'}
          </span>
        </div>
        <button
          onClick={onClose}
          className="flex h-9 w-9 items-center justify-center border border-[#ede9df]/12 text-[20px] leading-none text-[#ede9df]/48 transition hover:border-[#ede9df]/30 hover:text-[#ede9df] focus:outline-none focus:ring-2 focus:ring-[#d8b15f]/40"
          aria-label="Close listing detail"
        >
          ×
        </button>
      </div>

      <h2 id="listing-detail-title" className="mt-4 text-[clamp(28px,4vw,40px)] font-medium leading-[0.92] tracking-[-0.075em] text-[#ede9df]">
        {listing.title}
      </h2>
      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/36">
        Posted {timeAgo(listing.createdAt)} by <span className="text-[#ede9df]/56">{formatAddress(listing.creator)}</span>
      </p>
    </header>
  )
}
