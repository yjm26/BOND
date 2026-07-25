import HeroCtaGroup from './HeroCtaGroup'

export default function HeroCopy({ wallet, onConnect }) {
  return (
    <div className="relative flex w-full flex-col px-6 py-8 sm:px-10 lg:px-16 lg:py-16 xl:px-20">
      <div className="w-full pt-6 sm:pt-10 lg:pt-[8vh] xl:pt-[10vh]">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">
          USDC escrow on Arc
        </div>
        <h1 className="max-w-[1180px] text-[clamp(84px,23vw,320px)] font-medium leading-[0.78] tracking-[-0.11em] text-[#0a0a0a] sm:text-[clamp(112px,22vw,320px)] sm:leading-[0.76] sm:tracking-[-0.115em]">
          BOND
        </h1>
        <p className="mt-7 max-w-[760px] text-[16px] leading-[1.62] tracking-[-0.02em] text-[#404040]/80 sm:text-[20px] sm:leading-[1.68]">
          For internet deals that need locked USDC, visible terms, and a clear next action — fund, deliver, release, or dispute.
        </p>
        <HeroCtaGroup wallet={wallet} onConnect={onConnect} />
      </div>
    </div>
  )
}
