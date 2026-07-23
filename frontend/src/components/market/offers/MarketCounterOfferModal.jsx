export default function MarketCounterOfferModal({ target, price, message, onPriceChange, onMessageChange, onCancel, onSubmit }) {
  if (!target) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-sm border border-[#ede9df]/12 bg-[#20201f] p-5 text-[#ede9df] shadow-2xl shadow-black/40" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-[#ede9df]/10 pb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Counter offer</div>
          <h4 className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-[#ede9df]">{target.listingTitle}</h4>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/40">Counter price</span>
            <div className="relative mt-2">
              <input type="number" step="0.01" min="0.01" value={price} onChange={(event) => onPriceChange(event.target.value)} className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 pr-16 text-[14px] text-[#ede9df] outline-none focus:border-[#d8b15f]/60" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/44">USDC</span>
            </div>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/40">Message</span>
            <textarea value={message} onChange={(event) => onMessageChange(event.target.value)} rows={2} className="mt-2 w-full resize-none border border-[#ede9df]/12 bg-[#111110] px-4 py-3 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" placeholder="Short counter note" maxLength={200} />
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="h-10 flex-1 border border-[#ede9df]/14 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]">Cancel</button>
            <button onClick={() => onSubmit(target.id)} disabled={!price || Number(price) <= 0} className="h-10 flex-1 border border-[#ede9df] bg-[#ede9df] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40">Counter →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
