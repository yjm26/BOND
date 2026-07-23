import UseCaseCard from './UseCaseCard'
import { USE_CASES } from './useCaseData'

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-[#ede9df] px-6 pb-16 text-[#171716] sm:px-10 sm:pb-28 lg:px-14">
      <div className="border-y border-[#171716]/15 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[34%_1fr] lg:items-end">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6b62]">Use cases</div>
            <h2 className="mt-5 max-w-[520px] text-[clamp(38px,5vw,68px)] font-medium leading-[0.94] tracking-[-0.08em] text-[#171716]">
              Built for deals that usually happen in DMs.
            </h2>
          </div>
          <p className="max-w-[640px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#5f5a50] lg:justify-self-end">
            BOND is for agreements that start informally but need a safer settlement path before money moves: work, marketplace handoffs, and milestone-based services.
          </p>
        </div>
      </div>

      <div className="mt-6 border-b border-[#171716]/15 sm:mt-8">
        {USE_CASES.map((item, index) => (
          <UseCaseCard key={item.label} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
