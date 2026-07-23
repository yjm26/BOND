export default function RoomJoinCodePanel({ joinCode, room, isCreator, isParticipant, joinCodeInput, setJoinCodeInput }) {
  if (joinCode || room.state !== 'Created' || isCreator || isParticipant) return null
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Join code required</div>
      <div className="flex gap-2">
        <input type="text" value={joinCodeInput} onChange={(event) => setJoinCodeInput(event.target.value)} placeholder="8-character code" maxLength={8} className="h-11 min-w-0 flex-1 border border-[#ede9df]/12 bg-[#111110] px-3 font-mono text-[13px] uppercase tracking-[0.12em] text-[#ede9df] outline-none placeholder:text-[#ede9df]/24 focus:border-[#d8b15f]/60" />
        <button onClick={() => { const trimmed = joinCodeInput.trim().toUpperCase(); if (trimmed.length === 8) setJoinCodeInput(trimmed) }} disabled={joinCodeInput.trim().length !== 8} className="h-11 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] disabled:opacity-40">Apply</button>
      </div>
      <p className="mt-2 text-[12px] text-[#b9b2a5]">Ask the room creator for the invite link or join code.</p>
    </div>
  )
}
