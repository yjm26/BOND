/** Room state rail — next action per Bond state. */
export const LANDING_ROOM_STATES = [
  {
    id: 'created',
    label: 'Created',
    next: 'Share the invite, or wait',
    detail: 'Created: terms and join code on-chain. No USDC moved. Creator can cancel before join.',
  },
  {
    id: 'joined',
    label: 'Joined',
    next: 'Buyer funds price + 1% fee',
    detail: 'Joined: both parties set. Buyer has 30 minutes to fund or the room can expire.',
  },
  {
    id: 'funded',
    label: 'Funded',
    next: 'Seller marks delivered',
    detail: 'Funded: price + 1% fee locked. Seller has until the delivery deadline.',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    next: 'Buyer releases or disputes',
    detail: 'Delivered: seller posted delivery (optional proof hash). Buyer can release or dispute now.',
  },
  {
    id: 'closed',
    label: 'Closed',
    next: 'Released, refunded, or disputed',
    detail:
      'Closed: release pays the seller; refund returns the buyer; dispute freezes funds for the arbiter.',
  },
]
