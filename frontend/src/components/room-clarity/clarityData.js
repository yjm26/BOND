export const ROOM_CLARITY_ITEMS = [
  {
    label: 'Buyer',
    value: 'Who funds',
    body: 'The wallet expected to lock USDC into the room before work or delivery starts.',
  },
  {
    label: 'Seller',
    value: 'Who delivers',
    body: 'The counterparty responsible for sending the item, service, or delivery proof.',
  },
  {
    label: 'Amount',
    value: 'Locked USDC',
    body: 'The exact value held in escrow, visible before any settlement action is taken.',
  },
  {
    label: 'Proof',
    value: 'Delivery evidence',
    body: 'Links, notes, screenshots, or hashes that show what was delivered and when.',
  },
  {
    label: 'Deadline',
    value: 'Resolution window',
    body: 'The time boundary for delivery, confirmation, refund, or escalation.',
  },
  {
    label: 'Fallback',
    value: 'Refund / dispute',
    body: 'The path funds take if either side disappears or disagrees with the result.',
  },
]
