import ReputationBadge from '../../ReputationBadge'
import { formatAddress } from '../marketUtils'

export default function ListingCreatorCard({ wallet, creator }) {
  return (
    <div className="flex items-center gap-3 border border-[var(--a-line)] bg-[var(--a-surface)]/55 p-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center border border-[var(--a-line)] bg-[var(--a-inverse-bg)]/6 font-mono text-[10px] font-semibold text-[var(--a-ink)]/52">0x</div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-mono text-[13px] text-[var(--a-ink)]">{creator}</div>
        <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.16em] text-[var(--a-ink)]/36">Creator · {formatAddress(creator)}</div>
      </div>
      <ReputationBadge provider={wallet?.provider} address={creator} />
    </div>
  )
}
