export default function RoomStatusMessage({ status }) {
  if (!status) return null
  const tone = status.type === 'ok' ? 'border-[#b7c8a3]/28 bg-[#b7c8a3]/10 text-[#b7c8a3]' : status.type === 'err' ? 'border-[#c98b4a]/35 bg-[#c98b4a]/10 text-[#c98b4a]' : 'border-[#d8b15f]/24 bg-[#d8b15f]/[0.07] text-[#d8b15f]'
  return <div className={`border px-4 py-3 text-[13px] leading-[1.55] ${tone}`}>{status.msg}</div>
}
