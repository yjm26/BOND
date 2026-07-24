export default function ListingPriceRow({ listing }) {
  const hasCollateral = Number(listing.collateral) > 0

  return (
    <div className="grid grid-cols-2 border border-[#ede9df]/10 bg-[#050505]">
      <div className="border-r border-[#ede9df]/10 p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede9df]/34">Price</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-[34px] leading-none tracking-[-0.05em] text-[#ede9df]">{listing.price}</span>
          <span className="text-[12px] text-[#ede9df]/44">USDC</span>
        </div>
      </div>
      <div className="p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede9df]/34">Collateral</div>
        <div className={`mt-3 font-mono text-[15px] font-semibold ${hasCollateral ? 'text-[#d8b15f]' : 'text-[#ede9df]/42'}`}>
          {hasCollateral ? `${listing.collateral} USDC` : 'None'}
        </div>
      </div>
    </div>
  )
}
