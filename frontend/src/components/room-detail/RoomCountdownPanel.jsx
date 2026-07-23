export default function RoomCountdownPanel({ countdown, room }) {
  if (!countdown) return null
  const danger = countdown === 'Expired' || room.state === 'Disputed'
  const warning = room.state === 'Funded' || room.state === 'Delivered'
  const tone = danger ? 'text-[#c98b4a] border-[#c98b4a]/30 bg-[#c98b4a]/10' : warning ? 'text-[#d8b15f] border-[#d8b15f]/24 bg-[#d8b15f]/[0.07]' : 'text-[#ede9df] border-[#ede9df]/10 bg-[#20201f]'
  const label = room.state === 'Funded' ? 'Seller deadline' : room.state === 'Delivered' ? 'Review timeout' : room.state === 'Disputed' ? 'Arbiter status' : 'Deadline'
  return (
    <div className={`border p-5 ${tone}`}>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-75">{label}</div>
      <div className="font-mono text-[24px] leading-none tracking-[-0.04em]">{countdown}</div>
      {room.state === 'Funded' && <div className="mt-2 text-[12px] opacity-75">Seller should mark delivery before this expires.</div>}
      {room.state === 'Delivered' && <div className="mt-2 text-[12px] opacity-75">Buyer can confirm or dispute. If silent, seller can escalate to arbiter.</div>}
    </div>
  )
}
