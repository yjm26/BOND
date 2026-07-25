import { Link } from 'react-router-dom'
import { formatAddress } from '../../../utils/constants'
import { ROOM_STATE_TONE } from '../../rooms/roomsConstants'
import { roomNextStep } from './appHomeRooms'

export default function AppHomeOpenRoomRow({ room }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="group grid gap-3 border-t border-[#fafafa]/10 bg-[#0a0a0a] px-4 py-4 no-underline transition duration-160 ease-out hover:bg-[#111111] active:scale-[0.995] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/38">#{room.id}</span>
          <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${ROOM_STATE_TONE[room.state] || 'border-[#fafafa]/16 text-[#fafafa]/48'}`}>
            {room.state}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/34">{room.role}</span>
        </div>
        <div className="mt-2 truncate text-[16px] font-medium tracking-[-0.03em] text-[#fafafa] sm:text-[17px]">
          {room.item}
        </div>
        <div className="mt-1 text-[12px] leading-[1.5] text-[#a3a3a3]">
          {room.price} USDC · {formatAddress(room.counter)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end sm:pl-6">
        <div className="text-[13px] tracking-[-0.01em] text-[#fafafa]/72 sm:text-right">
          {roomNextStep(room)}
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/28 transition duration-160 ease-out group-hover:translate-x-0.5 group-hover:text-[#a3a3a3]">
          →
        </span>
      </div>
    </Link>
  )
}
