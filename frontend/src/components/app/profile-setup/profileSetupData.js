export const SETUP_STEPS = [
  {
    key: 'displayName',
    label: 'Display name',
    title: 'Choose your display name.',
    placeholder: 'e.g. yjm26',
    helper: 'Shown to counterparties in rooms, market offers, and profile cards.',
    required: true,
  },
  {
    key: 'xProfile',
    label: 'X profile',
    title: 'Add your X profile.',
    placeholder: 'e.g. @yjm26',
    helper: 'Optional. Add it if counterparties should have off-chain context before a deal.',
    note: 'Manual handle for testnet. Do not treat it as verified identity.',
  },
  {
    key: 'discord',
    label: 'Discord',
    title: 'Add your Discord handle.',
    placeholder: 'e.g. yjm26',
    helper: 'Optional. Useful when a room needs quick off-chain coordination.',
  },
]

export const EMPTY_PROFILE_FORM = { displayName: '', xProfile: '', discord: '' }
