/**
 * BOND smoke E2E on Arc Testnet — tiny room (default 0.1 USDC).
 *
 * Usage:
 *   1. Fund wallets: node scripts/smoke-e2e-room.js --addresses
 *   2. Run flow:     node scripts/smoke-e2e-room.js
 *
 * Keys: local/smoke/.env (gitignored). Never commit private keys.
 * Contract: Phase A default 0xe07a76af62F0aEd25A0688e9e9A905ec3B600F01
 */
const fs = require('fs')
const path = require('path')
const { ethers } = require('ethers')

const ROOT = path.join(__dirname, '..')
const ENV_CANDIDATES = [
  path.join(ROOT, 'local', 'smoke', '.env'),
  path.join(ROOT, '.env.smoke.local'),
]

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return null
  const out = {}
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return out
}

function loadEnv() {
  for (const file of ENV_CANDIDATES) {
    const parsed = loadEnvFile(file)
    if (parsed && (parsed.SELLER_PK || parsed.BUYER_PK)) {
      console.log('env:', path.relative(ROOT, file))
      return { ...parsed, ...process.env }
    }
  }
  console.error('Missing smoke env. Create local/smoke/.env (see local/smoke/wallets.json)')
  process.exit(1)
}

const env = loadEnv()

const RPC = env.ARC_RPC_URL || 'https://rpc.blockdaemon.testnet.arc.network'
const BOND = env.BOND_CONTRACT || '0xe07a76af62F0aEd25A0688e9e9A905ec3B600F01'
const USDC = env.USDC_ADDRESS || '0x3600000000000000000000000000000000000000'
const PRICE = ethers.parseUnits(env.SMOKE_PRICE_USDC || '0.1', 6)

const ARC_GAS = {
  maxFeePerGas: 100000000000n,
  maxPriorityFeePerGas: 2000000000n,
}

const USDC_ABI = [
  'function balanceOf(address) view returns (uint256)',
  'function approve(address spender, uint256 amount) returns (bool)',
  'function allowance(address owner, address spender) view returns (uint256)',
  'function decimals() view returns (uint8)',
]

const BOND_ABI = [
  'function createRoom(string _item, uint256 _price, uint256 _collateral, bytes32 _joinCodeHash, bool _creatorIsSeller, uint32 _deliveryDays)',
  'function joinRoom(uint256 _roomId, bytes _joinCode)',
  'function fundRoom(uint256 _roomId)',
  'function markDelivered(uint256 _roomId, bytes32 _proofHash)',
  'function releaseFunds(uint256 _roomId)',
  'function fundingFee(uint256 _price) view returns (uint256)',
  'function rooms(uint256) view returns (address creator, address counterparty, bool creatorIsSeller, string itemDescription, uint256 priceUSD, uint256 collateralAmount, uint32 createdAt, uint32 joinedAt, uint32 fundedAt, uint32 deliveredAt, uint32 disputedAt, uint32 deliveryDays, uint32 deliveryDeadline, uint32 confirmDeadline, uint8 state, uint256 fundedAmount, uint256 platformFee, bytes32 deliveryProofHash, bytes32 joinCodeHash)',
  'function roomCount() view returns (uint256)',
  'event RoomCreated(uint256 indexed id, address indexed creator, string item, uint256 price, uint256 collateral, bool creatorIsSeller, uint32 deliveryDeadline)',
]

const STATE = ['Created', 'Joined', 'Funded', 'Delivered', 'Released', 'Disputed', 'Refunded', 'Expired', 'Cancelled']

function mustPk(name) {
  const v = env[name]
  if (!v || !v.startsWith('0x') || v.length < 60) {
    console.error('Missing/invalid', name, 'in .env.smoke.local')
    process.exit(1)
  }
  return v
}

async function waitTx(tx, label) {
  console.log(`  → ${label}: ${tx.hash}`)
  const rc = await tx.wait()
  if (rc.status !== 1) throw new Error(`${label} failed`)
  console.log(`  ✓ ${label}`)
  return rc
}

async function main() {
  const addressesOnly = process.argv.includes('--addresses')

  const sellerWallet = new ethers.Wallet(mustPk('SELLER_PK'))
  const buyerWallet = new ethers.Wallet(mustPk('BUYER_PK'))

  console.log('=== BOND smoke wallets (Arc Testnet) ===')
  console.log('SELLER', sellerWallet.address)
  console.log('BUYER ', buyerWallet.address)
  console.log('Contract', BOND)
  console.log('Price', ethers.formatUnits(PRICE, 6), 'USDC (+ 1% fee on fund)')
  console.log('')

  if (addressesOnly) {
    console.log('Fund BOTH with test USDC (gas + buyer needs price+1%).')
    console.log('Faucet: https://faucet.circle.com')
    console.log('Then: node scripts/smoke-e2e-room.js')
    return
  }

  const provider = new ethers.JsonRpcProvider(RPC, { chainId: 5042002, name: 'arcTestnet' }, { staticNetwork: true })
  const net = await provider.getNetwork()
  if (net.chainId !== 5042002n) throw new Error(`Wrong chain ${net.chainId}`)

  const seller = sellerWallet.connect(provider)
  const buyer = buyerWallet.connect(provider)
  const usdcS = new ethers.Contract(USDC, USDC_ABI, seller)
  const usdcB = new ethers.Contract(USDC, USDC_ABI, buyer)
  const bondS = new ethers.Contract(BOND, BOND_ABI, seller)
  const bondB = new ethers.Contract(BOND, BOND_ABI, buyer)

  const fee = await bondS.fundingFee(PRICE)
  const totalFund = PRICE + fee
  console.log('Fund total (buyer):', ethers.formatUnits(totalFund, 6), 'USDC')

  const [balS, balB, nativeS, nativeB] = await Promise.all([
    usdcS.balanceOf(seller.address),
    usdcB.balanceOf(buyer.address),
    provider.getBalance(seller.address),
    provider.getBalance(buyer.address),
  ])
  console.log('Seller USDC', ethers.formatUnits(balS, 6), '| native', ethers.formatEther(nativeS))
  console.log('Buyer  USDC', ethers.formatUnits(balB, 6), '| native', ethers.formatEther(nativeB))

  if (balB < totalFund) {
    console.error('\nBuyer USDC too low. Need at least', ethers.formatUnits(totalFund, 6), 'USDC (ERC-20 6dp).')
    console.error('Fund', buyer.address, 'then re-run.')
    process.exit(2)
  }
  if (nativeS === 0n || nativeB === 0n) {
    console.error('\nNeed native USDC for gas on both wallets (Arc gas).')
    console.error('If ERC-20 balance > 0 but native 0, still fund via faucet — same asset, dual interface.')
    // On Arc same asset — getBalance might be non-zero if they funded. Continue if getBalance works from USDC
  }

  const joinCode = `S${Date.now().toString(36).slice(-7).toUpperCase()}`
  const joinCodeBytes = ethers.toUtf8Bytes(joinCode)
  const joinCodeHash = ethers.keccak256(joinCodeBytes)
  console.log('\n1) createRoom (seller) joinCode=', joinCode)

  const createTx = await bondS.createRoom(
    'smoke-e2e-0.1',
    PRICE,
    0n,
    joinCodeHash,
    true, // creator is seller
    3, // delivery days
    { ...ARC_GAS, gasLimit: 500000n },
  )
  const createRc = await waitTx(createTx, 'createRoom')
  let roomId = null
  for (const log of createRc.logs) {
    try {
      const parsed = bondS.interface.parseLog(log)
      if (parsed?.name === 'RoomCreated') {
        roomId = parsed.args.id
        break
      }
    } catch {
      /* skip */
    }
  }
  if (roomId == null) {
    roomId = await bondS.roomCount()
  }
  console.log('  roomId', roomId.toString())

  console.log('\n2) joinRoom (buyer)')
  await waitTx(
    await bondB.joinRoom(roomId, joinCodeBytes, { ...ARC_GAS, gasLimit: 300000n }),
    'joinRoom',
  )

  console.log('\n3) approve + fundRoom (buyer)')
  const allowance = await usdcB.allowance(buyer.address, BOND)
  if (allowance < totalFund) {
    await waitTx(
      await usdcB.approve(BOND, totalFund, { ...ARC_GAS, gasLimit: 100000n }),
      'approve USDC',
    )
  }
  await waitTx(await bondB.fundRoom(roomId, { ...ARC_GAS, gasLimit: 400000n }), 'fundRoom')

  console.log('\n4) markDelivered (seller)')
  const proof = ethers.id(`smoke:${roomId}:${Date.now()}`)
  await waitTx(
    await bondS.markDelivered(roomId, proof, { ...ARC_GAS, gasLimit: 200000n }),
    'markDelivered',
  )

  console.log('\n5) releaseFunds (buyer)')
  await waitTx(await bondB.releaseFunds(roomId, { ...ARC_GAS, gasLimit: 400000n }), 'releaseFunds')

  const room = await bondS.rooms(roomId)
  const stateNum = Number(room.state)
  const state = STATE[stateNum] || String(stateNum)
  console.log('\n=== DONE ===')
  console.log('room', roomId.toString(), 'state', state, 'fundedAt', room.fundedAt?.toString?.() || room.fundedAt)
  console.log('deliveryDeadline', room.deliveryDeadline?.toString?.() || room.deliveryDeadline)
  console.log('explorer', `https://testnet.arcscan.app/address/${BOND}`)
  if (state !== 'Released') {
    console.error('Expected Released, got', state)
    process.exit(3)
  }
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
