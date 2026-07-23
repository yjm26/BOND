export default function ListingDelivery({ deliveryDays }) {
  return (
    <div className="flex items-center gap-3 text-[13px] text-zinc-600 dark:text-gray-400">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
      </svg>
      Delivery within <span className="font-semibold text-zinc-900 dark:text-white font-mono">{deliveryDays || 5} days</span>
    </div>
  )
}
