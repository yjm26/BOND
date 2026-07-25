export default function MarketToolbar({ wallet, showOffers, showForm, onToggleOffers, onToggleForm }) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">Market</div>
      {wallet && (
        <div className="flex flex-wrap gap-2">
          <button onClick={onToggleOffers} className={`h-10 border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition ${showOffers ? 'border-[#fafafa] bg-[#fafafa] text-[#111111]' : 'border-[#fafafa]/16 text-[#fafafa]/70 hover:border-[#fafafa]/34 hover:text-[#fafafa]'}`}>Offers</button>
          <button onClick={onToggleForm} className="h-10 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">{showForm ? 'Cancel' : 'Post listing'}</button>
        </div>
      )}
    </div>
  )
}
