import ListingContactLinks from './ListingContactLinks'
import ListingCreatorCard from './ListingCreatorCard'
import ListingDelivery from './ListingDelivery'
import ListingDescription from './ListingDescription'
import ListingPriceRow from './ListingPriceRow'
import { listingExpiryLabel } from '../marketUtils'

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
        <div className="flex items-center justify-between border border-[var(--a-line)] bg-[var(--a-surface,#111111)]/55 px-3 py-2.5">
          <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">Listing expiry</span>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--a-ink,#fafafa)]">{listingExpiryLabel(listing)}</span>
        </div>
        <div className="border border-[var(--a-muted,#a3a3a3)]/16 bg-[var(--a-muted,#a3a3a3)]/[0.045] p-3">
          <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[var(--a-muted,#a3a3a3)]">Settlement path</div>
          <p className="mt-1.5 text-[12px] leading-[1.45] text-[#e5e5e5]">
            Buyer can settle or dispute after delivery. Seller fallback opens after the fixed 12h buffer.
          </p>
        </div>
      </div>
    </div>
  )
}
