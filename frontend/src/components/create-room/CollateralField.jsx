import CreateRoomField from './CreateRoomField'

export default function CollateralField({ creatorIsSeller, collateral, noCollateral, fromMarket, onCollateralChange, onNoCollateralChange }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">{creatorIsSeller ? 'Collateral' : 'Required seller collateral'}</div>
        <label className={`flex items-center gap-2 text-[12px] text-[var(--a-muted)] ${fromMarket ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}>
          <input type="checkbox" checked={noCollateral} disabled={fromMarket} onChange={(event) => onNoCollateralChange(event.target.checked)} className="h-3.5 w-3.5 accent-[#a3a3a3]" />
          No collateral
        </label>
      </div>
      {!noCollateral ? (
        <CreateRoomField suffix="USDC" disabled={fromMarket} note={creatorIsSeller ? 'If you are seller, this can be locked when the room is created.' : 'Seller must lock this when joining. Lost if they fail delivery.'}>
          <input className="h-12 w-full border border-[var(--a-line)] bg-[var(--a-panel)] px-4 pr-16 text-[14px] text-[var(--a-ink)] outline-none transition placeholder:text-[var(--a-ink)]/24 focus:border-[var(--a-muted)]/60 disabled:cursor-not-allowed disabled:opacity-60" type="number" placeholder="0.00" min="0" step="0.01" value={collateral} onChange={(event) => onCollateralChange(event.target.value)} readOnly={fromMarket} disabled={fromMarket} />
        </CreateRoomField>
      ) : (
        <p className="border border-[var(--a-line)] bg-[var(--a-panel)] px-4 py-3 text-[12px] leading-[1.55] text-[var(--a-muted)]">No collateral — the room can still work, but trust relies more on reputation and proof.</p>
      )}
    </div>
  )
}
