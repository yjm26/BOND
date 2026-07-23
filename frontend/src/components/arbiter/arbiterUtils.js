import { ethers } from 'ethers'
import { STATE_NAMES } from '../../utils/contract'

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'
export const DISPUTED_STATE = STATE_NAMES.indexOf('Disputed')

export function formatUsdc(value) {
  try {
    const raw = typeof value === 'bigint' ? value : BigInt(value || 0)
    const formatted = ethers.formatUnits(raw, 6)
    return formatted.replace(/\.0+$/, '').replace(/(\.\d*?)0+$/, '$1')
  } catch {
    return '0'
  }
}

export function formatTimestamp(seconds) {
  if (!seconds) return '—'
  const date = new Date(Number(seconds) * 1000)
  return date.toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export function formatHash(hash) {
  if (!hash || hash === ethers.ZeroHash) return 'No proof hash'
  return `${hash.slice(0, 10)}…${hash.slice(-8)}`
}

export function normalizeEvidence(item) {
  return {
    submitter: item.submitter,
    evidenceType: item.evidenceType,
    description: item.description,
    evidenceRef: item.evidenceRef,
    timestamp: Number(item.timestamp || 0),
  }
}

export function shapeRoom(id, data, evidence = []) {
  const creatorIsSeller = Boolean(data.creatorIsSeller)
  const seller = creatorIsSeller ? data.creator : data.counterparty
  const buyer = creatorIsSeller ? data.counterparty : data.creator
  return {
    id,
    creator: data.creator,
    counterparty: data.counterparty,
    creatorIsSeller,
    seller,
    buyer,
    itemDescription: data.itemDescription,
    priceUSD: data.priceUSD,
    collateralAmount: data.collateralAmount,
    createdAt: Number(data.createdAt),
    joinedAt: Number(data.joinedAt),
    deliveredAt: Number(data.deliveredAt),
    disputedAt: Number(data.disputedAt),
    deliveryDeadline: Number(data.deliveryDeadline),
    confirmDeadline: Number(data.confirmDeadline),
    state: STATE_NAMES[Number(data.state)] || 'Unknown',
    stateId: Number(data.state),
    fundedAmount: data.fundedAmount,
    platformFee: data.platformFee,
    deliveryProofHash: data.deliveryProofHash,
    evidence,
  }
}
