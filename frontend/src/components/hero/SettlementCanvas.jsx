import SettlementConditionCard from './SettlementConditionCard'
import SettlementNode from './SettlementNode'
import SettlementPaths from './SettlementPaths'
import { SETTLEMENT_NODES } from './heroData'

export default function SettlementCanvas() {
  return (
    <div className="relative min-h-[620px] overflow-hidden bg-[#20201f] text-[#ede9df] lg:min-h-auto">
      <div className="absolute inset-0 opacity-[0.24] [background-image:linear-gradient(rgba(237,233,223,0.16)_1px,transparent_1px),linear-gradient(90deg,rgba(237,233,223,0.16)_1px,transparent_1px)] [background-size:54px_54px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_32%,rgba(237,233,223,0.12),transparent_24rem),radial-gradient(circle_at_74%_64%,rgba(216,177,95,0.16),transparent_24rem)]" />
      <SettlementPaths />

      <div className="relative z-10 flex h-full min-h-[620px] flex-col justify-between p-6 sm:p-8 lg:p-10">
        <div className="flex items-center justify-between border-b border-[#ede9df]/15 pb-4 font-mono text-[11px] uppercase tracking-[0.18em] text-[#ede9df]/55">
          <span>Settlement canvas</span>
          <span>Live room</span>
        </div>

        <div className="relative min-h-[430px] flex-1">
          {SETTLEMENT_NODES.map((node) => (
            <SettlementNode key={node.id} node={node} />
          ))}
          <SettlementConditionCard />
        </div>

        <div className="flex items-center justify-between border-t border-[#ede9df]/15 pt-4">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#ede9df]/55">Create → Fund → Prove → Settle</div>
          <div className="flex items-center gap-2">
            <button className="h-9 w-9 border border-[#ede9df]/20 font-mono text-[#ede9df]/70 transition hover:border-[#ede9df]/60">+</button>
            <button className="h-9 w-9 border border-[#ede9df]/20 font-mono text-[#ede9df]/70 transition hover:border-[#ede9df]/60">−</button>
            <button className="h-9 border border-[#ede9df]/20 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/70 transition hover:border-[#ede9df]/60">Explain</button>
          </div>
        </div>
      </div>
    </div>
  )
}
