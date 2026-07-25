export default function CreateRoomSummary({ state, fromMarket }) {
  const { item, price, collateral, noCollateral, deliveryDays, creatorIsSeller } = state
  const rows = [
    ['Role', creatorIsSeller ? 'Seller' : 'Buyer'],
    ['Amount', price ? `${price} USDC` : 'Not set'],
    ['Collateral', noCollateral ? 'None' : collateral ? `${collateral} USDC` : 'Not set'],
    ['Seller deadline', `${deliveryDays} days`],
    ['Buyer settle', 'Anytime after delivery'],
    ['Arbiter fallback', 'After 12h response buffer'],
    ['Source', fromMarket ? 'Market listing' : 'Manual room'],
  ]
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/40">Review</div>
      <h3 className="mt-4 text-[24px] font-medium leading-[1] tracking-[-0.06em] text-[#fafafa]">{item || 'Untitled room'}</h3>
      <div className="mt-5 grid gap-px bg-[#fafafa]/10 p-px">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[110px_1fr] bg-[#0a0a0a] p-3 text-[13px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/34">{label}</span>
            <span className="text-[#fafafa]">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-[1.65] text-[#a3a3a3]">Creating the room may require wallet confirmation. If seller collateral is enabled, USDC approval can happen before room creation.</p>
    </div>
  )
}
