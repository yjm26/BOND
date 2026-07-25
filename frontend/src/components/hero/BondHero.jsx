import HeroIntro from './HeroIntro'
import HeroRoomDemo from './HeroRoomDemo'

export default function BondHero() {
  return (
    <section className="relative overflow-x-hidden overflow-y-visible bg-[#fafafa] pt-[88px] text-[#0a0a0a] motion-soft-reveal sm:pt-[108px]">
          <div className="relative z-10 mx-auto max-w-[1180px] px-4 pb-14 sm:px-10 sm:pb-20 lg:px-14 lg:pb-24">
            <HeroIntro />
            <div className="mt-10 sm:mt-14 lg:mt-16">
              <HeroRoomDemo />
            </div>
          </div>
        </section>
  )
}
