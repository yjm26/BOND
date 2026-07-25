export const ROOM_FILTERS = [
  { key: 'active', label: 'Active' },
  { key: 'completed', label: 'Completed' },
  { key: 'closed', label: 'Closed' },
]

export const ROOM_FILTER_MAP = {
  active: ['Created', 'Joined', 'Funded', 'Delivered', 'Disputed'],
  completed: ['Released'],
  closed: ['Refunded', 'Expired', 'Cancelled'],
}

export const ROOM_STATE_TONE = {
  Created: 'border-[var(--a-muted)]/30 text-[var(--a-muted)]',
  Joined: 'border-[var(--a-muted)]/30 text-[var(--a-muted)]',
  Funded: 'border-[#8f9a88]/30 text-[#8f9a88]',
  Delivered: 'border-[#8f9a88]/30 text-[#8f9a88]',
  Disputed: 'border-[#b87333]/40 text-[#b87333]',
  Released: 'border-[#8f9a88]/30 text-[#8f9a88]',
  Refunded: 'border-[#b87333]/35 text-[#b87333]',
  Expired: 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48',
  Cancelled: 'border-[var(--a-line-strong)] text-[var(--a-ink)]/48',
}
