import { CONTRACT_ADDRESS, explorerAddressUrl } from '../../utils/contract'
import { ROOM_STATE_TONE } from './roomDetailStyles'

/**
 * Room hierarchy (P1): state + money + role first; title second. No layout redesign.
 */
export default function RoomHeader({ id, room, role, priceUSDC, totalUSDC }) {
  const short = `${CONTRACT_ADDRESS.slice(0, 6)}…${CONTRACT_ADDRESS.slice(-4)}`
  const price = priceUSDC ?? room.price
  const fundTotal = totalUSDC

  return (
    <div className="mb-4 border border-[var(--a-line)] bg-[var(--a-surface)] p-4 sm:mb-5 sm:p-5">
      <div className="flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--a-muted)]">
            Room #{id}
          </span>
          <span
            className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] ${ROOM_STATE_TONE[room.state] || 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48'}`}
          >
            {room.state}
          </span>
          {role && (
            <span className="border border-[var(--a-line)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--a-muted)]">
              You · {role}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
          <h1 className="max-w-[720px] text-[clamp(26px,4.5vw,40px)] font-medium leading-[1.05] tracking-[-0.06em] text-[var(--a-ink)]">
            {room.item}
          </h1>
          <div className="shrink-0 sm:text-right">
            <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-muted)]">
              {room.state === 'Joined' || room.state === 'Created' ? 'Price' : 'Escrow'}
            </div>
            <div className="mt-1 font-mono text-[22px] font-medium tracking-[-0.03em] text-[var(--a-ink)] sm:text-[24px]">
              {price} <span className="text-[13px] text-[var(--a-muted)]">USDC</span>
            </div>
            {fundTotal && room.state === 'Joined' && (
              <div className="mt-0.5 font-mono text-[11px] text-[var(--a-muted)]">
                Fund total {fundTotal} (price + 1%)
              </div>
            )}
          </div>
        </div>

        <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-[color:var(--a-faint)]">
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
    </div>
  )
}
