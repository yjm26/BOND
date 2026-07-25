import { getCollateralBadge, getReputationBadge } from '../../utils/reputation'
import { formatAddress } from '../../utils/constants'

function partyName(profile, isYou) {
  if (profile?.displayName?.trim()) return profile.displayName.trim()
  return isYou ? 'You' : 'Unknown user'
}

function partyInitial(name, address) {
  if (name && name !== 'Unknown user') return name.slice(0, 1).toUpperCase()
  return address ? address.slice(2, 4).toUpperCase() : '—'
}

export default function PartyCard({ label, address, role, isYou, reputation, profile }) {
  const badge = reputation ? getReputationBadge(reputation) : null
  const collBadge = reputation ? getCollateralBadge(reputation.multiplier) : null
  const name = partyName(profile, isYou)
  const initial = partyInitial(name, address)
  return (
    <div className="border border-[#fafafa]/10 bg-[#0a0a0a] p-4">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/34">{label}</span>
          {isYou && <span className="border border-[#a3a3a3]/28 bg-[#a3a3a3]/[0.07] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#a3a3a3]">You</span>}
        </div>
        <span className="text-[12px] text-[#a3a3a3]">{role}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="grid h-10 w-10 shrink-0 place-items-center border border-[#a3a3a3]/24 bg-[#a3a3a3]/[0.06] font-mono text-[12px] uppercase tracking-[0.12em] text-[#a3a3a3]">{initial}</div>
        <div className="min-w-0">
          <div className="truncate text-[15px] font-medium text-[#fafafa]">{name}</div>
          <div className="mt-1 font-mono text-[11px] text-[#fafafa]/42">{formatAddress(address)}</div>
        </div>
      </div>
      {reputation && reputation.totalDeals > 0 ? (
        <div className="mt-4 grid gap-3">
          <div className="flex flex-wrap gap-2">
            {badge && <span className="border border-[#fafafa]/12 px-2 py-1 text-[11px] text-[#fafafa]/70">{badge.label}</span>}
            {collBadge && <span className="border border-[#a3a3a3]/22 px-2 py-1 text-[11px] text-[#a3a3a3]">Collateral {collBadge.label}</span>}
          </div>
          <div className="grid grid-cols-4 gap-px bg-[#fafafa]/10 p-px text-center">
            {[
              ['Deals', reputation.totalDeals],
              ['Success', reputation.success],
              ['Dispute', reputation.dispute],
              ['Rate', `${reputation.successRate}%`],
            ].map(([k, v]) => <div key={k} className="bg-[#111111] p-2"><div className="text-[13px] text-[#fafafa]">{v}</div><div className="mt-1 font-mono text-[9px] uppercase tracking-[0.12em] text-[#fafafa]/34">{k}</div></div>)}
          </div>
        </div>
      ) : <div className="mt-3 text-[12px] text-[#fafafa]/36">No reputation history yet</div>}
    </div>
  )
}
