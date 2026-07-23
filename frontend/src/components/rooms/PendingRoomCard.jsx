export default function PendingRoomCard({ roomCode, onJoinRoom }) {
  return (
    <div className="flex flex-col gap-4 border border-[#c98b4a]/22 bg-[#c98b4a]/8 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center border border-[#c98b4a]/30 bg-[#111110] font-mono text-[11px] font-semibold text-[#c98b4a]">#{roomCode.roomId}</div>
        <div>
          <div className="text-[15px] font-medium text-[#ede9df]">{roomCode.item || `Room #${roomCode.roomId}`}</div>
          <div className="mt-1 text-[12px] text-[#b9b2a5]">{roomCode.price ? `${roomCode.price} USDC · ` : ''}Waiting for you to join</div>
        </div>
      </div>
      <button onClick={() => onJoinRoom(roomCode)} className="h-10 border border-[#c98b4a]/45 px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10">Join room →</button>
    </div>
  )
}
