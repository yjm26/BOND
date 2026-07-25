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
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-[#000000]/82 px-4 pb-4 pt-[88px] backdrop-blur-md sm:items-center sm:pt-4"
      onClick={onClose}
      role="presentation"
    >
      <section
        className="max-h-[calc(100vh-112px)] w-full max-w-[760px] overflow-y-auto border border-[#fafafa]/14 bg-[#0a0a0a] text-[#fafafa] shadow-2xl sm:max-h-[90vh]"
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="listing-detail-title"
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
      </section>
    </div>
  )
}
