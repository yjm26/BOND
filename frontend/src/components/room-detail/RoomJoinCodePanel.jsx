import { JOIN_CODE_LENGTH, isValidJoinCodeFormat } from '../../utils/contract'

export default function RoomJoinCodePanel({
  joinCode,
  room,
  isCreator,
  isParticipant,
  joinCodeInput,
  setJoinCodeInput,
}) {
  if (joinCode || room.state !== 'Created' || isCreator || isParticipant) return null
  const trimmed = joinCodeInput.trim().toUpperCase()
  const valid = isValidJoinCodeFormat(trimmed)

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">
        Join code required
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={joinCodeInput}
          onChange={(event) => setJoinCodeInput(event.target.value)}
          placeholder={`${JOIN_CODE_LENGTH}-character code`}
          maxLength={JOIN_CODE_LENGTH}
          autoComplete="off"
          spellCheck={false}
          className="h-11 min-w-0 flex-1 border border-[var(--a-line)] bg-[var(--a-panel)] px-3 font-mono text-[13px] uppercase tracking-[0.12em] text-[var(--a-ink)] outline-none placeholder:text-[var(--a-ink)]/24 focus:border-[var(--a-muted)]/60"
        />
        <button
          type="button"
          onClick={() => {
            if (valid) setJoinCodeInput(trimmed)
          }}
          disabled={!valid}
          className="h-11 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] disabled:opacity-40"
        >
          Apply
        </button>
      </div>
      <p className="mt-2 text-[12px] text-[var(--a-muted)]">
        Private invite only. Do not post the code publicly — anyone with it can join while the room is open.
      </p>
    </div>
  )
}
