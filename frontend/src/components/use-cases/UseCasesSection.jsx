import UseCaseCard from './UseCaseCard'
import { USE_CASES } from './useCaseData'

export default function UseCasesSection() {
  return (
    <section id="use-cases" className="bg-[#fafafa] px-6 pb-16 text-[#0a0a0a] sm:px-10 sm:pb-28 lg:px-14">
      <div className="border-y border-[#0a0a0a]/15 py-8 sm:py-10">
        <div className="grid gap-8 lg:grid-cols-[38%_1fr] lg:items-end">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Where it fits</div>
            <h2 className="mt-5 max-w-[560px] text-[clamp(40px,5vw,72px)] font-medium leading-[0.9] tracking-[-0.085em] text-[#0a0a0a]">
              Not every deal needs BOND. The awkward ones do.
            </h2>
          </div>
          <p className="max-w-[660px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#525252] lg:justify-self-end">
            Use it when the counterparty is real, the terms are clear enough to write down, and neither side should be holding all the risk while the other promises to behave.
          </p>
        </div>
      </div>

      <div className="mt-6 border-b border-[#0a0a0a]/15 sm:mt-8">
        {USE_CASES.map((item, index) => (
          <UseCaseCard key={item.label} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
