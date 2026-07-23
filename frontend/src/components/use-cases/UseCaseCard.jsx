export default function UseCaseCard({ item, index }) {
  return (
    <article className="group grid gap-4 border-t border-[#171716]/15 py-5 transition duration-300 hover:border-[#171716]/35 sm:grid-cols-[120px_1fr_280px] sm:items-start sm:gap-6 sm:py-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">
        0{index + 1}<span className="hidden sm:inline"> / Case</span>
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">{item.label}</div>
        <h3 className="mt-3 max-w-[520px] text-[26px] font-medium leading-[1.02] tracking-[-0.055em] text-[#171716] sm:mt-4 sm:text-[34px] sm:leading-[0.98] sm:tracking-[-0.065em]">
          {item.title}
        </h3>
      </div>
      <ul className="space-y-2 sm:space-y-3 sm:pt-8">
        {item.points.map((point) => (
          <li key={point} className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-[#6f6b62] sm:text-[10px] sm:tracking-[0.15em]">
            <span className="h-px w-5 bg-[#171716]/25 transition group-hover:bg-[#d8b15f] sm:w-6" />
            {point}
          </li>
        ))}
      </ul>
    </article>
  )
}
