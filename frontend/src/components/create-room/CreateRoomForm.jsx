import CollateralField from './CollateralField'
import CreateRoomField from './CreateRoomField'
import CreateRoomFlow from './CreateRoomFlow'
import RoleSelector from './RoleSelector'

const inputClass = 'h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/24 focus:border-[#d8b15f]/60 disabled:cursor-not-allowed disabled:opacity-60'

export default function CreateRoomForm({ state, setters, fromMarket, canSubmit, loading, step, error, onRequestCreate }) {
  const { item, price, collateral, noCollateral, deliveryDays, creatorIsSeller } = state
  const { setItem, setPrice, setCollateral, setNoCollateral, setDeliveryDays, setCreatorIsSeller } = setters
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/40">Room terms</div>
      <div className="grid gap-5">
        <RoleSelector creatorIsSeller={creatorIsSeller} fromMarket={fromMarket} onSeller={() => !fromMarket && setCreatorIsSeller(true)} onBuyer={() => { if (!fromMarket) { setCreatorIsSeller(false); setNoCollateral(true); setCollateral('') } }} />
        <CreateRoomFlow creatorIsSeller={creatorIsSeller} />
        <CreateRoomField label="Item / service" disabled={fromMarket}>
          <input className={inputClass} placeholder="What is being delivered?" value={item} onChange={(event) => !fromMarket && setItem(event.target.value)} readOnly={fromMarket} disabled={fromMarket} maxLength={160} />
        </CreateRoomField>
        <CreateRoomField label="Price" suffix="USDC" disabled={fromMarket}>
          <input className={`${inputClass} pr-16`} type="number" placeholder="0.00" min="0.01" step="0.01" value={price} onChange={(event) => !fromMarket && setPrice(event.target.value)} readOnly={fromMarket} disabled={fromMarket} />
        </CreateRoomField>
        <CollateralField creatorIsSeller={creatorIsSeller} collateral={collateral} noCollateral={noCollateral} fromMarket={fromMarket} onCollateralChange={(value) => !fromMarket && setCollateral(value)} onNoCollateralChange={(checked) => { if (fromMarket) return; setNoCollateral(checked); if (checked) setCollateral('') }} />
        <CreateRoomField label="Seller deadline" suffix="days" note="Seller should deliver before this deadline. Buyer can settle or dispute immediately after delivery; seller fallback opens after the fixed response buffer." disabled={fromMarket}>
          <input className={`${inputClass} pr-16`} type="number" min={1} max={90} step={1} value={deliveryDays} onChange={(event) => !fromMarket && setDeliveryDays(Math.max(1, Math.min(90, Number(event.target.value) || 1)))} readOnly={fromMarket} disabled={fromMarket} />
        </CreateRoomField>
        <button onClick={onRequestCreate} disabled={loading || !canSubmit} className="h-12 border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40">
          {loading ? step || 'Processing…' : fromMarket ? 'Confirm deal →' : `Create room${creatorIsSeller && !noCollateral && collateral ? ' + collateral' : ''}`}
        </button>
        {error && <div className="border border-[#c98b4a]/35 bg-[#c98b4a]/10 px-4 py-3 text-[13px] leading-[1.55] text-[#c98b4a]">{error}</div>}
      </div>
    </div>
  )
}
