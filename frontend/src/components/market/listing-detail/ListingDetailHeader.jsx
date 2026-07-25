import { CATEGORY_ICON } from '../marketConstants'
import { formatAddress, timeAgo } from '../marketUtils'

export default function ListingDetailHeader({ listing, isBuyerListing, catStyle, onClose }) {
  return (
    <header className="border-b border-[var(--a-line)] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className={`border px-2.5 py-1 font-mono text-[9px] font-semibold uppercase tracking-[0.16em] ${isBuyerListing ? 'border-[#8f9a88]/26 bg-[#8f9a88]/8 text-[#8f9a88]' : 'border-[var(--a-line)] bg-[var(--a-inverse-bg)]/6 text-[color:var(--a-soft)]'}`}>
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
          className="flex h-9 w-9 items-center justify-center border border-[var(--a-line)] text-[20px] leading-none text-[var(--a-ink)]/48 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] focus:outline-none focus:ring-2 focus:ring-[#a3a3a3]/40"
          aria-label="Close listing detail"
        >
          ×
        </button>
      </div>

      <h2 id="listing-detail-title" className="mt-4 text-[clamp(28px,4vw,40px)] font-medium leading-[0.92] tracking-[-0.075em] text-[var(--a-ink)]">
        {listing.title}
      </h2>
      <p className="mt-2.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/36">
        Posted {timeAgo(listing.createdAt)} by <span className="text-[var(--a-ink)]/56">{formatAddress(listing.creator)}</span>
      </p>
    </header>
  )
}
