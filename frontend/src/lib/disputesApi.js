import { apiGet, authFetch } from './api'

export async function fetchOpenDisputes() {
  return apiGet('/api/disputes?status=open')
}

export async function fetchDispute(roomId) {
  return apiGet(`/api/disputes/${roomId}`)
}

export async function registerDispute(wallet, payload) {
  return authFetch(
    '/api/disputes',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    wallet,
  )
}

export async function resolveDisputeRecord(wallet, roomId, resolution = 'on-chain') {
  return authFetch(
    `/api/disputes/${roomId}/resolve`,
    {
      method: 'POST',
      body: JSON.stringify({ resolution }),
    },
    wallet,
  )
}
