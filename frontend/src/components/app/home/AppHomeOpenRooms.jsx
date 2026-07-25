import { Link } from 'react-router-dom'
import useOwnedRooms from '../../../hooks/useOwnedRooms'
import AppHomeOpenRoomRow from './AppHomeOpenRoomRow'
import { getOpenRooms } from './appHomeRooms'

function OpenRoomsSkeleton() {
  return (
    <div>
      {[0, 1].map((key) => (
        <div key={key} className="border-t border-[#fafafa]/08 px-4 py-4 sm:px-5">
          <div className="h-3 w-28 bg-[#fafafa]/8" />
          <div className="mt-3 h-4 w-[66%] max-w-[320px] bg-[#fafafa]/10" />
          <div className="mt-2 h-3 w-40 bg-[#fafafa]/6" />
        </div>
      ))}
    </div>
  )
}

export default function AppHomeOpenRooms({ wallet }) {
  const { rooms, loading } = useOwnedRooms(wallet)
  const openRooms = getOpenRooms(rooms)

  return (
    <section className="border-t border-[#fafafa]/10">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-5">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Open rooms</div>
        <Link
          to="/rooms"
          className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/42 transition duration-160 ease-out hover:text-[#fafafa] active:scale-[0.98]"
        >
          All rooms →
        </Link>
      </div>

      {loading ? (
        <OpenRoomsSkeleton />
      ) : openRooms.length === 0 ? (
        <div className="border-t border-[#fafafa]/10 px-4 py-8 sm:px-5">
          <h2 className="text-[22px] font-medium tracking-[-0.04em] text-[#fafafa]">No open rooms.</h2>
          <p className="mt-2 max-w-[420px] text-[13px] leading-[1.55] text-[#a3a3a3]">
            Create a room or open a listing when you are ready to lock USDC.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link
              to="/create"
              className="inline-flex h-10 items-center border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition duration-160 ease-out hover:bg-transparent hover:text-[#fafafa] active:scale-[0.97]"
            >
              Create room
            </Link>
            <Link
              to="/market"
              className="inline-flex h-10 items-center border border-[#fafafa]/16 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/70 transition duration-160 ease-out hover:border-[#fafafa]/34 hover:text-[#fafafa] active:scale-[0.97]"
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
