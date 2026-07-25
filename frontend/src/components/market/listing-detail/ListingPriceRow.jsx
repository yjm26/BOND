export default function ListingPriceRow({ listing }) {
  const hasCollateral = Number(listing.collateral) > 0

  return (
    <div className="grid grid-cols-2 border border-[#fafafa]/10 bg-[#000000]">
      <div className="border-r border-[#fafafa]/10 p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#fafafa]/34">Price</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-[34px] leading-none tracking-[-0.05em] text-[#fafafa]">{listing.price}</span>
          <span className="text-[12px] text-[#fafafa]/44">USDC</span>
        </div>
      </div>
      <div className="p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#fafafa]/34">Collateral</div>
        <div className={`mt-3 font-mono text-[15px] font-semibold ${hasCollateral ? 'text-[#a3a3a3]' : 'text-[#fafafa]/42'}`}>
          {hasCollateral ? `${listing.collateral} USDC` : 'None'}
        </div>
      </div>
    </div>
  )
}
