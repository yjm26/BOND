import HeroCtaGroup from './HeroCtaGroup'

export default function HeroCopy() {
  return (
    <div className="text-left">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">
        Escrow for internet deals
      </div>
      <h1 className="mt-5 text-[clamp(64px,11vw,120px)] font-medium leading-[0.88] tracking-[-0.08em] text-[#0a0a0a]">
        BOND
      </h1>
      <p className="mt-7 max-w-[420px] text-[16px] leading-[1.65] tracking-[-0.015em] text-[#525252] sm:text-[17px]">
        For deals too valuable for vibes and too small for lawyers. Put the money in a room, make the terms
        visible, and only move USDC when the outcome is clear.
      </p>
      <HeroCtaGroup />
    </div>
  )
}
