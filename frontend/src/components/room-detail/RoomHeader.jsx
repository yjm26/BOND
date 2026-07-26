import { CONTRACT_ADDRESS, explorerAddressUrl } from '../../utils/contract'
import { ROOM_STATE_TONE } from './roomDetailStyles'

export default function RoomHeader({ id, room, role }) {
  const short = `${CONTRACT_ADDRESS.slice(0, 6)}…${CONTRACT_ADDRESS.slice(-4)}`
  return (
    <div className="mb-5 border border-[var(--a-line)] bg-[var(--a-surface)] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--a-muted)]">Room #{id}</div>
          <h1 className="mt-4 max-w-[780px] text-[clamp(38px,5vw,68px)] font-medium leading-[0.94] tracking-[-0.08em] text-[var(--a-ink)]">
            {room.item}
          </h1>
          <p className="mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[var(--a-muted)]">
            {role ? `You are the ${role}. ` : ''}
            Escrow terms, participants, proof, and next action stay in this room.
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--a-faint)]">
            Contract{' '}
            <a
              href={explorerAddressUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--a-muted)] underline-offset-2 hover:text-[var(--a-ink)] hover:underline"
            >
              {short}
            </a>
            {' · '}
            <a
              href={explorerAddressUrl()}
              target="_blank"
              rel="noreferrer"
              className="text-[var(--a-muted)] underline-offset-2 hover:text-[var(--a-ink)] hover:underline"
            >
              ArcScan
            </a>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span
            className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${ROOM_STATE_TONE[room.state] || 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48'}`}
          >
            {room.state}
          </span>
          <span className="border border-[var(--a-line)] px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">
            12h response buffer
          </span>
        </div>
      </div>
    </div>
  )
}
