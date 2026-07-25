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
  Created: 'border-[#a3a3a3]/30 text-[#a3a3a3]',
  Joined: 'border-[#a3a3a3]/30 text-[#a3a3a3]',
  Funded: 'border-[#8f9a88]/30 text-[#8f9a88]',
  Delivered: 'border-[#8f9a88]/30 text-[#8f9a88]',
  Disputed: 'border-[#b87333]/40 text-[#b87333]',
  Released: 'border-[#8f9a88]/30 text-[#8f9a88]',
  Refunded: 'border-[#b87333]/35 text-[#b87333]',
  Expired: 'border-[#fafafa]/16 text-[#fafafa]/48',
  Cancelled: 'border-[#fafafa]/16 text-[#fafafa]/48',
}
