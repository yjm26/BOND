export default function ListingPriceRow({ listing }) {
  const hasCollateral = Number(listing.collateral) > 0

  return (
    <div className="grid grid-cols-2 border border-[var(--a-line)] bg-[var(--a-bg,#000000)]">
      <div className="border-r border-[var(--a-line)] p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">Price</div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-[34px] leading-none tracking-[-0.05em] text-[var(--a-ink,#fafafa)]">{listing.price}</span>
          <span className="text-[12px] text-[color:var(--a-faint)]">USDC</span>
        </div>
      </div>
      <div className="p-4">
        <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">Collateral</div>
        <div className={`mt-3 font-mono text-[15px] font-semibold ${hasCollateral ? 'text-[var(--a-muted,#a3a3a3)]' : 'text-[color:var(--a-faint)]'}`}>
          {hasCollateral ? `${listing.collateral} USDC` : 'None'}
        </div>
      </div>
    </div>
  )
}
