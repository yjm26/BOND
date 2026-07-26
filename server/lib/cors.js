const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:4100',
  'https://bond-4us7.onrender.com',
  'https://arc-escrow-agent.onrender.com',
  'https://bond.yjm26.xyz',
  'https://usebond.xyz',
  'https://www.usebond.xyz',
]

function corsHeaders(origin) {
  const o = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': o,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-Wallet-Address, X-Signature, X-Nonce, X-Auth-Domain',
    Vary: 'Origin',
  }
}

module.exports = { ALLOWED_ORIGINS, corsHeaders }
