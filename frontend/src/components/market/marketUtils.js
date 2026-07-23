export function formatAddress(addr) {
  if (!addr) return '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

export function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

export function socialLink(type, value) {
  const clean = value.replace(/^@/, '')
  if (type === 'twitter') return `https://x.com/${clean}`
  if (type === 'telegram') return `https://t.me/${clean}`
  return null
}

export function sortListings(listings, search, sort) {
  let data = listings.slice()
  if (search.trim()) {
    const q = search.toLowerCase()
    data = data.filter((listing) => listing.title.toLowerCase().includes(q) || listing.description?.toLowerCase().includes(q))
  }
  switch (sort) {
    case 'price_asc': data.sort((a, b) => Number(a.price) - Number(b.price)); break
    case 'price_desc': data.sort((a, b) => Number(b.price) - Number(a.price)); break
    case 'delivery': data.sort((a, b) => (a.deliveryDays || 5) - (b.deliveryDays || 5)); break
    case 'newest':
    default: data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0)); break
  }
  return data
}
