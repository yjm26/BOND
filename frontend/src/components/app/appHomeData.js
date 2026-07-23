export const APP_ACTIONS = [
  {
    label: 'Market',
    title: 'Browse open escrow opportunities.',
    body: 'Review market rooms and offers before committing funds or delivery.',
    to: '/market',
  },
  {
    label: 'My rooms',
    title: 'Track rooms connected to this wallet.',
    body: 'Follow funded, delivered, disputed, released, and refunded room states.',
    to: '/rooms',
  },
  {
    label: 'Create',
    title: 'Start a new escrow room.',
    body: 'Define buyer, seller, amount, deadline, and fallback path before value moves.',
    to: '/create',
  },

  {
    label: 'Profile',
    title: 'Manage workspace identity.',
    body: 'Review connected wallet, app preferences, and profile settings.',
    to: '/profile',
  },
]
