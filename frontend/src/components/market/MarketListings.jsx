import MarketEmptyState from './MarketEmptyState'
import MarketListingCard from './MarketListingCard'

export default function MarketListings({ loading, listings, search, wallet, onOpenDeal, onDelete, onExpand }) {
  if (loading) {
    return <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="h-[240px] animate-pulse border border-[#ede9df]/10 bg-[#20201f]" />)}</div>
  }
  if (listings.length === 0) return <MarketEmptyState search={search} wallet={wallet} />
  return <div className="grid gap-px bg-[#ede9df]/10 p-px md:grid-cols-2 xl:grid-cols-3">{listings.map((listing) => <MarketListingCard key={listing.id} listing={listing} wallet={wallet} onOpenDeal={() => onOpenDeal(listing)} onDelete={() => onDelete(listing.id)} onExpand={() => onExpand(listing)} />)}</div>
}
