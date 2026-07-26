export default function RoomCountdownPanel({ countdown, countdownLabel, room }) {
  if (!countdown) return null
  const danger = countdown === 'Expired' || room.state === 'Disputed'
  const warning = room.state === 'Funded' || room.state === 'Delivered'
  const tone = danger
    ? 'text-[#b87333] border-[#b87333]/30 bg-[#b87333]/10'
    : warning
      ? 'text-[var(--a-muted)] border-[var(--a-muted)]/24 bg-[var(--a-muted)]/[0.07]'
      : 'text-[var(--a-ink)] border-[var(--a-line)] bg-[var(--a-surface)]'

  const label =
    countdownLabel ||
    (room.state === 'Funded'
      ? 'Delivery deadline'
      : room.state === 'Delivered'
        ? 'Response buffer'
        : room.state === 'Disputed'
          ? 'Arbiter status'
          : room.state === 'Joined'
            ? 'Fund window'
            : room.state === 'Created'
              ? 'Join window'
              : 'Deadline')

  return (
    <div className={`border p-5 ${tone}`}>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] opacity-75">{label}</div>
      <div className="font-mono text-[24px] leading-none tracking-[-0.04em]">{countdown}</div>
      {room.state === 'Funded' && (
        <div className="mt-2 text-[12px] opacity-75">
          Clock starts when funded (not at create). Seller should mark delivery before this expires.
          {room.deliveryDays > 0 ? ` Window: ${room.deliveryDays} day(s).` : ''}
        </div>
      )}
      {room.state === 'Delivered' && (
        <div className="mt-2 text-[12px] opacity-75">
          Buyer can release or dispute. If silent past this buffer, seller can escalate to arbiter.
        </div>
      )}
      {room.state === 'Joined' && (
        <div className="mt-2 text-[12px] opacity-75">Buyer has 30 minutes from join to fund.</div>
      )}
    </div>
  )
}
