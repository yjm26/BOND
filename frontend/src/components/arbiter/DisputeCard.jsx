import { Link } from 'react-router-dom'
import { formatAddress } from '../../utils/constants'
import { formatTimestamp, formatUsdc } from './arbiterUtils'

export default function DisputeCard({ room, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full border p-4 text-left transition ${active ? 'border-[#a3a3a3]/45 bg-[#a3a3a3]/[0.08]' : 'border-[#fafafa]/10 bg-[#111111] hover:border-[#fafafa]/24 hover:bg-[#171717]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#b87333]">Room #{room.id} · Disputed</div>
          <h3 className="mt-3 line-clamp-2 text-[22px] font-medium leading-[1] tracking-[-0.05em] text-[#fafafa]">{room.itemDescription || 'Untitled room'}</h3>
        </div>
        <Link to={`/room/${room.id}`} onClick={(event) => event.stopPropagation()} className="shrink-0 border border-[#fafafa]/14 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#fafafa]/52 hover:border-[#fafafa]/30 hover:text-[#fafafa]">Open</Link>
      </div>
      <div className="mt-5 grid gap-3 text-[12px] text-[#a3a3a3] sm:grid-cols-3">
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#fafafa]/34">Locked</span><span className="font-mono text-[#fafafa]">{formatUsdc(room.fundedAmount)} USDC</span></div>
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#fafafa]/34">Buyer</span><span className="font-mono text-[#fafafa]">{formatAddress(room.buyer)}</span></div>
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#fafafa]/34">Disputed</span><span className="text-[#fafafa]">{formatTimestamp(room.disputedAt)}</span></div>
      </div>
    </button>
  )
}
