import { Link } from 'react-router-dom'
import { formatAddress } from '../../utils/constants'
import { ROOM_STATE_TONE } from './roomsConstants'
import { roomOutcomeLabel } from './roomsUtils'

export default function RoomListItem({ room }) {
  return (
    <Link to={`/room/${room.id}`} className="group grid gap-4 bg-[var(--a-panel)] p-5 text-[var(--a-ink)] no-underline transition hover:bg-[var(--a-surface)] sm:grid-cols-[1fr_auto] sm:items-center">
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[var(--a-line)] bg-[var(--a-surface)] font-mono text-[11px] font-semibold text-[var(--a-ink)]/60">#{room.id}</div>
        <div className="min-w-0">
          <div className="truncate text-[18px] font-medium tracking-[-0.04em] text-[var(--a-ink)]">{room.item}</div>
          <div className="mt-2 text-[12px] leading-[1.6] text-[var(--a-muted)]">{room.role} · {room.price} USDC{Number(room.collateral) > 0 ? ` · ${room.collateral} collateral` : ''} · {formatAddress(room.counter)}</div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-3 sm:justify-end">
        <span className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${ROOM_STATE_TONE[room.state] || 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48'}`}>{room.state}</span>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--a-ink)]/36 group-hover:text-[var(--a-ink)]/62">{roomOutcomeLabel(room.state)} →</span>
      </div>
    </Link>
  )
}
