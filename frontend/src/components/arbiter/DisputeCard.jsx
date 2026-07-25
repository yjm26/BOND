import { Link } from 'react-router-dom'
import { formatAddress } from '../../utils/constants'
import { formatTimestamp, formatUsdc } from './arbiterUtils'

export default function DisputeCard({ room, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full border p-4 text-left transition ${active ? 'border-[var(--a-muted,#a3a3a3)]/45 bg-[var(--a-chip)]' : 'border-[var(--a-line)] bg-[var(--a-surface,#111111)] hover:border-[var(--a-ink,#fafafa)]/24 hover:bg-[#171717]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#b87333]">Room #{room.id} · Disputed</div>
          <h3 className="mt-3 line-clamp-2 text-[22px] font-medium leading-[1] tracking-[-0.05em] text-[var(--a-ink,#fafafa)]">{room.itemDescription || 'Untitled room'}</h3>
        </div>
        <Link to={`/room/${room.id}`} onClick={(event) => event.stopPropagation()} className="shrink-0 border border-[var(--a-line)] px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--a-ink,#fafafa)]/52 hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)]">Open</Link>
      </div>
      <div className="mt-5 grid gap-3 text-[12px] text-[var(--a-muted,#a3a3a3)] sm:grid-cols-3">
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">Locked</span><span className="font-mono text-[var(--a-ink,#fafafa)]">{formatUsdc(room.fundedAmount)} USDC</span></div>
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">Buyer</span><span className="font-mono text-[var(--a-ink,#fafafa)]">{formatAddress(room.buyer)}</span></div>
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">Disputed</span><span className="text-[var(--a-ink,#fafafa)]">{formatTimestamp(room.disputedAt)}</span></div>
      </div>
    </button>
  )
}
