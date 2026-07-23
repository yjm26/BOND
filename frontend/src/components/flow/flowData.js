export const FLOW_STEPS = [
  {
    num: '001',
    label: 'Create room',
    title: 'Terms become explicit before anyone sends funds.',
    body: 'Buyer, seller, amount, deadline, collateral, and proof expectations are written into one private room.',
  },
  {
    num: '002',
    label: 'Fund escrow',
    title: 'USDC enters the trust boundary on Arc.',
    body: 'The buyer funds the room. BOND keeps the value locked until the deal reaches release, refund, or dispute resolution.',
  },
  {
    num: '003',
    label: 'Deliver proof',
    title: 'The seller attaches evidence instead of asking for trust.',
    body: 'Links, hashes, messages, and delivery context stay attached to the room so both sides can verify what happened.',
  },
  {
    num: '004',
    label: 'Settle path',
    title: 'Funds only move through a clear final state.',
    body: 'Buyer releases, both sides refund/cancel, or the arbiter resolves a dispute. No vague middleman moment.',
  },
]

export const FLOW_WORDS = [
  'BUYER', 'CREATE', 'TERMS', 'ROOM', 'JOIN', 'USDC', 'FUND', 'LOCK', 'ESCROW', 'PROOF',
  'SELLER', 'DELIVER', 'REVIEW', 'RELEASE', 'REFUND', 'DISPUTE', 'ARBITER', 'SETTLE', 'ARC', 'FINAL',
]
