export default function ListingDelivery({ deliveryDays }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-[#ede9df]/10 bg-[#20201f]/55 px-4 py-3">
      <div className="flex items-center gap-3 text-[13px] text-[#d8d1c2]">
        <span className="flex h-8 w-8 items-center justify-center border border-[#ede9df]/12 text-[#ede9df]/52" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </span>
        <span>Delivery window</span>
      </div>
      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[#ede9df]">{deliveryDays || 5} days</span>
    </div>
  )
}
