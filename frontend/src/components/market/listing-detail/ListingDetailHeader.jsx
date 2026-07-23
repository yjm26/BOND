import { CATEGORY_ICON } from '../marketConstants'
import { formatAddress, timeAgo } from '../marketUtils'

export default function ListingDetailHeader({ listing, isBuyerListing, catStyle, onClose }) {
  return (
    <div className="p-5 border-b border-zinc-100 dark:border-white/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${isBuyerListing ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20' : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10'}`}>
            {isBuyerListing ? '◈ BUYER LISTING' : '◆ SELLER LISTING'}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold tracking-wide uppercase border" style={{ background: catStyle.bg, color: catStyle.color, borderColor: catStyle.border }}>
            {CATEGORY_ICON[listing.category] || '▪'} {listing.category?.toUpperCase()}
          </span>
        </div>
        <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white text-xl leading-none">×</button>
      </div>
      <h2 className="text-[18px] font-semibold text-zinc-900 dark:text-white leading-snug">{listing.title}</h2>
      <p className="text-[11px] text-zinc-400 dark:text-gray-500 font-mono mt-1">Posted {timeAgo(listing.createdAt)} by {formatAddress(listing.creator)}</p>
    </div>
  )
}
