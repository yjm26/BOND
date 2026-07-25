import { authFetch } from './api'

export async function fetchMyRoomIds(wallet) {
  const data = await authFetch('/api/room-index', { method: 'GET' }, wallet)
  return Array.isArray(data?.roomIds) ? data.roomIds.map(Number) : []
}

export async function trackRoomId(wallet, roomId) {
  return authFetch(
    '/api/room-index',
    {
      method: 'POST',
      body: JSON.stringify({ roomId: Number(roomId) }),
    },
    wallet,
  )
}

export async function backfillRoomIds(wallet, roomIds) {
  return authFetch(
    '/api/room-index/backfill',
    {
      method: 'POST',
      body: JSON.stringify({ roomIds: roomIds.map(Number) }),
    },
    wallet,
  )
}
