import { ethers } from 'ethers'
import { CONTRACT_ADDRESS, CONTRACT_ABI, ARC_RPC_URL } from '../utils/contract'

/**
 * Silent session attach — no chain-switch popups.
 * Chain enforcement happens on the first signed tx via ensureArcChain.
 * Calling wallet_switchEthereumChain here hangs multi-tab / background restores.
 */
export async function reconnectWallet(reownProvider) {
  const ethereum = reownProvider || (typeof window !== 'undefined' ? window.ethereum : null)
  if (!ethereum) throw new Error('No wallet detected')

  const provider = new ethers.BrowserProvider(ethereum)
  const accounts = await provider.send('eth_accounts', [])
  if (!accounts.length) {
    // Some multi-tab restores need a soft request; avoid if already denied
    const requested = await provider.send('eth_requestAccounts', []).catch(() => [])
    if (!requested?.length) throw new Error('No connected account')
  }

  const signer = await provider.getSigner()
  const address = await signer.getAddress()
  let balance = 0n
  try {
    balance = await provider.getBalance(address)
  } catch {
    /* rpc lag — non-fatal for session */
  }
  const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  return { provider, signer, address, balance, contract }
}

export function formatAddress(addr) {
  if (!addr) return ''
  return addr.slice(0, 6) + '…' + addr.slice(-4)
}

export { ARC_RPC_URL }
