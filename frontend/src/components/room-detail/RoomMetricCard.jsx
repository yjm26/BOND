export default function RoomMetricCard({ label, value, note, tone = 'default' }) {
  const toneClass = tone === 'success' ? 'text-[#b7c8a3]' : tone === 'warning' ? 'text-[#d8b15f]' : tone === 'danger' ? 'text-[#c98b4a]' : 'text-[#ede9df]'
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/34">{label}</div>
      <div className={`mt-3 font-mono text-[28px] leading-none tracking-[-0.04em] ${toneClass}`}>{value}</div>
      {note && <div className="mt-2 text-[12px] leading-[1.55] text-[#b9b2a5]">{note}</div>}
    </div>
  )
}
