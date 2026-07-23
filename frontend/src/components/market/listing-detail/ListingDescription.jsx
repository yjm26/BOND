export default function ListingDescription({ description }) {
  if (!description) return <div className="text-[13px] text-zinc-400 italic">No description provided.</div>
  return (
    <div>
      <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-1.5">Description</div>
      <p className="text-[14px] text-zinc-700 dark:text-gray-300 leading-[1.6] whitespace-pre-wrap">{description}</p>
    </div>
  )
}
