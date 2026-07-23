import ListingContactLinks from './ListingContactLinks'
import ListingCreatorCard from './ListingCreatorCard'
import ListingDelivery from './ListingDelivery'
import ListingDescription from './ListingDescription'
import ListingPriceRow from './ListingPriceRow'

export default function ListingDetailBody({ listing, wallet }) {
  return (
    <div className="p-5 space-y-5">
      <ListingDescription description={listing.description} />
      <ListingPriceRow listing={listing} />
      <ListingDelivery deliveryDays={listing.deliveryDays} />
      <div className="border border-[#ede9df]/10 bg-[#111110] p-4 text-[13px] leading-[1.6] text-[#b9b2a5]">
        Buyer can settle or dispute immediately after delivery. If buyer stays silent, seller can request arbiter review after the 12h response buffer.
      </div>
      <ListingCreatorCard wallet={wallet} creator={listing.creator} />
      <ListingContactLinks socials={listing.socials} />
    </div>
  )
}
