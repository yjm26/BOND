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

export function saveProfile(address, profile) {
  if (!address || typeof window === 'undefined') return
  window.localStorage.setItem(profileKey(address), JSON.stringify(profile))
}
