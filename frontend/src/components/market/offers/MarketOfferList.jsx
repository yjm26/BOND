import MarketOfferCard from './MarketOfferCard'

export default function MarketOfferList({ offers, tab, actions, timeAgo, fmt, loading }) {
  if (loading) return <div className="p-8 text-center font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--a-ink)]/40">Loading offers…</div>
  if (offers.length === 0) {
    return (
      <div className="grid min-h-[220px] place-items-center p-8 text-center">
        <div>
          <div className="mb-2 text-[22px] font-medium tracking-[-0.05em] text-[var(--a-ink)]">No offers yet</div>
          <div className="text-[13px] text-[var(--a-muted)]">{tab === 'incoming' ? 'Offers on your listings will appear here.' : 'Offers you send from Market will appear here.'}</div>
        </div>
      </div>
    )
  }
  return <div className="divide-y divide-[#fafafa]/10">{offers.map((offer) => <MarketOfferCard key={offer.id} offer={offer} tab={tab} actions={actions} timeAgo={timeAgo} fmt={fmt} />)}</div>
}
