import ReputationBadge from '../../ReputationBadge'

export default function ListingCreatorCard({ wallet, creator }) {
  return (
    <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-100 dark:border-white/5">
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">0x</div>
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-mono text-zinc-900 dark:text-white truncate">{creator}</div>
        <div className="text-[11px] text-zinc-400">Creator</div>
      </div>
      <ReputationBadge provider={wallet?.provider} address={creator} />
    </div>
  )
}
