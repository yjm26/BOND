import HeroCopy from './HeroCopy'
import HeroNegativeSpace from './HeroNegativeSpace'

export default function BondHero({ wallet, onConnect }) {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#ede9df] pt-[72px] text-[#0d0d0b] motion-soft-reveal lg:min-h-screen">
      <div className="absolute bottom-0 left-0 z-10 hidden h-px w-full bg-[#0d0d0b]/10 lg:block" />

      <div className="relative z-10 grid min-h-[648px] items-stretch lg:min-h-[calc(100vh-72px)] lg:grid-cols-[58%_42%] xl:grid-cols-[56%_44%]">
        <HeroCopy wallet={wallet} onConnect={onConnect} />
        <HeroNegativeSpace />
      </div>
    </section>
  )
}
