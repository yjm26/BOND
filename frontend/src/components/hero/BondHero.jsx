import HeroCopy from './HeroCopy'
import HeroRibbon from './HeroRibbon'

export default function BondHero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] px-6 pb-16 pt-28 text-[#0a0a0a] sm:px-10 sm:pb-20 sm:pt-32 lg:px-14 lg:pb-24">
      <HeroRibbon />
      <div className="relative z-10 mx-auto grid max-w-[1180px] items-end gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(240px,0.85fr)] lg:gap-8">
        <HeroCopy />
        <div className="pointer-events-none hidden min-h-[260px] lg:block" aria-hidden="true" />
      </div>
    </section>
  )
}
