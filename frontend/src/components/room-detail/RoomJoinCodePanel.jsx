export default function RoomJoinCodePanel({ joinCode, room, isCreator, isParticipant, joinCodeInput, setJoinCodeInput }) {
  if (joinCode || room.state !== 'Created' || isCreator || isParticipant) return null
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Join code required</div>
      <div className="flex gap-2">
        <input type="text" value={joinCodeInput} onChange={(event) => setJoinCodeInput(event.target.value)} placeholder="8-character code" maxLength={8} className="h-11 min-w-0 flex-1 border border-[#fafafa]/12 bg-[#0a0a0a] px-3 font-mono text-[13px] uppercase tracking-[0.12em] text-[#fafafa] outline-none placeholder:text-[#fafafa]/24 focus:border-[#a3a3a3]/60" />
        <button onClick={() => { const trimmed = joinCodeInput.trim().toUpperCase(); if (trimmed.length === 8) setJoinCodeInput(trimmed) }} disabled={joinCodeInput.trim().length !== 8} className="h-11 border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] disabled:opacity-40">Apply</button>
      </div>
      <p className="mt-2 text-[12px] text-[#a3a3a3]">Ask the room creator for the invite link or join code.</p>
    </div>
  )
}
