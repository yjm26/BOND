import { Link } from 'react-router-dom'

export default function HeroIntro() {
  return (
    <div className="mx-auto max-w-[820px] text-center">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">
        Escrow on Arc
      </div>
      <h1 className="mt-5 text-[clamp(34px,5.6vw,64px)] font-medium leading-[1.02] tracking-[-0.06em] text-[#0a0a0a]">
        Lock USDC. Settle the deal.
      </h1>
      <p className="mx-auto mt-5 max-w-[420px] text-[15px] leading-[1.55] tracking-[-0.015em] text-[#525252]">
        Terms, parties, and the next action stay in one room.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/app"
          className="inline-flex h-11 items-center justify-center border border-[#0a0a0a] bg-[#0a0a0a] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]"
        >
          Go to app
        </Link>
        <a
          href="#market"
          className="inline-flex h-11 items-center justify-center border border-[#0a0a0a]/18 bg-transparent px-5 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a] transition duration-160 ease-out hover:border-[#0a0a0a] hover:bg-[#0a0a0a]/[0.03] active:scale-[0.97]"
        >
          Market
        </a>
      </div>
    </div>
  )
}
