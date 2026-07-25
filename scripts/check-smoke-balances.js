/**
 * Read-only balance check for local smoke wallets.
 * Addresses only (no keys). Prefer: node scripts/smoke-e2e-room.js --addresses
 */
const { ethers } = require('ethers')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const WALLETS = path.join(ROOT, 'local', 'smoke', 'wallets.json')

async function main() {
  let seller = process.env.SMOKE_SELLER
  let buyer = process.env.SMOKE_BUYER
  const rpc = process.env.ARC_RPC_URL || 'https://rpc.blockdaemon.testnet.arc.network'
  const usdc = process.env.USDC_ADDRESS || '0x3600000000000000000000000000000000000000'

  if (fs.existsSync(WALLETS)) {
    const j = JSON.parse(fs.readFileSync(WALLETS, 'utf8'))
    seller = seller || j.seller?.address
    buyer = buyer || j.buyer?.address
  }
  if (!seller || !buyer) {
    console.error('Need local/smoke/wallets.json or SMOKE_SELLER / SMOKE_BUYER env (addresses only)')
    process.exit(1)
  }

  const p = new ethers.JsonRpcProvider(rpc, { chainId: 5042002, name: 'arcTestnet' }, { staticNetwork: true })
  const c = new ethers.Contract(usdc, ['function balanceOf(address) view returns (uint256)'], p)
  const [bs, bb, ns, nb] = await Promise.all([
    c.balanceOf(seller),
    c.balanceOf(buyer),
    p.getBalance(seller),
    p.getBalance(buyer),
  ])
  console.log('SELLER', seller)
  console.log('  erc20', ethers.formatUnits(bs, 6), 'native', ethers.formatEther(ns))
  console.log('BUYER ', buyer)
  console.log('  erc20', ethers.formatUnits(bb, 6), 'native', ethers.formatEther(nb))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
