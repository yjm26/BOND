import CreateRoomField from './CreateRoomField'

export default function CollateralField({ creatorIsSeller, collateral, noCollateral, fromMarket, onCollateralChange, onNoCollateralChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/42">{creatorIsSeller ? 'Collateral' : 'Required seller collateral'}</div>
        <label className={`flex items-center gap-2 text-[12px] text-[#b9b2a5] ${fromMarket ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
          <input type="checkbox" checked={noCollateral} disabled={fromMarket} onChange={(event) => onNoCollateralChange(event.target.checked)} className="h-3.5 w-3.5 accent-[#d8b15f]" />
          No collateral
        </label>
      </div>
      {!noCollateral ? (
        <CreateRoomField suffix="USDC" disabled={fromMarket} note={creatorIsSeller ? 'If you are seller, this can be locked when the room is created.' : 'Seller must lock this when joining. Lost if they fail delivery.'}>
          <input className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 pr-16 text-[14px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/24 focus:border-[#d8b15f]/60 disabled:cursor-not-allowed disabled:opacity-60" type="number" placeholder="0.00" min="0" step="0.01" value={collateral} onChange={(event) => onCollateralChange(event.target.value)} readOnly={fromMarket} disabled={fromMarket} />
        </CreateRoomField>
      ) : (
        <p className="border border-[#ede9df]/10 bg-[#111110] px-4 py-3 text-[12px] leading-[1.55] text-[#b9b2a5]">No collateral — the room can still work, but trust relies more on reputation and proof.</p>
      )}
    </div>
  )
}
