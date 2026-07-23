export const SETUP_STEPS = [
  {
    key: 'displayName',
    label: 'Display name',
    title: 'What should BOND call you?',
    placeholder: 'e.g. yjm26',
    helper: 'Shown inside your local workspace. Keep it short and recognizable.',
    required: true,
  },
  {
    key: 'xProfile',
    label: 'X profile',
    title: 'Add your X profile.',
    placeholder: 'e.g. @yjm26',
    helper: 'Optional for now. Useful later when counterparties need off-chain context.',
  },
  {
    key: 'discord',
    label: 'Discord',
    title: 'Add your Discord handle.',
    placeholder: 'e.g. yjm26',
    helper: 'Optional for now. This stays local until real profile storage exists.',
  },
]

export const EMPTY_PROFILE_FORM = { displayName: '', xProfile: '', discord: '' }
