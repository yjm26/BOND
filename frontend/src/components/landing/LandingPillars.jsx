import { ExitMark, MarketMark, RoomMark } from './pillarMarks'

const PILLARS = [
  {
    fig: '01',
    label: 'Room',
    line: 'Fund USDC against fixed terms and wallets.',
    Mark: RoomMark,
  },
  {
    fig: '02',
    label: 'Market',
    line: 'Post or join a listing, then open a room.',
    Mark: MarketMark,
  },
  {
    fig: '03',
    label: 'Exit',
    line: 'Release, refund, or dispute — named paths only.',
    Mark: ExitMark,
  },
]

/**
 * Linear-style FIG pillars: dark field + mono line marks + short copy.
 */
export default function LandingPillars() {
  return (
    <section className="bg-[#fafafa] px-6 pb-16 pt-2 text-[#0a0a0a] sm:px-10 sm:pb-20 lg:px-14">
      <div className="mx-auto max-w-[1080px] overflow-hidden border border-[#0a0a0a]/12 bg-[#0a0a0a]">
        <div className="grid sm:grid-cols-3">
          {PILLARS.map((item, index) => {
            const Mark = item.Mark
            return (
              <div
                key={item.fig}
                className={`flex min-h-[320px] flex-col border-[#fafafa]/10 px-6 py-7 sm:min-h-[360px] sm:px-7 sm:py-8 ${
                  index > 0 ? 'border-t sm:border-l sm:border-t-0' : ''
                }`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#525252]">
                  {item.fig}
                </div>

                <div className="flex flex-1 items-center justify-center py-8 text-[#fafafa]/88">
                  <Mark className="h-[120px] w-[140px] sm:h-[132px] sm:w-[152px]" />
                </div>

                <div>
                  <div className="text-[20px] font-medium tracking-[-0.035em] text-[#fafafa] sm:text-[22px]">
                    {item.label}
                  </div>
                  <p className="mt-2 max-w-[28ch] text-[13px] leading-[1.5] tracking-[-0.01em] text-[#a3a3a3]">
                    {item.line}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
