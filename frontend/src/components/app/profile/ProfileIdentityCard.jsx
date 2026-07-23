import { formatAddress } from '../../../utils/constants'

export default function ProfileIdentityCard({ wallet, profile }) {
  const rows = [
    ['Wallet', formatAddress(wallet.address)],
    ['Display name', profile.displayName || 'Not set'],
    ['X profile', profile.xProfile || 'Not connected'],
    ['Discord', profile.discord || 'Not connected'],
  ]

  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/40">Identity snapshot</div>
      <div className="grid gap-px bg-[#ede9df]/10 p-px">
        {rows.map(([label, value]) => (
          <div key={label} className="grid gap-2 bg-[#111110] p-4 sm:grid-cols-[150px_1fr] sm:items-center">
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/34">{label}</div>
            <div className="break-all text-[14px] text-[#ede9df]">{value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
