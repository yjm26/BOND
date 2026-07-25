export default function RoomMetricCard({ label, value, note, tone = 'default' }) {
  const toneClass = tone === 'success' ? 'text-[#8f9a88]' : tone === 'warning' ? 'text-[#a3a3a3]' : tone === 'danger' ? 'text-[#b87333]' : 'text-[#fafafa]'
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/34">{label}</div>
      <div className={`mt-3 font-mono text-[28px] leading-none tracking-[-0.04em] ${toneClass}`}>{value}</div>
      {note && <div className="mt-2 text-[12px] leading-[1.55] text-[#a3a3a3]">{note}</div>}
    </div>
  )
}
