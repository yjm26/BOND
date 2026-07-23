import { DEAL_TYPES } from '../../utils/contract'
import { formatAddress, timeAgo } from './marketUtils'

export default function MarketListingCard({ listing, wallet, onOpenDeal, onDelete, onExpand }) {
  const isOwner = wallet && listing.creator?.toLowerCase() === wallet.address?.toLowerCase()
  const hasSocials = listing.socials && Object.keys(listing.socials).length > 0
  const isBuyerListing = listing.role === 'buyer'
  const dealType = DEAL_TYPES.find((type) => type.id === Number(listing.dealType))?.label || 'Instant'
  return (
    <div onClick={onExpand} className="group min-h-[300px] cursor-pointer bg-[#111110] p-5 transition hover:bg-[#1a1a18] sm:p-6">
      <div className="flex items-start justify-between gap-4"><div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/38">{listing.category || 'Other'} / {timeAgo(listing.createdAt)}</div><span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${listing.taken ? 'border-[#c98b4a]/30 text-[#c98b4a]' : 'border-[#b7c8a3]/30 text-[#b7c8a3]'}`}>{listing.taken ? 'In progress' : 'Active'}</span></div>
      <h3 className="mt-10 min-h-[58px] max-w-[330px] text-[28px] font-medium leading-[0.98] tracking-[-0.06em] text-[#ede9df]">{listing.title}</h3>
      <div className="mt-7 flex items-end justify-between gap-4 border-b border-[#ede9df]/10 pb-5"><div><div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/34">Price</div><div className="mt-1 flex items-baseline gap-2"><span className="font-mono text-[30px] leading-none tracking-[-0.04em] text-[#ede9df]">{listing.price}</span><span className="text-[13px] text-[#ede9df]/42">USDC</span></div></div><div className="text-right font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-[#ede9df]/38">{isBuyerListing ? 'Buyer listing' : 'Seller listing'}<br />{dealType}</div></div>
      <div className="mt-5 grid gap-3 text-[13px] text-[#b9b2a5]"><div className="flex items-center justify-between gap-4"><span>Creator</span><span className="font-mono text-[#ede9df]/58">{formatAddress(listing.creator)}</span></div><div className="flex items-center justify-between gap-4"><span>Delivery</span><span className="font-mono text-[#ede9df]/58">{listing.deliveryDays || 5} days</span></div><div className="flex items-center justify-between gap-4"><span>Contact</span><span className="font-mono text-[#ede9df]/58">{hasSocials ? 'DM ready' : 'Not added'}</span></div></div>
      <div className="mt-7">{isOwner ? (listing.taken ? <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">Room active</span> : <button onClick={(event) => { event.stopPropagation(); onDelete() }} className="h-10 border border-[#c98b4a]/40 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10">Delete listing</button>) : listing.taken ? (<span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">Room in progress</span>) : (<button onClick={(event) => { event.stopPropagation(); onOpenDeal() }} className="h-11 w-full border border-[#ede9df] bg-[#ede9df] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">{listing.role === 'buyer' ? 'Sell to them' : 'Open deal'}</button>)}</div>
    </div>
  )
}
