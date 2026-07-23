export default function MarketOffersTabs({ tab, onTabChange, incomingPendingCount }) {
  return (
    <div className="flex gap-2 border-b border-[#ede9df]/10 px-5 py-4">
      <button onClick={() => onTabChange('incoming')} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${tab === 'incoming' ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 text-[#ede9df]/54 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}>
        Incoming {incomingPendingCount > 0 && <span className="ml-1 text-[#c98b4a]">{incomingPendingCount}</span>}
      </button>
      <button onClick={() => onTabChange('outgoing')} className={`border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${tab === 'outgoing' ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 text-[#ede9df]/54 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}>
        Sent
      </button>
    </div>
  )
}
