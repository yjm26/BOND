import { Link } from 'react-router-dom'
import { formatAddress } from '../../../utils/constants'
import { ROOM_STATE_TONE } from '../../rooms/roomsConstants'
import { roomNextStep } from './appHomeRooms'

export default function AppHomeOpenRoomRow({ room }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="group grid gap-3 border-t border-[#ede9df]/10 bg-[#111110] px-4 py-4 no-underline transition duration-160 ease-out hover:bg-[#1a1a18] active:scale-[0.995] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/38">#{room.id}</span>
          <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${ROOM_STATE_TONE[room.state] || 'border-[#ede9df]/16 text-[#ede9df]/48'}`}>
            {room.state}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/34">{room.role}</span>
        </div>
        <div className="mt-2 truncate text-[16px] font-medium tracking-[-0.03em] text-[#ede9df] sm:text-[17px]">
          {room.item}
        </div>
        <div className="mt-1 text-[12px] leading-[1.5] text-[#b9b2a5]">
          {room.price} USDC · {formatAddress(room.counter)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end sm:pl-6">
        <div className="text-[13px] tracking-[-0.01em] text-[#ede9df]/72 sm:text-right">
          {roomNextStep(room)}
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/28 transition duration-160 ease-out group-hover:translate-x-0.5 group-hover:text-[#d8b15f]">
          →
        </span>
      </div>
    </Link>
  )
}
