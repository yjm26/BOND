import { Link } from 'react-router-dom'
import AppHomeOpenRoomRow from './AppHomeOpenRoomRow'
import { getOpenRooms } from './appHomeRooms'

function OpenRoomsSkeleton() {
  return (
    <div>
      {[0, 1].map((key) => (
        <div key={key} className="border-t border-[var(--a-ink)]/08 px-4 py-4 sm:px-5">
          <div className="h-3 w-28 bg-[var(--a-inverse-bg)]/8" />
          <div className="mt-3 h-4 w-[66%] max-w-[320px] bg-[var(--a-inverse-bg)]/10" />
          <div className="mt-2 h-3 w-40 bg-[var(--a-inverse-bg)]/6" />
        </div>
      ))}
    </div>
  )
}

export default function AppHomeOpenRooms({ rooms, loading }) {
  const openRooms = getOpenRooms(Array.isArray(rooms) ? rooms : [])

  return (
    <section className="border-t border-[var(--a-line)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">Open rooms</div>
        <Link
          to="/rooms"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--a-faint)] transition duration-160 ease-out hover:text-[var(--a-ink)] active:scale-[0.98]"
        >
          All rooms →
        </Link>
      </div>

      {loading ? (
        <OpenRoomsSkeleton />
      ) : openRooms.length === 0 ? (
        <div className="border-t border-[var(--a-line)] px-4 py-8 sm:px-5">
          <h2 className="text-[22px] font-medium tracking-[-0.04em] text-[var(--a-ink)]">No open rooms.</h2>
          <p className="mt-2 max-w-[420px] text-[13px] leading-[1.55] text-[var(--a-muted)]">
            Create a room or open a listing when you are ready to lock USDC.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/create"
              className="inline-flex h-10 items-center border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97]"
            >
              Create room
            </Link>
            <Link
              to="/market"
              className="inline-flex h-10 items-center border border-[var(--a-line-strong)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--a-soft)] transition duration-160 ease-out hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] active:scale-[0.97]"
            >
              Browse market
            </Link>
          </div>
        </div>
      ) : (
        <div>
          {openRooms.map((room) => (
            <AppHomeOpenRoomRow key={room.id} room={room} />
          ))}
        </div>
      )}
    </section>
  )
}
