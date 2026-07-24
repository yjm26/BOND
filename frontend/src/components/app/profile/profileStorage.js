import { apiGet, authFetch } from '../../../lib/api'

export const profileKey = (address) => `bond_profile_${address.toLowerCase()}`

export function emptyProfile() {
  return {
    displayName: '',
    xProfile: '',
    discord: '',
    createdAt: new Date().toISOString(),
  }
}

export function loadProfile(address) {
  if (!address || typeof window === 'undefined') return null
  const stored = window.localStorage.getItem(profileKey(address))
  if (!stored) return null
  try {
    return JSON.parse(stored)
  } catch {
    return null
  }
}

export function saveProfile(address, profile, wallet) {
  if (!address || typeof window === 'undefined') return
  window.localStorage.setItem(profileKey(address), JSON.stringify(profile))
  if (wallet) {
    publishProfile(profile, wallet).catch((err) => console.warn('Profile publish failed:', err.message))
  }
}

export async function publishProfile(profile, wallet) {
  if (!wallet?.address) return null
  return authFetch('/api/profiles', {
    method: 'POST',
    body: JSON.stringify({
      displayName: profile.displayName || '',
      xProfile: profile.xProfile || '',
      discord: profile.discord || '',
    }),
  }, wallet)
}

export async function fetchPublicProfile(address) {
  if (!address) return null
  const profile = await apiGet(`/api/profiles/${address}`)
  return profile?.displayName ? profile : null
}
