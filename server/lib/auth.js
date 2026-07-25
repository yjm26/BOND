const { ethers } = require('ethers')

const nonces = new Map()
const NONCE_TTL = 5 * 60 * 1000

function getNonce(address) {
  const a = address.toLowerCase()
  const existing = nonces.get(a)
  if (existing && existing.expires > Date.now()) return existing
  const nonce = Math.random().toString(36).slice(2) + Date.now().toString(36)
  const entry = { nonce, expires: Date.now() + NONCE_TTL }
  nonces.set(a, entry)
  return entry
}

/**
 * Verify wallet ownership via signed SIWE-like message.
 * Returns the verified address (lowercase) on success, null on failure.
 */
async function verifySignature({ address, signature, nonce, domain }) {
  try {
    if (!ethers.isAddress(address) || !signature || !nonce) return null

    const stored = nonces.get(address.toLowerCase())
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
    ].filter(Boolean)

    for (const d of [...new Set(domainCandidates)]) {
      const msg = `${d} wants you to sign in with your Ethereum account:\n${address}\n\nNonce: ${nonce}`
      const verified = ethers.verifyMessage(msg, signature)
      if (verified.toLowerCase() === address.toLowerCase()) return address.toLowerCase()
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
  if (!auth.wallet || !auth.signature || !auth.nonce) return { error: 'Wallet authentication required', status: 401 }
  const verified = await verifySignature(auth)
  if (!verified) return { error: 'Invalid signature', status: 401 }
  return { verified }
}

module.exports = { getNonce, verifySignature, parseAuth, requireAuth, NONCE_TTL }
