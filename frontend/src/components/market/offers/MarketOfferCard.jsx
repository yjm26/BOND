import { OFFER_STATUS_STYLE } from './marketOffersStyles'

export default function MarketOfferCard({ offer, tab, actions, timeAgo, fmt }) {
  const isIncoming = tab === 'incoming'
  return (
    <div className="p-5">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="mb-2 flex items-center gap-2">
            <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${OFFER_STATUS_STYLE[offer.status] || 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48'}`}>{offer.status}</span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--a-faint)]">{timeAgo(offer.createdAt)}</span>
          </div>
          <h4 className="truncate text-[18px] font-medium tracking-[-0.04em] text-[var(--a-ink)]">{offer.listingTitle}</h4>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--a-faint)]">{isIncoming ? `From ${fmt(offer.offererWallet)}` : `To ${fmt(offer.listingCreator)}`}</div>
        </div>
        <div className="text-right">
          <div className="font-mono text-[24px] leading-none tracking-[-0.04em] text-[var(--a-ink)]">{offer.offerPrice}</div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--a-faint)]">USDC</div>
        </div>
      </div>

      {offer.message && <div className="mb-3 border border-[var(--a-line)] bg-[var(--a-surface)] p-3 text-[13px] leading-[1.55] text-[var(--a-muted)]">“{offer.message}”</div>}

      {offer.status === 'countered' && offer.counterPrice && (
        <div className="mb-3 border border-[var(--a-line-strong)] bg-[var(--a-muted)]/[0.07] p-3">
          <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-muted)]">Counter offer</div>
          <div className="font-mono text-[18px] text-[var(--a-ink)]">{offer.counterPrice} USDC</div>
          {offer.counterMessage && <div className="mt-1 text-[13px] text-[var(--a-muted)]">“{offer.counterMessage}”</div>}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {isIncoming && offer.status === 'pending' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Accept</button>
            <button onClick={() => actions.startCounter(offer, offer.offerPrice)} className="h-9 border border-[var(--a-line)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]">Counter</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#b87333]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10">Decline</button>
          </>
        )}
        {isIncoming && offer.status === 'countered' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Accept {offer.counterPrice} USDC</button>
            <button onClick={() => actions.startCounter(offer, offer.counterPrice)} className="h-9 border border-[var(--a-line)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]">Counter again</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#b87333]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10">Decline</button>
          </>
        )}
        {isIncoming && offer.status === 'accepted' && <button onClick={() => actions.openRoom(offer, false)} className="h-9 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Create room →</button>}
        {!isIncoming && offer.status === 'accepted' && <button onClick={() => actions.openRoom(offer, true)} className="h-9 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Create room →</button>}
        {!isIncoming && offer.status === 'countered' && (
          <>
            <button onClick={() => actions.accept(offer.id)} className="h-9 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Accept {offer.counterPrice} USDC</button>
            <button onClick={() => actions.startCounter(offer, offer.counterPrice || offer.offerPrice)} className="h-9 border border-[var(--a-line)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]">Counter back</button>
            <button onClick={() => actions.decline(offer.id)} className="h-9 border border-[#b87333]/34 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10">Walk away</button>
          </>
        )}
      </div>
    </div>
  )
}
