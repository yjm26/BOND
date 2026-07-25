export default function RoomJoinCodePanel({ joinCode, room, isCreator, isParticipant, joinCodeInput, setJoinCodeInput }) {
  if (joinCode || room.state !== 'Created' || isCreator || isParticipant) return null
  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">Join code required</div>
      <div className="flex gap-2">
        <input type="text" value={joinCodeInput} onChange={(event) => setJoinCodeInput(event.target.value)} placeholder="8-character code" maxLength={8} className="h-11 min-w-0 flex-1 border border-[var(--a-line)] bg-[var(--a-panel)] px-3 font-mono text-[13px] uppercase tracking-[0.12em] text-[var(--a-ink)] outline-none placeholder:text-[var(--a-ink)]/24 focus:border-[var(--a-muted)]/60" />
        <button onClick={() => { const trimmed = joinCodeInput.trim().toUpperCase(); if (trimmed.length === 8) setJoinCodeInput(trimmed) }} disabled={joinCodeInput.trim().length !== 8} className="h-11 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] disabled:opacity-40">Apply</button>
      </div>
      <p className="mt-2 text-[12px] text-[var(--a-muted)]">Ask the room creator for the invite link or join code.</p>
    </div>
  )
}
