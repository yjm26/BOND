const PILLARS = [
  {
    fig: '01',
    label: 'Room',
    line: 'Fund USDC against fixed terms and wallets.',
  },
  {
    fig: '02',
    label: 'Market',
    line: 'Post or join a listing, then open a room.',
  },
  {
    fig: '03',
    label: 'Exit',
    line: 'Release, refund, or dispute — named paths only.',
  },
]

export default function LandingPillars() {
  return (
    <section className="bg-[#fafafa] px-6 pb-16 pt-4 text-[#0a0a0a] sm:px-10 sm:pb-20 lg:px-14">
      <div className="mx-auto grid max-w-[1080px] gap-px border border-[#0a0a0a]/12 bg-[#0a0a0a]/12 sm:grid-cols-3">
        {PILLARS.map((item) => (
          <div key={item.fig} className="bg-[#fafafa] p-6 sm:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">{item.fig}</div>
            <div className="mt-4 text-[22px] font-medium tracking-[-0.04em] sm:text-[24px]">{item.label}</div>
            <p className="mt-3 max-w-[28ch] text-[14px] leading-[1.5] tracking-[-0.01em] text-[#525252]">
              {item.line}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
