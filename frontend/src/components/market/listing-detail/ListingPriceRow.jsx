export default function ListingPriceRow({ listing }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-1">Price</div>
        <div className="text-[24px] font-semibold text-zinc-900 dark:text-white font-mono">{listing.price} <span className="text-[14px] text-zinc-400 font-normal">USDC</span></div>
      </div>
      <div className="flex-1">
        <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-1">Collateral</div>
        <div className={`text-[16px] font-semibold font-mono ${Number(listing.collateral) > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-400 dark:text-gray-500'}`}>
          {Number(listing.collateral) > 0 ? `🔒 ${listing.collateral} USDC` : 'None'}
        </div>
      </div>
    </div>
  )
}
