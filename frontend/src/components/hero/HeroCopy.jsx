import HeroCtaGroup from './HeroCtaGroup'
import HeroFactStrip from './HeroFactStrip'
import { HERO_FACTS } from './heroData'

export default function HeroCopy({ wallet, onConnect }) {
  return (
    <div className="relative flex w-full flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-16">
      <div className="w-full">
        <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6b62]">Arc-native escrow rooms</div>
        <h1 className="max-w-[940px] text-[clamp(48px,14vw,124px)] font-medium leading-[0.9] tracking-[-0.08em] text-[#0d0d0b] sm:text-[clamp(54px,9vw,124px)] sm:leading-[0.88] sm:tracking-[-0.085em]">
          The deal room strangers don't have to trust.
        </h1>
        <p className="mt-6 max-w-[680px] text-[16px] leading-[1.62] tracking-[-0.02em] text-[#35342f]/80 sm:text-[20px] sm:leading-[1.68]">
          BOND turns risky digital work and marketplace trades into private escrow rooms. Lock USDC on Arc, attach delivery proof, and settle by release, refund, or arbitration.
        </p>
        <HeroCtaGroup wallet={wallet} onConnect={onConnect} />
      </div>
      <div className="w-full">
        <HeroFactStrip facts={HERO_FACTS} />
      </div>
    </div>
  )
}
