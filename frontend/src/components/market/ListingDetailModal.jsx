import ListingDetailActions from './listing-detail/ListingDetailActions'
import ListingDetailBody from './listing-detail/ListingDetailBody'
import ListingDetailHeader from './listing-detail/ListingDetailHeader'
import { useJoinListingRoom } from './listing-detail/useJoinListingRoom'
import { CATEGORY_STYLES } from './marketConstants'

export default function ListingDetailModal({ listing, wallet, API_URL, onClose, onOpenDeal, onDelete }) {
  const isOwner = wallet && listing.creator?.toLowerCase() === wallet.address?.toLowerCase()
  const isBuyerListing = listing.role === 'buyer'
  const catStyle = CATEGORY_STYLES[listing.category] || CATEGORY_STYLES.Other
  const { joinLoading, joinRoom } = useJoinListingRoom({ listing, wallet, API_URL, onClose })

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        <ListingDetailHeader listing={listing} isBuyerListing={isBuyerListing} catStyle={catStyle} onClose={onClose} />
        <ListingDetailBody listing={listing} wallet={wallet} />
        <ListingDetailActions
          listing={listing}
          isOwner={isOwner}
          joinLoading={joinLoading}
          onJoin={joinRoom}
          onOpenDeal={onOpenDeal}
          onDelete={onDelete}
        />
      </div>
    </div>
  )
}
