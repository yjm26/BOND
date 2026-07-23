import { getCollateralBadge, getReputationBadge } from '../../utils/reputation'
import { formatAddress } from '../../utils/constants'

export default function PartyCard({ label, address, role, isYou, reputation }) {
  const badge = reputation ? getReputationBadge(reputation) : null
  const collBadge = reputation ? getCollateralBadge(reputation.multiplier) : null
  return (
    <div className="border border-[#ede9df]/10 bg-[#111110] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/34">{label}</span>
          {isYou && <span className="border border-[#d8b15f]/28 bg-[#d8b15f]/[0.07] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#d8b15f]">You</span>}
        </div>
        <span className="text-[12px] text-[#b9b2a5]">{role}</span>
      </div>
      <div className="break-all font-mono text-[14px] text-[#ede9df]">{formatAddress(address)}</div>
      {reputation && reputation.totalDeals > 0 ? (
        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            {badge && <span className="border border-[#ede9df]/12 px-2 py-1 text-[11px] text-[#ede9df]/70">{badge.label}</span>}
            {collBadge && <span className="border border-[#d8b15f]/22 px-2 py-1 text-[11px] text-[#d8b15f]">Collateral {collBadge.label}</span>}
          </div>
          <div className="grid grid-cols-4 gap-px bg-[#ede9df]/10 p-px text-center">
            {[
              ['Deals', reputation.totalDeals],
              ['Success', reputation.success],
              ['Dispute', reputation.dispute],
              ['Rate', `${reputation.successRate}%`],
            ].map(([k, v]) => <div key={k} className="bg-[#20201f] p-2"><div className="text-[13px] text-[#ede9df]">{v}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#ede9df]/34">{k}</div></div>)}
          </div>
        </div>
      ) : <div className="mt-3 text-[12px] text-[#ede9df]/36">No reputation history yet</div>}
    </div>
  )
}
