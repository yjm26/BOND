export const DEMO_ROOM = {
  id: '1042',
  item: 'Brand kit + landing package',
  state: 'Delivered',
  price: '420',
  fee: '4.2',
  total: '424.2',
  locked: '424.2',
  collateral: '0',
  deliveryDays: 5,
  buyer: '0x7a3f…c91e',
  seller: '0x2b88…4d0a',
  roleHint: 'Buyer view',
}

export const DEMO_HOTSPOTS = [
  {
    id: 'state',
    label: 'State',
    title: 'Room state',
    body: 'Everyone sees the same stage: Created, Joined, Funded, Delivered, then release, refund, or dispute.',
    style: { top: '11%', left: '58%', width: '18%' },
  },
  {
    id: 'terms',
    label: 'Terms',
    title: 'Money terms',
    body: 'Price, platform fee, and locked escrow stay visible. No hidden totals after the room is open.',
    style: { top: '34%', left: '8%', width: '42%' },
  },
  {
    id: 'parties',
    label: 'Parties',
    title: 'Buyer and seller',
    body: 'Both wallets are fixed in the room. Roles stay clear so the next action is obvious.',
    style: { top: '58%', left: '8%', width: '42%' },
  },
  {
    id: 'actions',
    label: 'Actions',
    title: 'Next action',
    body: 'After delivery, the buyer can release funds or open a dispute. Dangerous exits stay separate.',
    style: { top: '34%', left: '56%', width: '36%' },
  },
  {
    id: 'buffer',
    label: 'Buffer',
    title: '12h arbiter buffer',
    body: 'If the buyer goes silent after delivery, seller can escalate after a fixed 12-hour buffer.',
    style: { top: '11%', left: '78%', width: '16%' },
  },
]
