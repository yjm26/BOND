import HeroCopy from './HeroCopy'
import HeroSettlementArtifact from './HeroSettlementArtifact'

export default function BondHero({ wallet, onConnect }) {
  return (
    <section className="relative min-h-[720px] overflow-hidden bg-[#ede9df] pt-[72px] text-[#0d0d0b] motion-soft-reveal lg:min-h-screen">
      <div className="absolute inset-0 opacity-[0.32] [background-image:linear-gradient(rgba(13,13,11,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(13,13,11,0.08)_1px,transparent_1px)] [background-size:44px_44px]" />
      <div className="absolute right-[-12rem] top-[18%] h-[28rem] w-[28rem] rounded-full bg-[#d8b15f]/18 blur-[120px]" />
      <div className="absolute bottom-[-14rem] left-[18%] h-[30rem] w-[30rem] rounded-full bg-[#b7c8a3]/16 blur-[140px]" />
      <div className="absolute left-0 top-[72px] z-10 hidden h-[calc(100%-72px)] w-px bg-[#0d0d0b]/10 lg:block" />
      <div className="absolute bottom-0 left-0 z-10 hidden h-px w-full bg-[#0d0d0b]/10 lg:block" />

      <div className="relative z-10 grid min-h-[648px] items-stretch lg:min-h-[calc(100vh-72px)] lg:grid-cols-[58%_42%] xl:grid-cols-[56%_44%]">
        <HeroCopy wallet={wallet} onConnect={onConnect} />
        <HeroSettlementArtifact />
      </div>
    </section>
  )
}
