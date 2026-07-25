import { formatAddress } from '../../utils/constants'

export default function RoomArbiterPanel({ arbiterName, arbiterAddr }) {
  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink)]/40">Arbiter</div>
      <div className="text-[14px] font-medium text-[var(--a-ink)]">{arbiterName}</div>
      <div className="mt-1 font-mono text-[11px] text-[var(--a-ink)]/40">{formatAddress(arbiterAddr)}</div>
    </div>
  )
}
