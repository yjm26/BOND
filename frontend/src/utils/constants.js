/** Contract-aligned timers (seconds). Prefer on-chain constants for authority. */
export const TIMERS = {
  joinDeadline: 1 * 24 * 3600, // JOIN_DL = 1 day
  fundDeadline: 30 * 60, // FUND_DL = 30 minutes
  responseBuffer: 12 * 3600, // RESPONSE_BUFFER after delivery
}

export const STATE_BADGE = {
  Created: 'text-[var(--a-ink)] bg-[var(--a-panel)] border-[var(--a-line)]',
  Joined: 'text-[var(--a-ink)] bg-[var(--a-panel)] border-[var(--a-line)]',
  Funded: 'text-[#8f9a88] bg-[var(--a-panel)] border-[#8f9a88]/30',
  Delivered: 'text-[#8f9a88] bg-[var(--a-panel)] border-[#8f9a88]/30',
  Released: 'text-[#8f9a88] bg-[var(--a-panel)] border-[#8f9a88]/30',
  Disputed: 'text-[#b87333] bg-[var(--a-panel)] border-[#b87333]/35',
  Refunded: 'text-[var(--a-muted)] bg-[var(--a-panel)] border-[var(--a-line)]',
  Expired: 'text-[var(--a-muted)] bg-[var(--a-panel)] border-[var(--a-line)]',
  Cancelled: 'text-[var(--a-muted)] bg-[var(--a-panel)] border-[var(--a-line)]',
}

export function formatAddress(addr) {
  if (!addr || addr === '0x0000000000000000000000000000000000000000') return 'Waiting…'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function formatCountdown(seconds) {
  if (seconds <= 0) return null
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  if (m >= 60) {
    const h = Math.floor(m / 60)
    const rm = m % 60
    return `${h}h ${rm}m ${s}s`
  }
  return `${m}m ${s}s`
}
