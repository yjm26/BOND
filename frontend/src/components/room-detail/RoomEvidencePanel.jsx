import { formatAddress } from '../../utils/constants'

export default function RoomEvidencePanel({ room, evidence }) {
  if (room.state !== 'Disputed' || !evidence?.length) return null
  return (
    <div className="border border-[#b87333]/30 bg-[var(--a-surface,#111111)] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#b87333]">Submitted evidence</div>
      <div className="grid gap-3">
        {evidence.map((ev) => (
          <div key={ev.id} className="border border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] p-4">
            <div className="mb-2 flex items-start justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333]">{ev.evidenceType}</span><span className="font-mono text-[10px] text-[color:var(--a-faint)]">{formatAddress(ev.submitter)}</span></div>
            {ev.description && <div className="text-[13px] leading-[1.6] text-[var(--a-muted,#a3a3a3)]">{ev.description}</div>}
            {ev.evidenceRef && <div className="mt-2 break-all font-mono text-[11px] text-[var(--a-muted,#a3a3a3)]">{ev.evidenceRef.startsWith('http') ? <a href={ev.evidenceRef} target="_blank" rel="noopener noreferrer">{ev.evidenceRef}</a> : ev.evidenceRef}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
