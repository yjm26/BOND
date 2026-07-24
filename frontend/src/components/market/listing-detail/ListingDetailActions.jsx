export default function ListingDetailActions({ listing, isOwner, joinLoading, onJoin, onOpenDeal, onDelete }) {
  if (isOwner) {
    if (listing.taken) {
      return (
        <footer className="border-t border-[#ede9df]/10 bg-[#111110] p-4 sm:p-5">
          <div className="grid gap-3">
            {listing.takenRoomId && (
              <button
                onClick={onJoin}
                disabled={joinLoading}
                className="h-11 border border-[#d8b15f] bg-[#d8b15f] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111110] transition hover:bg-transparent hover:text-[#d8b15f] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {joinLoading ? 'Loading…' : 'Join room'}
              </button>
            )}
            <div className="border border-[#c98b4a]/22 bg-[#c98b4a]/8 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">
              Listing already has an active room
            </div>
          </div>
        </footer>
      )
    }

    return (
      <footer className="border-t border-[#ede9df]/10 bg-[#111110] p-4 sm:p-5">
        <button
          onClick={onDelete}
          className="h-11 w-full border border-[#c98b4a]/34 bg-transparent px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#c98b4a] transition hover:border-[#c98b4a] hover:bg-[#c98b4a]/10 focus:outline-none focus:ring-2 focus:ring-[#c98b4a]/30"
        >
          Delete listing
        </button>
        <p className="mt-3 text-center text-[12px] leading-[1.5] text-[#ede9df]/38">
          Removes this market post only. Existing rooms are not affected.
        </p>
      </footer>
    )
  }

  if (listing.taken) {
    return (
      <footer className="border-t border-[#ede9df]/10 bg-[#111110] p-4 sm:p-5">
        <div className="border border-[#c98b4a]/22 bg-[#c98b4a]/8 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">
          Room in progress
        </div>
      </footer>
    )
  }

  return (
    <footer className="border-t border-[#ede9df]/10 bg-[#111110] p-4 sm:p-5">
      <button
        onClick={onOpenDeal}
        className="h-11 w-full border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111110] transition hover:bg-transparent hover:text-[#ede9df] focus:outline-none focus:ring-2 focus:ring-[#d8b15f]/40"
      >
        {listing.role === 'buyer' ? 'Sell to them' : 'Open deal'}
      </button>
    </footer>
  )
}
