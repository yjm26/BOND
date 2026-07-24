import { ethers } from 'ethers'

// Empty fallback keeps API calls same-origin for single-service deploys
// like Render Web Service serving frontend/dist and /api from server.js.
const API_URL = import.meta.env.VITE_API_URL || ''

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

/**
 * Auth cache to avoid re-signing on every request.
 * Nonces expire after 5 min on server, cache for 4 min.
 */
let authCache = { address: null, domain: null, nonce: null, signature: null, expires: 0 }

/**
 * Reset auth cache on disconnect or wallet switch.
 */
export function resetAuthCache() {
  authCache = { address: null, domain: null, nonce: null, signature: null, expires: 0 }
}

/**
 * Get auth headers — fetches nonce + signs with wallet signer.
 * Caches result for 4 minutes to avoid repeated signing prompts.
 */
export async function getAuthHeaders(wallet) {
  if (!wallet?.address || (!wallet?.signer && !wallet?.provider)) throw new Error('Wallet not connected')

  const now = Date.now()
  const domain = getAuthDomain()

  const signer = wallet.provider?.getSigner ? await wallet.provider.getSigner() : wallet.signer
  const signerAddress = await signer.getAddress()

  if (authCache.address === signerAddress && authCache.domain === domain && authCache.expires > now) {
    return {
      'X-Wallet-Address': signerAddress,
      'X-Signature': authCache.signature,
      'X-Nonce': authCache.nonce,
      'X-Auth-Domain': domain,
    }
  }

  // Fetch fresh nonce
  const nonceRes = await fetch(`${API_URL}/api/auth/nonce?address=${signerAddress}`)
  if (!nonceRes.ok) throw new Error('Failed to get auth nonce')
  const { nonce } = await nonceRes.json()

  // Sign with wallet
  const msg = buildMessage(domain, signerAddress, nonce)
  const signature = await signer.signMessage(msg)

  authCache = { address: signerAddress, domain, nonce, signature, expires: now + 4 * 60 * 1000 }

  return {
    'X-Wallet-Address': signerAddress,
    'X-Signature': signature,
    'X-Nonce': nonce,
    'X-Auth-Domain': domain,
  }
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

  // Retry once if auth failed (e.g., nonce expired)
  if (res.status === 401 && !options._retry) {
    resetAuthCache()
    const freshHeaders = await getAuthHeaders(wallet)
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

export { API_URL }
