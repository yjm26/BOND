import { Link } from 'react-router-dom'
import { formatAddress } from '../../../utils/constants'
import { ROOM_STATE_TONE } from '../../rooms/roomsConstants'
import { roomNextStep } from './appHomeRooms'

export default function AppHomeOpenRoomRow({ room }) {
  return (
    <Link
      to={`/room/${room.id}`}
      className="group grid gap-3 border-t border-[var(--a-line)] bg-[var(--a-panel)] px-4 py-4 no-underline transition duration-160 ease-out hover:bg-[var(--a-surface)] active:scale-[0.995] sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center sm:px-5"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">#{room.id}</span>
          <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em] ${ROOM_STATE_TONE[room.state] || 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48'}`}>
            {room.state}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--a-faint)]">{room.role}</span>
        </div>
        <div className="mt-2 truncate text-[16px] font-medium tracking-[-0.03em] text-[var(--a-ink)] sm:text-[17px]">
          {room.item}
        </div>
        <div className="mt-1 text-[12px] leading-[1.5] text-[var(--a-muted)]">
          {room.price} USDC · {formatAddress(room.counter)}
        </div>
      </div>

      <div className="flex items-center justify-between gap-3 sm:justify-end sm:pl-6">
        <div className="text-[13px] tracking-[-0.01em] text-[color:var(--a-soft)] sm:text-right">
          {roomNextStep(room)}
        </div>
        <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--a-ink)]/28 transition duration-160 ease-out group-hover:translate-x-0.5 group-hover:text-[var(--a-muted)]">
          →
        </span>
      </div>
    </Link>
  )
}
