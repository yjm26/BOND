export default function MarketCounterOfferModal({ target, price, message, onPriceChange, onMessageChange, onCancel, onSubmit }) {
  if (!target) return null
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/55 p-4 backdrop-blur-sm" onClick={onCancel}>
      <div className="w-full max-w-sm border border-[#fafafa]/12 bg-[#111111] p-5 text-[#fafafa] shadow-2xl shadow-black/40" onClick={(event) => event.stopPropagation()}>
        <div className="border-b border-[#fafafa]/10 pb-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Counter offer</div>
          <h4 className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-[#fafafa]">{target.listingTitle}</h4>
        </div>
        <div className="mt-4 space-y-3">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/40">Counter price</span>
            <div className="relative mt-2">
              <input type="number" step="0.01" min="0.01" value={price} onChange={(event) => onPriceChange(event.target.value)} className="h-12 w-full border border-[#fafafa]/12 bg-[#0a0a0a] px-4 pr-16 text-[14px] text-[#fafafa] outline-none focus:border-[#a3a3a3]/60" />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/44">USDC</span>
            </div>
          </label>
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/40">Message</span>
            <textarea value={message} onChange={(event) => onMessageChange(event.target.value)} rows={2} className="mt-2 w-full resize-none border border-[#fafafa]/12 bg-[#0a0a0a] px-4 py-3 text-[14px] text-[#fafafa] outline-none placeholder:text-[#fafafa]/28 focus:border-[#a3a3a3]/60" placeholder="Short counter note" maxLength={200} />
          </label>
          <div className="flex gap-2 pt-2">
            <button onClick={onCancel} className="h-10 flex-1 border border-[#fafafa]/14 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">Cancel</button>
            <button onClick={() => onSubmit(target.id)} disabled={!price || Number(price) <= 0} className="h-10 flex-1 border border-[#fafafa] bg-[#fafafa] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa] disabled:cursor-not-allowed disabled:opacity-40">Counter →</button>
          </div>
        </div>
      </div>
    </div>
  )
}
