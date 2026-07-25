import PublicListingCard from './PublicListingCard'

function SkeletonGrid() {
  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="min-h-[200px] border border-[#0a0a0a]/10 bg-[#f5f5f5] p-5">
          <div className="h-3 w-28 bg-[#0a0a0a]/8" />
          <div className="mt-6 h-7 w-[80%] bg-[#0a0a0a]/10" />
          <div className="mt-8 h-8 w-24 bg-[#0a0a0a]/8" />
        </div>
      ))}
    </div>
  )
}

export default function PublicListingsGrid({ loading, listings, onOpen }) {
  if (loading) return <SkeletonGrid />

  if (!listings.length) {
    return (
      <div className="mt-10 border border-[#0a0a0a]/12 bg-white px-5 py-10 sm:px-8">
        <h2 className="text-[28px] font-medium tracking-[-0.05em] text-[#0a0a0a]">No listings yet.</h2>
        <p className="mt-3 max-w-[380px] text-[14px] leading-[1.6] text-[#525252]">
          Nothing posted right now. Go to the app to add one.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {listings.map((listing) => (
        <PublicListingCard key={listing.id} listing={listing} onOpen={() => onOpen(listing)} />
      ))}
    </div>
  )
}
