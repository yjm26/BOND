import { formatAddress } from '../../utils/constants'

export default function RoomEvidencePanel({ room, evidence }) {
  if (room.state !== 'Disputed' || !evidence?.length) return null
  return (
    <div className="border border-[#c98b4a]/30 bg-[#20201f] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#c98b4a]">Submitted evidence</div>
      <div className="grid gap-3">
        {evidence.map((ev) => (
          <div key={ev.id} className="border border-[#ede9df]/10 bg-[#111110] p-4">
            <div className="mb-2 flex items-start justify-between gap-3"><span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">{ev.evidenceType}</span><span className="font-mono text-[10px] text-[#ede9df]/38">{formatAddress(ev.submitter)}</span></div>
            {ev.description && <div className="text-[13px] leading-[1.6] text-[#b9b2a5]">{ev.description}</div>}
            {ev.evidenceRef && <div className="mt-2 break-all font-mono text-[11px] text-[#d8b15f]">{ev.evidenceRef.startsWith('http') ? <a href={ev.evidenceRef} target="_blank" rel="noopener noreferrer">{ev.evidenceRef}</a> : ev.evidenceRef}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}
