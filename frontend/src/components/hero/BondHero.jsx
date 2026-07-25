import HeroCopy from './HeroCopy'
import HeroRibbon from './HeroRibbon'

export default function BondHero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#fafafa] text-[#0a0a0a]">
      <HeroRibbon />

      <div className="relative z-10 mx-auto flex min-h-[min(860px,92vh)] max-w-[1240px] items-center px-6 py-28 sm:px-10 sm:py-32 lg:px-14 lg:py-36">
        <div className="w-full max-w-[520px] shrink-0 lg:max-w-[480px] xl:max-w-[520px]">
          <HeroCopy />
        </div>
      </div>
    </section>
  )
}
