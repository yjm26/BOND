export default function CreateRoomHeader({ fromMarket, creatorIsSeller }) {
  return (
    <div className="mb-5 border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">Create room</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="max-w-[760px] text-[clamp(40px,6vw,72px)] font-medium leading-[0.92] tracking-[-0.08em] text-[#fafafa]">
            {fromMarket ? 'Confirm your room.' : 'Define your room.'}
          </h1>
          <p className="mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[#a3a3a3]">
            {fromMarket ? 'Review the listing terms, then create the escrow room.' : 'Set the role, price, collateral, and seller deadline.'}
          </p>
        </div>
        <div className="border border-[#fafafa]/10 bg-[#0a0a0a] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#fafafa]/40">
          Creator role<br />
          <span className="text-[#a3a3a3]">{creatorIsSeller ? 'Seller' : 'Buyer'}</span>
        </div>
      </div>
    </div>
  )
}
