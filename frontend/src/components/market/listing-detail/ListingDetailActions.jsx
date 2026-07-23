export default function ListingDetailActions({ listing, isOwner, joinLoading, onJoin, onOpenDeal, onDelete }) {
  return (
    <div className="p-5 border-t border-zinc-100 dark:border-white/10">
      {isOwner ? (
        listing.taken ? (
          <div className="flex flex-col gap-3">
            {listing.takenRoomId && (
              <button onClick={onJoin} disabled={joinLoading} className="w-full py-3 rounded-md bg-amber-500 text-white text-[15px] font-medium hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed">
                {joinLoading ? 'Loading…' : 'Join Room →'}
              </button>
            )}
            <div className="text-center text-[13px] text-amber-600 dark:text-amber-400 font-medium">⏳ This listing is in progress</div>
          </div>
        ) : (
          <div className="flex gap-2">
            <button onClick={onDelete} className="flex-1 py-2.5 rounded-md border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-[13px] font-medium">Delete Listing</button>
          </div>
        )
      ) : listing.taken ? (
        <div className="text-center text-[13px] text-amber-600 dark:text-amber-400 font-medium">⏳ Room in progress</div>
      ) : (
        <button onClick={onOpenDeal} className="btn-primary w-full py-3 text-[15px]">{listing.role === 'buyer' ? 'Sell to Them →' : 'Open Deal →'}</button>
      )}
    </div>
  )
}
