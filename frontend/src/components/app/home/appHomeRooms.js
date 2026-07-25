import { ROOM_FILTER_MAP } from '../../rooms/roomsConstants'

export const HOME_OPEN_ROOM_LIMIT = 5

export function getOpenRooms(rooms, limit = HOME_OPEN_ROOM_LIMIT) {
  return rooms
    .filter((room) => ROOM_FILTER_MAP.active.includes(room.state))
    .slice(0, limit)
}

/** Concrete next step for the connected wallet — not generic filler. */
export function roomNextStep(room) {
  const isBuyer = room.role === 'Buyer'
  const isSeller = room.role === 'Seller'

  switch (room.state) {
    case 'Created':
      return room.isCreator ? 'Share invite or cancel' : 'Join room'
    case 'Joined':
      return isBuyer ? 'Fund escrow' : 'Waiting for buyer to fund'
    case 'Funded':
      return isSeller ? 'Mark delivered' : 'Waiting for delivery'
    case 'Delivered':
      return isBuyer ? 'Release or dispute' : 'Waiting for buyer'
    case 'Disputed':
      return 'In dispute review'
    default:
      return 'Open room'
  }
}
