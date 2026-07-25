export const APP_ACTIONS = [
  {
    label: 'Market',
    title: 'Browse listings.',
    body: 'Open deals and offers before you fund a room.',
    to: '/market',
  },
  {
    label: 'My rooms',
    title: 'Track your rooms.',
    body: 'Funded, delivered, disputed, released, refunded.',
    to: '/rooms',
  },
  {
    label: 'Create room',
    title: 'Open a room.',
    body: 'Set buyer, seller, amount, and delivery terms.',
    to: '/create',
  },
  {
    label: 'Profile',
    title: 'Edit profile.',
    body: 'Display name, socials, and wallet identity.',
    to: '/profile',
  },
  {
    label: 'Disputes',
    title: 'Review disputes.',
    body: 'Arbiter tools for frozen rooms and evidence.',
    to: '/arbiter',
    adminOnly: true,
  },
]

export const visibleAppActions = (canAccessDisputes) =>
  APP_ACTIONS.filter((item) => !item.adminOnly || canAccessDisputes)
