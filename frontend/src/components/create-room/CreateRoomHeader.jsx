export default function CreateRoomHeader({ fromMarket, creatorIsSeller }) {
  return (
    <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">Create room</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="max-w-[760px] text-[clamp(40px,6vw,72px)] font-medium leading-[0.92] tracking-[-0.08em] text-[#ede9df]">
            {fromMarket ? 'Confirm your room.' : 'Define your room.'}
          </h1>
          <p className="mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[#b9b2a5]">
            {fromMarket ? 'Review the listing terms, then create the escrow room.' : 'Set the role, price, collateral, seller deadline, and review timeout.'}
          </p>
        </div>
        <div className="border border-[#ede9df]/10 bg-[#111110] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#ede9df]/40">
          Creator role<br />
          <span className="text-[#d8b15f]">{creatorIsSeller ? 'Seller' : 'Buyer'}</span>
        </div>
      </div>
    </div>
  )
}
