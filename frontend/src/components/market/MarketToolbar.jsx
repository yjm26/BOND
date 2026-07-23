export default function MarketToolbar({ wallet, showOffers, showForm, onToggleOffers, onToggleForm }) {
  return (
    <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">Market</div>
      {wallet && (
        <div className="flex flex-wrap gap-2">
          <button onClick={onToggleOffers} className={`h-10 border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition ${showOffers ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/16 text-[#ede9df]/70 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}>Offers</button>
          <button onClick={onToggleForm} className="h-10 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">{showForm ? 'Cancel' : 'Post listing'}</button>
        </div>
      )}
    </div>
  )
}
