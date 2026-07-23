import { formatAddress } from '../../utils/constants'

export default function RoomArbiterPanel({ arbiterName, arbiterAddr }) {
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/40">Arbiter</div>
      <div className="text-[14px] font-medium text-[#ede9df]">{arbiterName}</div>
      <div className="mt-1 font-mono text-[11px] text-[#ede9df]/40">{formatAddress(arbiterAddr)}</div>
    </div>
  )
}
