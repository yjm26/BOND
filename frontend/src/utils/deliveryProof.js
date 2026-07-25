import { ethers } from 'ethers'

/**
 * Non-zero delivery proof hash for markDelivered.
 * If user provides text/url, hash that; otherwise hash a structured placeholder.
 */
export function deliveryProofHash(roomId, proofText) {
  const payload = proofText && String(proofText).trim()
    ? String(proofText).trim()
    : `bond:delivered:${roomId}`
  return ethers.keccak256(ethers.toUtf8Bytes(payload))
}

export function isZeroHash(hash) {
  return !hash || hash === ethers.ZeroHash
}
