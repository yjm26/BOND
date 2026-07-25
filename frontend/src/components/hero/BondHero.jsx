import HeroCopy from './HeroCopy'
import HeroRibbon from './HeroRibbon'

export default function BondHero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] px-6 pb-16 pt-28 text-[#0a0a0a] sm:px-10 sm:pb-20 sm:pt-32 lg:px-14 lg:pb-24">
      {/* Decorative field stays on the right — never steals left copy column */}
      <HeroRibbon />

      <div className="relative z-10 mx-auto flex max-w-[1180px] items-center">
        <div className="w-full max-w-[560px] lg:max-w-[52%]">
          <HeroCopy />
        </div>
        {/* Spacer keeps visual balance on desktop; ribbon paints into this side */}
        <div className="pointer-events-none hidden flex-1 lg:block" aria-hidden="true" />
      </div>
    </section>
  )
}
