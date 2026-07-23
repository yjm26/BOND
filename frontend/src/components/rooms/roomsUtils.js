import { ROOM_FILTER_MAP } from './roomsConstants'

export function filterRoomsByState(rooms, filter) {
  return rooms.filter((room) => ROOM_FILTER_MAP[filter]?.includes(room.state))
}

export function roomOutcomeLabel(state) {
  if (state === 'Released') return 'Success'
  if (state === 'Refunded') return 'Refunded'
  if (state === 'Expired' || state === 'Cancelled') return 'Closed'
  if (state === 'Disputed') return 'In dispute'
  return 'Open'
}
