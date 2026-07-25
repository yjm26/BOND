import DisputeCard from './DisputeCard'

export default function DisputeQueue({ disputes, selectedId, onSelect, loading, error }) {
  if (loading) {
    return <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-6 text-[13px] text-[var(--a-muted)]">Scanning rooms…</div>
  }
  if (error) {
    return <div className="border border-[#b87333]/35 bg-[#b87333]/10 p-5 text-[13px] text-[#b87333]">{error}</div>
  }
  if (!disputes.length) {
    return (
      <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">Queue clear</div>
        <h2 className="mt-4 text-[34px] font-medium leading-none tracking-[-0.06em] text-[var(--a-ink)]">No disputed rooms.</h2>
        <p className="mx-auto mt-3 max-w-[420px] text-[13px] leading-[1.7] text-[var(--a-muted)]">When a buyer disputes or a seller escalates no response, the room will appear here for arbiter review.</p>
      </div>
    )
  }
  return (
    <div className="grid gap-3">
      {disputes.map((room) => <DisputeCard key={room.id} room={room} active={room.id === selectedId} onClick={() => onSelect(room)} />)}
    </div>
  )
}
