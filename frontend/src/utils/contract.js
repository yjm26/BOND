import { ethers } from 'ethers';

export const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0xe07a76af62F0aEd25A0688e9e9A905ec3B600F01'; // BOND Phase A on Arc Testnet
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'; // Arc USDC precompile
export const ARC_RPC_URL = import.meta.env.VITE_ARC_RPC_URL || 'https://rpc.blockdaemon.testnet.arc.network'
export const ARC_RPC_URLS = [
  ARC_RPC_URL,
  'https://rpc.drpc.testnet.arc.network',
  'https://rpc.blockdaemon.testnet.arc.network',
].filter((url, index, urls) => urls.indexOf(url) === index)
export const ARC_NETWORK = { chainId: 5042002, name: 'arcTestnet' }
export const ARC_READ_PROVIDER = new ethers.JsonRpcProvider(ARC_RPC_URL, ARC_NETWORK, { staticNetwork: true })
export const ARC_READ_PROVIDERS = ARC_RPC_URLS.map((url) => new ethers.JsonRpcProvider(url, ARC_NETWORK, { staticNetwork: true }))

/// Arc minimum gas params — transactions below 20 Gwei maxFeePerGas stay pending forever
/// See https://docs.arc.io/arc/references/gas-and-fees
export const ARC_GAS = {
  maxFeePerGas: 100000000000n,       // 100 Gwei — well above testnet base-fee spikes
  maxPriorityFeePerGas: 2000000000n, // 2 Gwei tip
  gasLimit: 500000,                  // explicit gas limit — avoids wallet estimation failures
}
export const ARC_GAS_APPROVE = {
  maxFeePerGas: 100000000000n,
  maxPriorityFeePerGas: 2000000000n,
  gasLimit: 200000,
}

/// Poll for tx receipt — aggressive polling for Arc's fast deterministic finality
/// Arc blocks finalize quickly; we poll immediately with short intervals.
/// Uses provider.waitForTransaction when available (event-based, faster than polling).
export async function waitForTx(walletProvider, txHash, timeoutMs = 60000) {
  const rpcProvider = ARC_READ_PROVIDER
  const start = Date.now()

  // Try wallet provider's native waitForTransaction first (event-based, instant)
  if (walletProvider && typeof walletProvider.waitForTransaction === 'function') {
    try {
      const receipt = await walletProvider.waitForTransaction(txHash, 1, timeoutMs)
      if (receipt) return receipt
    } catch { /* fall through to polling */ }
  }

  // Aggressive polling: no initial delay, 300ms intervals
  while (Date.now() - start < timeoutMs) {
    // Check both RPCs in parallel
    const [rpcReceipt, walletReceipt] = await Promise.allSettled([
      rpcProvider.getTransactionReceipt(txHash),
      walletProvider ? walletProvider.getTransactionReceipt(txHash) : Promise.resolve(null),
    ])

    if (rpcReceipt.status === 'fulfilled' && rpcReceipt.value) return rpcReceipt.value
    if (walletReceipt.status === 'fulfilled' && walletReceipt.value) return walletReceipt.value

    await new Promise(r => setTimeout(r, 300))
  }
  throw new Error(`TX ${txHash} not confirmed within ${timeoutMs/1000}s. Check https://testnet.arcscan.app/tx/${txHash}`)
}


// Verify user is on Arc Testnet before sending tx — auto-switch if wrong
export async function ensureArcChain(signerOrProvider) {
  const provider = signerOrProvider.provider || signerOrProvider
  const network = await provider.getNetwork()
  if (network.chainId !== 5042002n) {
    const ethereum = provider.provider || window.ethereum
    if (ethereum?.request) {
      try {
        await ethereum.request({ method: 'wallet_switchEthereumChain', params: [{ chainId: '0x4cef52' }] })
        return
      } catch (switchError) {
        // Chain not added in wallet — try add it
        if (switchError.code === 4902) {
          await ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x4cef52',
              chainName: 'Arc Testnet',
              rpcUrls: ARC_RPC_URLS,
              nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
              blockExplorerUrls: ['https://testnet.arcscan.app'],
            }],
          })
          return
        }
        throw switchError
      }
    }
    throw new Error(`Wrong network (chain ${network.chainId}). Please switch to Arc Testnet in your wallet.`)
  }
}
export const USDC_ABI = [
  "function transfer(address to, uint256 amount) external returns (bool)",
  "function transferFrom(address from, address to, uint256 amount) external returns (bool)",
  "function approve(address spender, uint256 amount) external returns (bool)",
  "function balanceOf(address account) external view returns (uint256)",
  "function allowance(address owner, address spender) external view returns (uint256)",
];

export const CONTRACT_ABI = [
  // Room
  "function createRoom(string _item, uint256 _price, uint256 _collateral, bytes32 _joinCodeHash, bool _creatorIsSeller, uint32 _deliveryDays) external",
  "function joinRoom(uint256 _roomId, bytes _joinCode) external",
  "function leaveRoom(uint256 _roomId) external",
  "function fundRoom(uint256 _roomId) external",
  "function markDelivered(uint256 _roomId, bytes32 _proofHash) external",
  "function releaseFunds(uint256 _roomId) external",
  "function openDispute(uint256 _roomId, string _reason, string _evidenceType, string _evidenceDesc, string _evidenceRef) external",
  "function escalateNoResponse(uint256 _roomId) external",
  "function buyerRefund(uint256 _roomId) external",
  "function arbiterResolve(uint256 _roomId, address _winner) external",
  "function arbiterSplit(uint256 _roomId) external",
  "function cancelRoom(uint256 _roomId) external",
  "function expireRoom(uint256 _roomId) external",
  // Mutual cancel
  "function requestMutualCancel(uint256 _roomId) external",
  "function revokeMutualCancel(uint256 _roomId) external",
  "function executeMutualCancel(uint256 _roomId) external",
  "function getMutualCancelStatus(uint256 _roomId) external view returns (bool creatorApproved, bool counterpartyApproved)",
  "function mutualCancelApproved(uint256, address) external view returns (bool)",
  // Evidence views
  "function getEvidenceCount(uint256 _roomId) external view returns (uint256)",
  "function getEvidence(uint256 _roomId, uint256 _index) external view returns (tuple(address submitter, string evidenceType, string description, string evidenceRef, uint256 timestamp))",
  "function getAllEvidence(uint256 _roomId) external view returns (tuple(address submitter, string evidenceType, string description, string evidenceRef, uint256 timestamp)[])",
  // View
  "function rooms(uint256 _roomId) external view returns (address creator, address counterparty, bool creatorIsSeller, string itemDescription, uint256 priceUSD, uint256 collateralAmount, uint32 createdAt, uint32 joinedAt, uint32 fundedAt, uint32 deliveredAt, uint32 disputedAt, uint32 deliveryDays, uint32 deliveryDeadline, uint32 confirmDeadline, uint8 state, uint256 fundedAmount, uint256 platformFee, bytes32 deliveryProofHash, bytes32 joinCodeHash)",
  "function verifyJoinCode(uint256 _roomId, bytes _joinCode) external view returns (bool)",
  "function roomCount() external view returns (uint256)",
  "function owner() external view returns (address)",
  "function usdc() external view returns (address)",
  "function treasury() external view returns (address)",
  "function arbiter() external view returns (address)",
  "function arbiterName() external view returns (string)",
  "function isArbiter(address) external view returns (bool)",
  "function arbiterDisplayName(address) external view returns (string)",
  "function setArbiter(address _account, string _name) external",
  "function addArbiter(address _account, string _name) external",
  "function removeArbiter(address _account) external",
  "function activeRooms(address) external view returns (uint256)",
  // Constants
  "function FUND_TAX_BPS() external view returns (uint256)",
  "function BPS_DENOM() external view returns (uint256)",
  "function MAX_ACTIVE() external view returns (uint256)",
  "function JOIN_DL() external view returns (uint256)",
  "function FUND_DL() external view returns (uint256)",
  "function MIN_DELIVERY_DAYS() external view returns (uint256)",
  "function MAX_DELIVERY_DAYS() external view returns (uint256)",
  "function ARBITER_FEE_BPS() external view returns (uint256)",
  "function RESPONSE_BUFFER() external view returns (uint256)",
  "function successCount(address) external view returns (uint256)",
  "function disputeCount(address) external view returns (uint256)",
  "function refundedCount(address) external view returns (uint256)",
  "function collateralMultiplier(address _seller) external view returns (uint256)",
  // Events
  "event RoomCreated(uint256 indexed id, address indexed creator, string item, uint256 price, uint256 collateral, bool creatorIsSeller, uint32 deliveryDays)",
  "event RoomJoined(uint256 indexed id, address indexed who)",
  "event RoomLeft(uint256 indexed id, address indexed who)",
  "event RoomFunded(uint256 indexed id, uint256 amount, uint256 fee, uint256 totalPaid)",
  "event RoomDelivered(uint256 indexed id, bytes32 proof)",
  "event RoomReleased(uint256 indexed id, uint256 amount, uint256 collateral)",
  "event RoomDisputed(uint256 indexed id, string reason)",
  "event RoomRefunded(uint256 indexed id, uint256 amount, uint256 collateral)",
  "event RoomExpired(uint256 indexed id)",
  "event RoomCancelled(uint256 indexed id, address indexed by)",
  "event DisputeResolved(uint256 indexed id, address indexed winner, uint256 amount)",
  "event MutualCancelRequested(uint256 indexed id, address indexed by)",
  "event MutualCancelExecuted(uint256 indexed id)",
  "event MutualCancelRevoked(uint256 indexed id, address indexed by)",
  "event ArbiterAdded(address indexed account, string name)",
  "event ArbiterRemoved(address indexed account)",
  "event EscalatedNoResponse(uint256 indexed id, uint32 confirmDeadline)",
];

export function getContract(signerOrProvider) {
  return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signerOrProvider);
}

export async function readContract(method, args = [], fallbackProvider) {
  const providers = [...ARC_READ_PROVIDERS]
  if (fallbackProvider) providers.push(fallbackProvider)
  let lastError

  for (const provider of providers) {
    try {
      const contract = getContract(provider)
      return await contract[method](...args)
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error(`Cannot read contract method ${method}`)
}

export async function readMany(calls, fallbackProvider) {
  const providers = [...ARC_READ_PROVIDERS]
  if (fallbackProvider) providers.push(fallbackProvider)
  let lastError

  for (const provider of providers) {
    try {
      const contract = getContract(provider)
      return await Promise.all(calls.map(({ method, args = [] }) => contract[method](...args)))
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Cannot read contract')
}

export async function getLatestNonce(address, fallbackProvider) {
  const providers = [...ARC_READ_PROVIDERS]
  if (fallbackProvider) providers.push(fallbackProvider)
  let lastError

  for (const provider of providers) {
    try {
      return await provider.getTransactionCount(address, 'latest')
    } catch (error) {
      lastError = error
    }
  }

  throw lastError || new Error('Cannot read wallet nonce')
}

export function getUsdc(signerOrProvider) {
  return new ethers.Contract(USDC_ADDRESS, USDC_ABI, signerOrProvider);
}

// Parse rooms() tuple return into a friendly object
export function parseRoom(raw) {
  return {
    creator: raw[0],
    counterparty: raw[1],
    creatorIsSeller: raw[2],
    itemDescription: raw[3],
    priceUSD: raw[4],
    collateralAmount: raw[5],
    createdAt: raw[6],
    joinedAt: raw[7],
    fundedAt: raw[8],
    deliveredAt: raw[9],
    disputedAt: raw[10],
    deliveryDays: raw[11],
    deliveryDeadline: raw[12],
    confirmDeadline: raw[13],
    state: raw[14],
    fundedAmount: raw[15],
    platformFee: raw[16],
    deliveryProofHash: raw[17],
    joinCodeHash: raw[18],
  }
}

export const STATE_NAMES = ['Created', 'Joined', 'Funded', 'Delivered', 'Released', 'Disputed', 'Refunded', 'Expired', 'Cancelled'];


export const JOIN_CODE_LENGTH = 10

/** Ambiguous-safe alphabet; length JOIN_CODE_LENGTH for invite codes. */
export function generateJoinCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
  let code = ''
  for (let i = 0; i < JOIN_CODE_LENGTH; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

export function isValidJoinCodeFormat(code) {
  if (!code || typeof code !== 'string') return false
  const t = code.trim().toUpperCase()
  if (t.length !== JOIN_CODE_LENGTH) return false
  return /^[A-Z2-9]+$/.test(t)
}

export function hashJoinCode(code) {
  return ethers.solidityPackedKeccak256(['string'], [code])
}

export function createInviteLink(roomId, joinCode) {
  return `${window.location.origin}/room/${roomId}?code=${joinCode}`
}

export function explorerAddressUrl(address = CONTRACT_ADDRESS) {
  return `https://testnet.arcscan.app/address/${address}`
}

/// Override wallet nonce with on-chain nonce to prevent MetaMask/AppKit desync.
/// Some wallet caches stale nonces after dropped txs, causing all future txs to hang.
/// This patches signer.populateTransaction to use RPC's latest nonce + auto-increment.
export async function fixSignerNonce(signer) {
  const addr = await signer.getAddress()
  // Use Arc RPC fallback set — wallet provider may have stale nonce cache
  let nextNonce = await getLatestNonce(addr, signer.provider)
  const originalPopulate = signer.populateTransaction.bind(signer)
  signer.populateTransaction = async (tx) => {
    const populated = await originalPopulate(tx)
    populated.nonce = nextNonce++
    return populated
  }
  return () => { signer.populateTransaction = originalPopulate }
}
