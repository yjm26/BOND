export default function RoomStatusMessage({ status }) {
  if (!status) return null
  const tone = status.type === 'ok' ? 'border-[#8f9a88]/28 bg-[#8f9a88]/10 text-[#8f9a88]' : status.type === 'err' ? 'border-[#b87333]/35 bg-[#b87333]/10 text-[#b87333]' : 'border-[var(--a-muted,#a3a3a3)]/24 bg-[var(--a-muted,#a3a3a3)]/[0.07] text-[var(--a-muted,#a3a3a3)]'
  return <div className={`border px-4 py-3 text-[13px] leading-[1.55] ${tone}`}>{status.msg}</div>
}
