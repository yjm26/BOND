export default function RoomMetricCard({ label, value, note, tone = 'default' }) {
  const toneClass = tone === 'success' ? 'text-[#8f9a88]' : tone === 'warning' ? 'text-[var(--a-muted,#a3a3a3)]' : tone === 'danger' ? 'text-[#b87333]' : 'text-[var(--a-ink,#fafafa)]'
  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">{label}</div>
      <div className={`mt-3 font-mono text-[28px] leading-none tracking-[-0.04em] ${toneClass}`}>{value}</div>
      {note && <div className="mt-2 text-[12px] leading-[1.55] text-[var(--a-muted,#a3a3a3)]">{note}</div>}
    </div>
  )
}
