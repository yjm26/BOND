import { apiGet, authFetch } from './api'

export async function fetchRoomEvidence(roomId) {
  return apiGet(`/api/evidence/${roomId}`)
}

export async function postEvidence(wallet, { roomId, evidenceType, description, evidenceRef }) {
  return authFetch(
    '/api/evidence',
    {
      method: 'POST',
      body: JSON.stringify({
        roomId,
        evidenceType: evidenceType || 'text',
        description: description || '',
        evidenceRef: evidenceRef || '',
      }),
    },
    wallet,
  )
}
