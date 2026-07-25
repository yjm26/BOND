export default function RoomCountdownPanel({ countdown, room }) {
  if (!countdown) return null
  const danger = countdown === 'Expired' || room.state === 'Disputed'
  const warning = room.state === 'Funded' || room.state === 'Delivered'
  const tone = danger ? 'text-[#b87333] border-[#b87333]/30 bg-[#b87333]/10' : warning ? 'text-[var(--a-muted,#a3a3a3)] border-[var(--a-muted,#a3a3a3)]/24 bg-[var(--a-muted,#a3a3a3)]/[0.07]' : 'text-[var(--a-ink,#fafafa)] border-[var(--a-line)] bg-[var(--a-surface,#111111)]'
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
