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
  Created: 'border-[#d8b15f]/30 text-[#d8b15f]',
  Joined: 'border-[#d8b15f]/30 text-[#d8b15f]',
  Funded: 'border-[#b7c8a3]/30 text-[#b7c8a3]',
  Delivered: 'border-[#b7c8a3]/30 text-[#b7c8a3]',
  Disputed: 'border-[#c98b4a]/40 text-[#c98b4a]',
  Released: 'border-[#b7c8a3]/30 text-[#b7c8a3]',
  Refunded: 'border-[#c98b4a]/35 text-[#c98b4a]',
  Expired: 'border-[#ede9df]/16 text-[#ede9df]/48',
  Cancelled: 'border-[#ede9df]/16 text-[#ede9df]/48',
}
