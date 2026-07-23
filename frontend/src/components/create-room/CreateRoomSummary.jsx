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
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/40">Review</div>
      <h3 className="mt-4 text-[24px] font-medium leading-[1] tracking-[-0.06em] text-[#ede9df]">{item || 'Untitled room'}</h3>
      <div className="mt-5 grid gap-px bg-[#ede9df]/10 p-px">
        {rows.map(([label, value]) => (
          <div key={label} className="grid grid-cols-[110px_1fr] bg-[#111110] p-3 text-[13px]">
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/34">{label}</span>
            <span className="text-[#ede9df]">{value}</span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[12px] leading-[1.65] text-[#b9b2a5]">Creating the room may require wallet confirmation. If seller collateral is enabled, USDC approval can happen before room creation.</p>
    </div>
  )
}
