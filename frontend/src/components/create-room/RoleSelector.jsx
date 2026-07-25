export default function RoleSelector({ creatorIsSeller, fromMarket, onSeller, onBuyer }) {
  const roleClass = (active) => `border p-4 text-left transition ${active ? 'border-[#fafafa] bg-[#fafafa] text-[#111111]' : 'border-[#fafafa]/12 bg-[#0a0a0a] text-[#fafafa]/58 hover:border-[#fafafa]/34 hover:text-[#fafafa]'} ${fromMarket ? 'cursor-not-allowed opacity-60' : ''}`
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <button type="button" onClick={onSeller} disabled={fromMarket} className={roleClass(creatorIsSeller)}>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em]">Seller</div>
        <div className="mt-2 text-[14px] leading-[1.5]">I deliver the item, service, or proof.</div>
      </button>
      <button type="button" onClick={onBuyer} disabled={fromMarket} className={roleClass(!creatorIsSeller)}>
        <div className="font-mono text-[10px] uppercase tracking-[0.18em]">Buyer</div>
        <div className="mt-2 text-[14px] leading-[1.5]">I fund escrow after the counterparty joins.</div>
      </button>
    </div>
  )
}
