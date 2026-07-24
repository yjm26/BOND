export default function ListingDescription({ description }) {
  if (!description) {
    return (
      <div className="border border-[#ede9df]/10 bg-[#20201f]/55 p-4 text-[13px] italic leading-[1.6] text-[#ede9df]/42">
        No description provided.
      </div>
    )
  }

  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f]/55 p-4">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede9df]/34">Description</div>
      <p className="mt-2 whitespace-pre-wrap text-[14px] leading-[1.65] text-[#d8d1c2]">{description}</p>
    </div>
  )
}
