import ListingContactLinks from './ListingContactLinks'
import ListingCreatorCard from './ListingCreatorCard'
import ListingDealType from './ListingDealType'
import ListingDelivery from './ListingDelivery'
import ListingDescription from './ListingDescription'
import ListingPriceRow from './ListingPriceRow'

export default function ListingDetailBody({ listing, wallet }) {
  return (
    <div className="p-5 space-y-5">
      <ListingDescription description={listing.description} />
      <ListingPriceRow listing={listing} />
      <ListingDelivery deliveryDays={listing.deliveryDays} />
      <ListingDealType dealType={listing.dealType} />
      <ListingCreatorCard wallet={wallet} creator={listing.creator} />
      <ListingContactLinks socials={listing.socials} />
    </div>
  )
}
