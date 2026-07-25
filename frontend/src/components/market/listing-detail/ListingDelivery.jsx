export default function ListingDelivery({ deliveryDays }) {
  return (
    <div className="flex items-center justify-between gap-4 border border-[var(--a-line)] bg-[var(--a-surface,#111111)]/55 px-4 py-3">
      <div className="flex items-center gap-3 text-[13px] text-[#e5e5e5]">
        <span className="flex h-8 w-8 items-center justify-center border border-[var(--a-line)] text-[var(--a-ink,#fafafa)]/52" aria-hidden="true">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
          </svg>
        </span>
        <span>Delivery window</span>
      </div>
      <span className="font-mono text-[12px] uppercase tracking-[0.14em] text-[var(--a-ink,#fafafa)]">{deliveryDays || 5} days</span>
    </div>
  )
}
