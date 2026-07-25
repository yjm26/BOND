import { LANDING_USE_CASES, LANDING_USE_NOTE } from './useCasesData'

/**
 * Who uses BOND — modular audience list (dry copy).
 */
export default function LandingUseCasesSection() {
  return (
    <section
      id="use"
      className="bg-[#fafafa] px-6 py-16 text-[#0a0a0a] sm:px-10 sm:py-20 lg:px-14 lg:py-24"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 border-b border-[#0a0a0a]/12 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Use</div>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(28px,4vw,42px)] font-medium leading-[1.05] tracking-[-0.05em]">
              For deals you already make in chat.
            </h2>
          </div>
          <p className="max-w-[240px] text-[14px] leading-[1.5] text-[#525252] sm:text-right">
            Private escrow when Discord middlemen are the alternative.
          </p>
        </div>

        <div className="mt-2">
          {LANDING_USE_CASES.map((row, index) => (
            <div
              key={row.id}
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-2 border-b border-[#0a0a0a]/12 py-7 sm:grid-cols-[72px_minmax(0,0.9fr)_minmax(0,1.3fr)] sm:items-baseline sm:gap-8 sm:py-8"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#737373]">
                0{index + 1}
              </div>
              <div className="text-[clamp(20px,2.4vw,26px)] font-medium tracking-[-0.035em]">{row.title}</div>
              <p className="col-span-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-[#525252] sm:col-span-1 sm:col-start-3">
                {row.body}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 border border-[#0a0a0a]/12 bg-white px-5 py-4 text-[14px] leading-[1.55] text-[#525252]">
          <span className="font-medium text-[#0a0a0a]">Note.</span> {LANDING_USE_NOTE}
        </div>
      </div>
    </section>
  )
}
