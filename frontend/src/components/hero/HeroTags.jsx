export default function HeroTags({ tags }) {
  return (
    <div className="mb-8 flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-[0.18em] text-[#0d0d0b]/60">
      {tags.map((tag) => (
        <span key={tag} className="rounded-full border border-[#0d0d0b]/15 px-3 py-1.5">
          {tag}
        </span>
      ))}
    </div>
  )
}
