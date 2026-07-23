import HeroCopy from './HeroCopy'
import SettlementCanvas from './SettlementCanvas'

export default function BondHero({ wallet, onConnect }) {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#ede9df] pt-[72px] text-[#0d0d0b]">
      <div className="absolute left-0 top-[72px] z-10 hidden h-[calc(100%-72px)] w-px bg-[#0d0d0b]/10 lg:block" />
      <div className="absolute bottom-0 left-0 z-10 hidden h-px w-[52%] bg-[#0d0d0b]/10 lg:block" />
      <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-[52%_48%]">
        <HeroCopy wallet={wallet} onConnect={onConnect} />
        <SettlementCanvas />
      </div>
    </section>
  )
}
