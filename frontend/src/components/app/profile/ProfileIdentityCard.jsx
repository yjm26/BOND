import { formatAddress } from '../../../utils/constants'

export default function ProfileIdentityCard({ wallet, profile }) {
  const rows = [
    ['Wallet', formatAddress(wallet.address)],
    ['Display name', profile.displayName || 'Not set'],
    ['X profile', profile.xProfile || 'Not connected'],
    ['Discord', profile.discord || 'Not connected'],
  ]

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5 sm:p-6">
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink)]/40">Identity snapshot</div>
      <div className="grid gap-px bg-[var(--a-inverse-bg)]/10 p-px">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 bg-[var(--a-panel)] p-4 sm:grid-cols-[150px_1fr] sm:items-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">{label}</div>
            <div className="break-all text-[14px] text-[var(--a-ink)]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
