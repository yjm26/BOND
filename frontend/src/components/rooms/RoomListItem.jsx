import { Link } from 'react-router-dom'
import { formatAddress } from '../../utils/constants'
import { ROOM_STATE_TONE } from './roomsConstants'
import { roomOutcomeLabel } from './roomsUtils'

export default function RoomListItem({ room }) {
  return (
    <Link to={`/room/${room.id}`} className="group grid gap-4 bg-[#0a0a0a] p-5 text-[#fafafa] no-underline transition hover:bg-[#111111] sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#fafafa]/12 bg-[#111111] font-mono text-[11px] font-semibold text-[#fafafa]/60">#{room.id}</div>
        <div className="min-w-0">
          <div className="truncate text-[18px] font-medium tracking-[-0.04em] text-[#fafafa]">{room.item}</div>
          <div className="mt-2 text-[12px] leading-[1.6] text-[#a3a3a3]">{room.role} · {room.price} USDC{Number(room.collateral) > 0 ? ` · ${room.collateral} collateral` : ''} · {formatAddress(room.counter)}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${ROOM_STATE_TONE[room.state] || 'border-[#fafafa]/16 text-[#fafafa]/48'}`}>{room.state}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/36 group-hover:text-[#fafafa]/62">{roomOutcomeLabel(room.state)} →</span>
      </div>
    </Link>
  )
}
