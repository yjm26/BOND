import { Link } from 'react-router-dom'

/** Linear-style left hero type — same horizontal bound as the room demo. */
export default function HeroIntro() {
  return (
    <div className="w-full max-w-[1080px]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
        <div className="min-w-0 max-w-[720px]">
          <h1 className="motion-hero-rise motion-hero-rise-d1 text-[clamp(36px,5.5vw,64px)] font-medium leading-[1.02] tracking-[-0.055em] text-[#0a0a0a]">
            Lock USDC.
            <br />
            Settle the deal.
          </h1>
          <p className="motion-hero-rise motion-hero-rise-d2 mt-5 max-w-[420px] text-[15px] leading-[1.55] tracking-[-0.01em] text-[#525252]">
            Terms, parties, and the next action stay in one room.
          </p>
          <div className="motion-hero-rise motion-hero-rise-d3 mt-8 flex flex-wrap items-center gap-3">
            <Link
              to="/app"
              className="inline-flex h-11 items-center justify-center border border-[#0a0a0a] bg-[#0a0a0a] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]"
            >
              Go to app
            </Link>
            <Link
              to="/market"
              className="inline-flex h-11 items-center justify-center border border-[#0a0a0a]/18 bg-transparent px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a] transition duration-160 ease-out hover:border-[#0a0a0a] hover:bg-[#0a0a0a]/[0.03] active:scale-[0.97]"
            >
              Market
            </Link>
          </div>
        </div>

        <Link
          to="/docs"
          className="shrink-0 self-start font-mono text-[12px] tracking-[-0.01em] text-[#525252] transition-colors duration-160 ease-out hover:text-[#0a0a0a] lg:self-end"
        >
          Read the flow →
        </Link>
      </div>
    </div>
  )
}
