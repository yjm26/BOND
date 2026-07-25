export default function ListingDescription({ description }) {
  if (!description) {
    return (
      <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)]/55 p-4 text-[13px] italic leading-[1.6] text-[color:var(--a-faint)]">
        No description provided.
      </div>
    )
  }

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)]/55 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">Description</div>
      <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.65] text-[#e5e5e5]">{description}</p>
    </div>
  )
}
