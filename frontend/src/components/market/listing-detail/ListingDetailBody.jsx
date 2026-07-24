import ListingContactLinks from './ListingContactLinks'
import ListingCreatorCard from './ListingCreatorCard'
import ListingDelivery from './ListingDelivery'
import ListingDescription from './ListingDescription'
import ListingPriceRow from './ListingPriceRow'

export default function ListingDetailBody({ listing, wallet }) {
  return (
    <div className="grid gap-3 p-4 sm:grid-cols-[1fr_320px] sm:p-5">
      <div className="grid content-start gap-3">
        <ListingDescription description={listing.description} />
        <ListingCreatorCard wallet={wallet} creator={listing.creator} />
        <ListingContactLinks socials={listing.socials} />
      </div>
      <div className="grid content-start gap-3">
        <ListingPriceRow listing={listing} />
        <ListingDelivery deliveryDays={listing.deliveryDays} />
        <div className="border border-[#d8b15f]/16 bg-[#d8b15f]/[0.045] p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#d8b15f]">Settlement path</div>
          <p className="mt-1.5 text-[12px] leading-[1.45] text-[#d8d1c2]">
            Buyer can settle or dispute after delivery. Seller fallback opens after the fixed 12h buffer.
          </p>
        </div>
      </div>
    </div>
  )
}
