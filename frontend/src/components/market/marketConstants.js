export const CATEGORIES = ['All', 'NFT', 'Wallet', 'Account', 'Service', 'Other']

export const CATEGORY_ICON = {
  NFT: '◆',
  Wallet: '◈',
  Account: '◉',
  Service: '▣',
  Other: '▪',
}

export const CATEGORY_STYLES = {
  NFT:    { bg: 'rgba(163,163,163,0.08)', color: '#a3a3a3', border: 'rgba(163,163,163,0.18)' },
  Wallet: { bg: 'rgba(143,154,136,0.08)', color: '#8f9a88', border: 'rgba(143,154,136,0.18)' },
  Account:{ bg: 'rgba(184,115,51,0.08)', color: '#b87333', border: 'rgba(184,115,51,0.18)' },
  Service:{ bg: 'rgba(250,250,250,0.06)', color: '#fafafa', border: 'rgba(250,250,250,0.14)' },
  Other:  { bg: 'rgba(250,250,250,0.05)', color: '#a3a3a3', border: 'rgba(250,250,250,0.12)' },
}

export const SOCIAL_OPTIONS = [
  { key: 'telegram', label: 'Telegram', icon: '✈️', placeholder: '@username', validate: (v) => v.startsWith('@') ? null : 'Must start with @' },
  { key: 'discord', label: 'Discord', icon: '🎮', placeholder: 'username', validate: (v) => v.length >= 2 ? null : 'Too short' },
  { key: 'twitter', label: 'Twitter / X', icon: '𝕏', placeholder: '@username', validate: (v) => v.startsWith('@') ? null : 'Must start with @' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '📱', placeholder: '+628xxx', validate: (v) => /^\+\d{8,}$/.test(v) ? null : 'Must start with + and country code' },
  { key: 'other', label: 'Other', icon: '🔗', placeholder: 'Link or @handle', validate: () => null },
]

export const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'price_asc', label: 'Price: Low → High' },
  { key: 'price_desc', label: 'Price: High → Low' },
  { key: 'delivery', label: 'Delivery: Fastest' },
]

export const EMPTY_FORM = {
  role: 'seller',
  title: '',
  description: '',
  category: 'NFT',
  price: '',
  collateral: '',
  deliveryDays: 5,
  dealType: 0,
}
