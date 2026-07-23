export default function UseCaseCard({ item, index }) {
  return (
    <article className="group grid gap-6 border-t border-[#171716]/15 py-7 transition duration-300 hover:border-[#171716]/35 sm:grid-cols-[120px_1fr_280px] sm:items-start">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">
        0{index + 1}<span className="hidden sm:inline"> / Case</span>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">{item.label}</div>
        <h3 className="mt-4 max-w-[520px] text-[34px] font-medium leading-[0.98] tracking-[-0.065em] text-[#171716]">
          {item.title}
        </h3>
      </div>
      <ul className="space-y-3 sm:pt-8">
        {item.points.map((point) => (
          <li key={point} className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.15em] text-[#6f6b62]">
            <span className="h-px w-6 bg-[#171716]/25 transition group-hover:bg-[#d8b15f]" />
            {point}
          </li>
        ))}
      </ul>
    </article>
  )
}
