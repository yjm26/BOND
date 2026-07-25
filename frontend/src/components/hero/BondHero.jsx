import HeroIntro from './HeroIntro'
import HeroRoomDemo from './HeroRoomDemo'

export default function BondHero() {
  return (
    <section className="relative overflow-hidden bg-[#fafafa] pt-[96px] text-[#0a0a0a] motion-soft-reveal sm:pt-[108px]">
      <div className="relative z-10 mx-auto max-w-[1180px] px-6 pb-16 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24">
        <HeroIntro />
        <div className="mt-12 sm:mt-14 lg:mt-16">
          <HeroRoomDemo />
        </div>
        <p className="mt-8 text-center font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3a3a3]">
          Hover labels · tap to pin
        </p>
      </div>
    </section>
  )
}
