import MarketEmptyState from './MarketEmptyState'
import MarketListingCard from './MarketListingCard'

export default function MarketListings({ loading, listings, search, wallet, onOpenDeal, onDelete, onExpand }) {
  if (loading) {
    return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{Array.from({ length: 10 }).map((_, index) => <div key={index} className="h-[188px] animate-pulse border border-[var(--a-line)] bg-[var(--a-surface,#111111)]" />)}</div>
  }
  if (listings.length === 0) return <MarketEmptyState search={search} wallet={wallet} />
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">{listings.map((listing) => <MarketListingCard key={listing.id} listing={listing} wallet={wallet} onOpenDeal={() => onOpenDeal(listing)} onDelete={() => onDelete(listing.id)} onExpand={() => onExpand(listing)} />)}</div>
}
