import { ROOM_STATE_TONE, REVIEW_TIMEOUT_LABELS } from './roomDetailStyles'

export default function RoomHeader({ id, room, role }) {
  return (
    <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">Room #{id}</div>
          <h1 className="mt-4 max-w-[780px] text-[clamp(38px,5vw,68px)] font-medium leading-[0.94] tracking-[-0.08em] text-[#ede9df]">{room.item}</h1>
          <p className="mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[#b9b2a5]">{role ? `You are the ${role}. ` : ''}Escrow terms, participants, proof, and fallback path stay visible in one room.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <span className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${ROOM_STATE_TONE[room.state] || 'border-[#ede9df]/16 text-[#ede9df]/48'}`}>{room.state}</span>
          <span className="border border-[#ede9df]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/42">{REVIEW_TIMEOUT_LABELS[room.dealType] || 'Review timeout'}</span>
        </div>
      </div>
    </div>
  )
}
