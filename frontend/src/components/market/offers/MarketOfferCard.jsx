import { OFFER_STATUS_STYLE } from './marketOffersStyles'

export default function MarketOfferCard({ offer, tab, actions, timeAgo, fmt }) {
  const isIncoming = tab === 'incoming'
  return (
    <div className="p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${OFFER_STATUS_STYLE[offer.status] || 'border-[#fafafa]/16 text-[#fafafa]/48'}`}>{offer.status}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[#fafafa]/34">{timeAgo(offer.createdAt)}</span>
          </div>
          <h4 className="truncate text-[18px] font-medium tracking-[-0.04em] text-[#fafafa]">{offer.listingTitle}</h4>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[#fafafa]/38">{isIncoming ? `From ${fmt(offer.offererWallet)}` : `To ${fmt(offer.listingCreator)}`}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[24px] leading-none tracking-[-0.04em] text-[#fafafa]">{offer.offerPrice}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/34">USDC</div>
        </div>
      </div>

      {offer.message && <div className="mb-3 border border-[#fafafa]/10 bg-[#111111] p-3 text-[13px] leading-[1.55] text-[#a3a3a3]">“{offer.message}”</div>}

      {offer.status === 'countered' && offer.counterPrice && (
        <div className="mb-3 border border-[#a3a3a3]/20 bg-[#a3a3a3]/[0.07] p-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[#a3a3a3]">Counter offer</div>
          <div className="font-mono text-[18px] text-[#fafafa]">{offer.counterPrice} USDC</div>
          {offer.counterMessage && <div className="mt-1 text-[13px] text-[#a3a3a3]">“{offer.counterMessage}”</div>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {isIncoming && offer.status === 'pending' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Accept</button>
            <button onClick={() => actions.startCounter(offer, offer.offerPrice)} className="h-9 border border-[#fafafa]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">Counter</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#b87333]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10">Decline</button>
          </>
        )}
        {isIncoming && offer.status === 'countered' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Accept {offer.counterPrice} USDC</button>
            <button onClick={() => actions.startCounter(offer, offer.counterPrice)} className="h-9 border border-[#fafafa]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">Counter again</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#b87333]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10">Decline</button>
          </>
        )}
        {isIncoming && offer.status === 'accepted' && <button onClick={() => actions.openRoom(offer, false)} className="h-9 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Create room →</button>}
        {!isIncoming && offer.status === 'accepted' && <button onClick={() => actions.openRoom(offer, true)} className="h-9 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Create room →</button>}
        {!isIncoming && offer.status === 'countered' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Accept {offer.counterPrice} USDC</button>
            <button onClick={() => actions.startCounter(offer, offer.counterPrice || offer.offerPrice)} className="h-9 border border-[#fafafa]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">Counter back</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#b87333]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10">Walk away</button>
          </>
        )}
      </div>
    </div>
  )
}
