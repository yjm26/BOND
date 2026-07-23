import { Link } from 'react-router-dom'
import { formatAddress } from '../../utils/constants'
import { formatTimestamp, formatUsdc } from './arbiterUtils'

export default function DisputeCard({ room, active, onClick }) {
  return (
    <button onClick={onClick} className={`w-full border p-4 text-left transition ${active ? 'border-[#d8b15f]/45 bg-[#d8b15f]/[0.08]' : 'border-[#ede9df]/10 bg-[#20201f] hover:border-[#ede9df]/24 hover:bg-[#242421]'}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#c98b4a]">Room #{room.id} · Disputed</div>
          <h3 className="mt-3 line-clamp-2 text-[22px] font-medium leading-[1] tracking-[-0.05em] text-[#ede9df]">{room.itemDescription || 'Untitled room'}</h3>
        </div>
        <Link to={`/room/${room.id}`} onClick={(event) => event.stopPropagation()} className="shrink-0 border border-[#ede9df]/14 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ede9df]/52 hover:border-[#ede9df]/30 hover:text-[#ede9df]">Open</Link>
      </div>
      <div className="mt-5 grid gap-3 text-[12px] text-[#b9b2a5] sm:grid-cols-3">
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#ede9df]/34">Locked</span><span className="font-mono text-[#ede9df]">{formatUsdc(room.fundedAmount)} USDC</span></div>
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#ede9df]/34">Buyer</span><span className="font-mono text-[#ede9df]">{formatAddress(room.buyer)}</span></div>
        <div><span className="block font-mono text-[9px] uppercase tracking-[0.16em] text-[#ede9df]/34">Disputed</span><span className="text-[#ede9df]">{formatTimestamp(room.disputedAt)}</span></div>
      </div>
    </button>
  )
}
