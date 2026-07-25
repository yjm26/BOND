export default function RoomGuidePanel({ guide }) {
  if (!guide?.length) return null
  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink)]/40">What to do</div>
      <ul className="grid gap-2">
        {guide.map((item, index) => (
          <li key={index} className="flex gap-3 text-[13px] leading-[1.6] text-[var(--a-muted)]"><span className="mt-[0.6em] h-1 w-1 shrink-0 bg-[var(--a-muted)]" />{item}</li>
        ))}
      </ul>
    </div>
  )
}
