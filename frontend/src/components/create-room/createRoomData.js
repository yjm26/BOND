export const REVIEW_TIMEOUTS = [
  { key: 0, label: '24 hours', desc: 'Fast review for simple handoffs.' },
  { key: 2, label: '7 days', desc: 'Standard review for services or custom work.' },
  { key: 1, label: '30 days', desc: 'Long review for NFT, account, or event-based deals.' },
]

export const REVIEW_TIMEOUT_LABELS = {
  0: '24 hours',
  1: '30 days',
  2: '7 days',
}

export const CREATE_FLOW = {
  seller: [
    ['1', 'You create', 'Collateral can lock now'],
    ['2', 'Buyer joins', 'No cost to join'],
    ['3', 'Buyer funds', 'Price + 1% fee'],
  ],
  buyer: [
    ['1', 'You create', 'No funds move yet'],
    ['2', 'Seller joins', 'Collateral can lock'],
    ['3', 'You fund', 'Price + 1% fee'],
  ],
}
