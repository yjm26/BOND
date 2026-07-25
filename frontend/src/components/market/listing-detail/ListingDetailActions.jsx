export default function ListingDetailActions({ listing, isOwner, joinLoading, onJoin, onOpenDeal, onDelete }) {
  if (isOwner) {
    if (listing.taken) {
      return (
        <footer className="border-t border-[#fafafa]/10 bg-[#0a0a0a] p-4 sm:p-5">
          <div className="grid gap-3">
            {listing.takenRoomId && (
              <button
                onClick={onJoin}
                disabled={joinLoading}
                className="h-11 border border-[#a3a3a3] bg-[#a3a3a3] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition hover:bg-transparent hover:text-[#a3a3a3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {joinLoading ? 'Loading…' : 'Join room'}
              </button>
            )}
            <div className="border border-[#b87333]/22 bg-[#b87333]/8 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333]">
              Listing already has an active room
            </div>
          </div>
        </footer>
      )
    }

    return (
      <footer className="border-t border-[#fafafa]/10 bg-[#0a0a0a] p-4 sm:p-5">
        <button
          onClick={onDelete}
          className="h-11 w-full border border-[#b87333]/34 bg-transparent px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#b87333] transition hover:border-[#b87333] hover:bg-[#b87333]/10 focus:outline-none focus:ring-2 focus:ring-[#b87333]/30"
        >
          Delete listing
        </button>
        <p className="mt-3 text-center text-[12px] leading-[1.5] text-[#fafafa]/38">
          Removes this market post only. Existing rooms are not affected.
        </p>
      </footer>
    )
  }

  if (listing.taken) {
    return (
      <footer className="border-t border-[#fafafa]/10 bg-[#0a0a0a] p-4 sm:p-5">
        <div className="border border-[#b87333]/22 bg-[#b87333]/8 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333]">
          Room in progress
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-[#fafafa]/10 bg-[#0a0a0a] p-4 sm:p-5">
      <button
        onClick={onOpenDeal}
        className="h-11 w-full border border-[#fafafa] bg-[#fafafa] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition hover:bg-transparent hover:text-[#fafafa] focus:outline-none focus:ring-2 focus:ring-[#a3a3a3]/40"
      >
        {listing.role === 'buyer' ? 'Sell to them' : 'Open deal'}
      </button>
    </footer>
  )
}
