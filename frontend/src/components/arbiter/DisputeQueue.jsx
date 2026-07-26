import DisputeCard from './DisputeCard'

export default function DisputeQueue({ disputes, selectedId, onSelect, loading, error }) {
  if (loading) {
    return (
      <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--a-muted)]">Loading queue</div>
        <div className="mt-4 space-y-3">
          {[0, 1, 2].map((k) => (
            <div key={k} className="h-16 border border-[var(--a-line)] bg-[var(--a-panel)]">
              <div className="h-full w-full animate-pulse bg-[var(--a-ink)]/[0.04]" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="border border-[#b87333]/35 bg-[#b87333]/10 p-5 text-[13px] text-[#b87333]">
        {error}
      </div>
    )
  }

  if (!disputes.length) {
      return (
        <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">Queue</div>
          <h2 className="mt-4 text-[28px] font-medium leading-none tracking-[-0.06em] text-[var(--a-ink)]">
            No disputed rooms
          </h2>
          <p className="mx-auto mt-3 max-w-[420px] text-[13px] leading-[1.7] text-[var(--a-muted)]">
            Rooms appear after buyer dispute or seller escalate (12h silence). Resolve moves locked USDC on-chain.
          </p>
        </div>
      )
    }

  return (
    <div className="grid gap-3">
      {disputes.map((room) => (
        <DisputeCard
          key={room.id}
          room={room}
          active={room.id === selectedId}
          onClick={() => onSelect(room)}
        />
      ))}
    </div>
  )
}
