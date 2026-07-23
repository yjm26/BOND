export const DEAL_TYPES = [
  { key: 0, label: 'Instant', desc: 'Digital goods with a 24h confirm window.' },
  { key: 1, label: 'Event based', desc: 'WL, mint, launch, or date-based delivery.' },
  { key: 2, label: 'Service', desc: 'Custom work with delivery proof and review window.' },
]

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
