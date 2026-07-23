import { formatUsdc } from './arbiterUtils'

export default function ArbiterStats({ disputes }) {
  const locked = disputes.reduce((sum, room) => sum + (room.fundedAmount || 0n) + (room.collateralAmount || 0n), 0n)
  const withEvidence = disputes.filter((room) => room.evidence?.length > 0).length
  const stale = disputes.filter((room) => room.disputedAt && Date.now() / 1000 - room.disputedAt > 24 * 60 * 60).length
  const stats = [
    ['Open disputes', String(disputes.length), 'Rooms frozen on-chain'],
    ['Locked value', `${formatUsdc(locked)} USDC`, 'Escrow + collateral'],
    ['With evidence', String(withEvidence), 'Proof attached'],
    ['Older than 24h', String(stale), 'Needs attention'],
  ]
  return (
    <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {stats.map(([label, value, note]) => (
        <div key={label} className="border border-[#ede9df]/10 bg-[#20201f] p-4">
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/34">{label}</div>
          <div className="mt-3 font-mono text-[26px] leading-none tracking-[-0.04em] text-[#ede9df]">{value}</div>
          <div className="mt-2 text-[12px] text-[#b9b2a5]">{note}</div>
        </div>
      ))}
    </div>
  )
}
