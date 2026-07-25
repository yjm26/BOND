const { ethers } = require('ethers')

const nonces = new Map()
/** Keep aligned with frontend AUTH_TTL (~4m use) — allow reuse of same signed nonce. */
const NONCE_TTL = 30 * 60 * 1000 // 30 minutes

function getNonce(address) {
  const a = String(address).toLowerCase()
  const existing = nonces.get(a)
  // Reuse active nonce so parallel /api/auth/nonce callers get the same challenge
  if (existing && existing.expires > Date.now()) return existing
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36)
  const entry = { nonce, expires: Date.now() + NONCE_TTL }
  nonces.set(a, entry)
  return entry
}

/**
 * Verify wallet ownership via signed SIWE-like message.
 * Returns the verified address (lowercase) on success, null on failure.
 *
 * Important: does NOT burn the nonce on success — same signature may authenticate
 * many API calls until NONCE_TTL elapses (stops 13× MetaMask popups).
 */
async function verifySignature({ address, signature, nonce, domain }) {
  try {
    if (!ethers.isAddress(address) || !signature || !nonce) return null

    const a = address.toLowerCase()
    const stored = nonces.get(a)
    if (!stored || stored.expires <= Date.now() || stored.nonce !== nonce) return null

    const domainCandidates = [
      domain,
      'bond-4us7.onrender.com',
      'arc-escrow-agent.onrender.com',
      'bond.yjm26.xyz',
      'bond.arc.network',
      'localhost:5173',
      'localhost:4100',
      'localhost:3001',
      'localhost:3000',
    ].filter(Boolean)

    for (const d of [...new Set(domainCandidates)]) {
      const msg = `${d} wants you to sign in with your Ethereum account:\n${address}\n\nNonce: ${nonce}`
      const verified = ethers.verifyMessage(msg, signature)
      if (verified.toLowerCase() === a) return a
    }

    return null
  } catch {
    return null
  }
}

function parseAuth(req) {
  const address = req.headers['x-wallet-address'] || ''
  return {
    address,
    wallet: address,
    signature: req.headers['x-signature'] || '',
    nonce: req.headers['x-nonce'] || '',
    domain: req.headers['x-auth-domain'] || '',
  }
}

async function requireAuth(req) {
  const auth = parseAuth(req)
  if (!auth.wallet || !auth.signature || !auth.nonce) {
    return { error: 'Wallet authentication required', status: 401 }
  }
  const verified = await verifySignature(auth)
  if (!verified) return { error: 'Invalid signature', status: 401 }
  return { verified }
}

module.exports = { getNonce, verifySignature, parseAuth, requireAuth, NONCE_TTL }
