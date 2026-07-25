import RoomListItem from './RoomListItem'
import RoomsEmptyState from './RoomsEmptyState'

export default function RoomList({ rooms, wallet }) {
  if (rooms.length === 0) return <RoomsEmptyState wallet={wallet} />
  return (
    <div className="grid gap-px bg-[var(--a-inverse-bg,#fafafa)]/10 p-px">
      {rooms.map((room) => <RoomListItem key={room.id} room={room} />)}
    </div>
  )
}
