import HeroCtaGroup from './HeroCtaGroup'
import HeroFactStrip from './HeroFactStrip'
import { HERO_FACTS } from './heroData'

export default function HeroCopy({ wallet, onConnect }) {
  return (
    <div className="relative flex flex-col justify-between px-6 py-8 sm:px-10 lg:px-14 lg:py-12">
      <div>
        <h1 className="max-w-[780px] text-[clamp(54px,8vw,112px)] font-medium leading-[0.88] tracking-[-0.085em] text-[#0d0d0b]">
          The deal room strangers don't have to trust.
        </h1>
        <p className="mt-7 max-w-[620px] text-[18px] leading-[1.65] tracking-[-0.02em] text-[#35342f]/80 sm:text-[20px]">
          BOND turns risky digital work and marketplace trades into private escrow rooms. Lock USDC on Arc, attach delivery proof, and settle by release, refund, or arbitration.
        </p>
        <HeroCtaGroup wallet={wallet} onConnect={onConnect} />
      </div>
      <HeroFactStrip facts={HERO_FACTS} />
    </div>
  )
}
