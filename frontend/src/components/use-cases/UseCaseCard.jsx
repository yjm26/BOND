export default function UseCaseCard({ item, index }) {
  return (
    <article className="group grid gap-4 border-t border-[#0a0a0a]/15 py-5 transition duration-300 hover:border-[#0a0a0a]/35 sm:grid-cols-[120px_1fr_280px] sm:items-start sm:gap-6 sm:py-7">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">
        0{index + 1}
      </div>
      <div>
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">{item.label}</div>
        <h3 className="mt-3 max-w-[520px] text-[26px] font-medium leading-[1.02] tracking-[-0.055em] text-[#0a0a0a] sm:mt-4 sm:text-[34px] sm:leading-[0.98] sm:tracking-[-0.065em]">
          {item.title}
        </h3>
      </div>
      <ul className="space-y-2 sm:space-y-3 sm:pt-8">
        {item.points.map((point) => (
          <li key={point} className="flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.13em] text-[#737373] sm:text-[10px] sm:tracking-[0.15em]">
            <span className="h-px w-5 bg-[#0a0a0a]/25 transition group-hover:bg-[#a3a3a3] sm:w-6" />
            {point}
          </li>
        ))}
      </ul>
    </article>
  )
}
