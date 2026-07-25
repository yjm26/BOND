import { formatAddress } from '../../utils/constants'

export default function RoomArbiterPanel({ arbiterName, arbiterAddr }) {
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/40">Arbiter</div>
      <div className="text-[14px] font-medium text-[#fafafa]">{arbiterName}</div>
      <div className="mt-1 font-mono text-[11px] text-[#fafafa]/40">{formatAddress(arbiterAddr)}</div>
    </div>
  )
}
