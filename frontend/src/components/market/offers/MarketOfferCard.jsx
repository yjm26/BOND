import { OFFER_STATUS_STYLE } from './marketOffersStyles'

export default function MarketOfferCard({ offer, tab, actions, timeAgo, fmt }) {
  const isIncoming = tab === 'incoming'
  return (
    <div className="p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${OFFER_STATUS_STYLE[offer.status] || 'border-[#ede9df]/16 text-[#ede9df]/48'}`}>{offer.status}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#ede9df]/34">{timeAgo(offer.createdAt)}</span>
          </div>
          <h4 className="truncate text-[18px] font-medium tracking-[-0.04em] text-[#ede9df]">{offer.listingTitle}</h4>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ede9df]/38">{isIncoming ? `From ${fmt(offer.offererWallet)}` : `To ${fmt(offer.listingCreator)}`}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[24px] leading-none tracking-[-0.04em] text-[#ede9df]">{offer.offerPrice}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/34">USDC</div>
        </div>
      </div>

      {offer.message && <div className="mb-3 border border-[#ede9df]/10 bg-[#20201f] p-3 text-[13px] leading-[1.55] text-[#b9b2a5]">“{offer.message}”</div>}

      {offer.status === 'countered' && offer.counterPrice && (
        <div className="mb-3 border border-[#d8b15f]/20 bg-[#d8b15f]/[0.07] p-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d8b15f]">Counter offer</div>
          <div className="font-mono text-[18px] text-[#ede9df]">{offer.counterPrice} USDC</div>
          {offer.counterMessage && <div className="mt-1 text-[13px] text-[#b9b2a5]">“{offer.counterMessage}”</div>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {isIncoming && offer.status === 'pending' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Accept</button>
            <button onClick={() => actions.startCounter(offer, offer.offerPrice)} className="h-9 border border-[#ede9df]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]">Counter</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#c98b4a]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10">Decline</button>
          </>
        )}
        {isIncoming && offer.status === 'countered' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Accept {offer.counterPrice} USDC</button>
            <button onClick={() => actions.startCounter(offer, offer.counterPrice)} className="h-9 border border-[#ede9df]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]">Counter again</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#c98b4a]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10">Decline</button>
          </>
        )}
        {isIncoming && offer.status === 'accepted' && <button onClick={() => actions.openRoom(offer, false)} className="h-9 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Create room →</button>}
        {!isIncoming && offer.status === 'accepted' && <button onClick={() => actions.openRoom(offer, true)} className="h-9 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Create room →</button>}
        {!isIncoming && offer.status === 'countered' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Accept {offer.counterPrice} USDC</button>
            <button onClick={() => actions.startCounter(offer, offer.counterPrice || offer.offerPrice)} className="h-9 border border-[#ede9df]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]">Counter back</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#c98b4a]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10">Walk away</button>
          </>
        )}
      </div>
    </div>
  )
}
