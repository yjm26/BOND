import { ethers } from 'ethers'

// Empty fallback keeps API calls same-origin for single-service deploys
// like Render Web Service serving frontend/dist and /api from server.js.
const API_URL = import.meta.env.VITE_API_URL || ''

const AUTH_STORAGE_KEY = 'bond_api_auth_v1'
/** Client session length — must stay ≤ server NONCE_TTL */
const AUTH_TTL_MS = 4 * 60 * 1000

/**
 * Build SIWE-like message matching server's expected format.
 */
function getAuthDomain() {
  if (typeof window !== 'undefined' && window.location?.host) return window.location.host
  return 'bond.arc.network'
}

function buildMessage(domain, address, nonce) {
  return `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nNonce: ${nonce}`
}

function emptyCache() {
  return { address: null, domain: null, nonce: null, signature: null, expires: 0 }
}

/** In-memory + sessionStorage so reloads / multi-tab don't re-spam sign. */
let authCache = emptyCache()

/** Single-flight: parallel authFetch must share ONE signMessage prompt. */
let authInflight = null

function readStoredAuth() {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.sessionStorage.getItem(AUTH_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed?.address || !parsed?.signature || !parsed?.nonce || !parsed?.expires) return null
    if (parsed.expires <= Date.now()) return null
    return parsed
  } catch {
    return null
  }
}

function writeStoredAuth(entry) {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(entry))
  } catch {
    /* ignore quota / private mode */
  }
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(AUTH_STORAGE_KEY)
  } catch {
    /* ignore */
  }
}

function hydrateCacheFromStorage() {
  if (authCache.expires > Date.now() && authCache.signature) return authCache
  const stored = readStoredAuth()
  if (stored) authCache = stored
  return authCache
}

function cacheHeaders(entry) {
  return {
    'X-Wallet-Address': entry.address,
    'X-Signature': entry.signature,
    'X-Nonce': entry.nonce,
    'X-Auth-Domain': entry.domain,
  }
}

/**
 * Reset auth cache on disconnect or wallet switch.
 */
export function resetAuthCache() {
  authCache = emptyCache()
  authInflight = null
  clearStoredAuth()
}

/**
 * Get auth headers — fetches nonce + signs with wallet signer ONCE.
 * Concurrent callers await the same inflight promise (no 13× MetaMask popups).
 */
export async function getAuthHeaders(wallet, { force = false } = {}) {
  if (!wallet?.address || (!wallet?.signer && !wallet?.provider)) {
    throw new Error('Wallet not connected')
  }

  const domain = getAuthDomain()
  const signer = wallet.provider?.getSigner ? await wallet.provider.getSigner() : wallet.signer
  const signerAddress = await signer.getAddress()
  const now = Date.now()

  if (!force) {
    hydrateCacheFromStorage()
    if (
      authCache.address === signerAddress &&
      authCache.domain === domain &&
      authCache.signature &&
      authCache.nonce &&
      authCache.expires > now
    ) {
      return cacheHeaders(authCache)
    }
  }

  // Another caller already prompting — join that flight
  if (authInflight) {
    return authInflight
  }

  authInflight = (async () => {
    try {
      // Re-check after awaiting signer (another flight may have finished)
      const freshNow = Date.now()
      hydrateCacheFromStorage()
      if (
        !force &&
        authCache.address === signerAddress &&
        authCache.domain === domain &&
        authCache.signature &&
        authCache.expires > freshNow
      ) {
        return cacheHeaders(authCache)
      }

      const nonceRes = await fetch(`${API_URL}/api/auth/nonce?address=${encodeURIComponent(signerAddress)}`)
      if (!nonceRes.ok) throw new Error('Failed to get auth nonce')
      const { nonce } = await nonceRes.json()
      if (!nonce) throw new Error('Auth nonce missing')

      const msg = buildMessage(domain, signerAddress, nonce)
      // ONE wallet popup for the whole app session window
      const signature = await signer.signMessage(msg)

      authCache = {
        address: signerAddress,
        domain,
        nonce,
        signature,
        expires: Date.now() + AUTH_TTL_MS,
      }
      writeStoredAuth(authCache)
      return cacheHeaders(authCache)
    } finally {
      authInflight = null
    }
  })()

  return authInflight
}

/**
 * Authenticated fetch — auto-attaches wallet auth headers.
 * Usage: await authFetch('/api/listings', { method: 'POST', body: ... }, wallet)
 */
export async function authFetch(path, options = {}, wallet) {
  const authHeaders = await getAuthHeaders(wallet)

  let res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...options.headers,
    },
  })

  // Retry once if auth failed (e.g., nonce expired) — still single-flight re-sign
  if (res.status === 401 && !options._retry) {
    resetAuthCache()
    const freshHeaders = await getAuthHeaders(wallet, { force: true })
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      _retry: true,
      headers: {
        'Content-Type': 'application/json',
        ...freshHeaders,
        ...options.headers,
      },
    })
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || `API error ${res.status}`)
  }

  if (res.status === 204) return null
  return res.json()
}

/**
 * Simple GET (no auth needed).
 */
export async function apiGet(path) {
  const res = await fetch(`${API_URL}${path}`)
  if (!res.ok) throw new Error(`GET ${path}: ${res.status}`)
  return res.json()
}

/**
 * True if a valid SIWE session already exists for this address (no popup needed).
 * Use before optional background writes so we never surprise-sign on landing.
 */
export function hasCachedApiAuth(address) {
  if (!address) return false
  hydrateCacheFromStorage()
  const now = Date.now()
  return (
    authCache.address?.toLowerCase() === String(address).toLowerCase() &&
    Boolean(authCache.signature) &&
    authCache.expires > now
  )
}

/**
 * Warm auth once — ONLY call from explicit user write flows if needed.
 * Never call on bare wallet connect / landing browse.
 */
export async function ensureApiAuth(wallet) {
  if (!wallet?.address) return null
  return getAuthHeaders(wallet)
}

export { API_URL }
