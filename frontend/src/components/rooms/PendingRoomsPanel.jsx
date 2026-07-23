import PendingRoomCard from './PendingRoomCard'

export default function PendingRoomsPanel({ pendingRooms, joinError, onJoinRoom }) {
  if (pendingRooms.length === 0) return null
  return (
    <div className="mb-5 border border-[#c98b4a]/18 bg-[#20201f] p-4">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[#c98b4a]">Rooms waiting for you</div>
      {joinError && <div className="mb-3 border border-[#c98b4a]/30 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{joinError}</div>}
      <div className="grid gap-3">
        {pendingRooms.map((roomCode) => <PendingRoomCard key={roomCode.roomId} roomCode={roomCode} onJoinRoom={onJoinRoom} />)}
      </div>
    </div>
  )
}
