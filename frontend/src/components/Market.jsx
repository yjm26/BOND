import { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useToast } from '../hooks/useToast'
import { authFetch, apiGet, API_URL } from '../lib/api'
import OfferModal from './OfferModal'
import OffersPanel from './OffersPanel'
import ReputationBadge from './ReputationBadge'
import { DEAL_TYPES } from '../utils/contract'
import { APP_ACTIONS } from './app/appHomeData'

const CATEGORIES = ['All', 'NFT', 'Wallet', 'Account', 'Service', 'Other']

const CATEGORY_ICON = {
  NFT: '◆',
  Wallet: '◈',
  Account: '◉',
  Service: '▣',
  Other: '▪',
}

const CATEGORY_STYLES = {
  NFT:    { bg: 'rgba(139,92,246,0.07)', color: '#8b5cf6', border: 'rgba(139,92,246,0.15)' },
  Wallet: { bg: 'rgba(6,182,212,0.07)',  color: '#06b6d4', border: 'rgba(6,182,212,0.15)' },
  Account:{ bg: 'rgba(245,158,11,0.07)', color: '#d97706', border: 'rgba(245,158,11,0.15)' },
  Service:{ bg: 'rgba(16,185,129,0.07)', color: '#059669', border: 'rgba(16,185,129,0.15)' },
  Other:  { bg: 'rgba(156,163,175,0.07)', color: '#6b7280', border: 'rgba(156,163,175,0.15)' },
}

const SOCIAL_OPTIONS = [
  { key: 'telegram', label: 'Telegram', icon: '✈️', placeholder: '@username', validate: (v) => v.startsWith('@') ? null : 'Must start with @' },
  { key: 'discord', label: 'Discord', icon: '🎮', placeholder: 'username', validate: (v) => v.length >= 2 ? null : 'Too short' },
  { key: 'twitter', label: 'Twitter / X', icon: '𝕏', placeholder: '@username', validate: (v) => v.startsWith('@') ? null : 'Must start with @' },
  { key: 'whatsapp', label: 'WhatsApp', icon: '📱', placeholder: '+628xxx', validate: (v) => /^\+\d{8,}$/.test(v) ? null : 'Must start with + and country code' },
  { key: 'other', label: 'Other', icon: '🔗', placeholder: 'Link or @handle', validate: () => null },
]

const SORT_OPTIONS = [
  { key: 'newest', label: 'Newest first' },
  { key: 'price_asc', label: 'Price: Low → High' },
  { key: 'price_desc', label: 'Price: High → Low' },
  { key: 'delivery', label: 'Delivery: Fastest' },
]

function formatAddress(addr) {
  if (!addr) return '—'
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

function timeAgo(ts) {
  const diff = Math.floor((Date.now() - ts) / 1000)
  if (diff < 60) return 'just now'
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`
  return `${Math.floor(diff / 86400)}d ago`
}

function socialLink(type, value) {
  const clean = value.replace(/^@/, '')
  if (type === 'twitter') return `https://x.com/${clean}`
  if (type === 'telegram') return `https://t.me/${clean}`
  return null
}

export default function Market({ wallet }) {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offerTarget, setOfferTarget] = useState(null)
  const [showOffers, setShowOffers] = useState(false)
  const [expandedListing, setExpandedListing] = useState(null)
  const [form, setForm] = useState({
    role: 'seller', title: '', description: '', category: 'NFT', price: '', collateral: '', deliveryDays: 5, dealType: 0,
    contactMethod: 'telegram', contactHandle: '',
  })

  const fetchListings = useCallback(async () => {
    try {
      const cat = filter === 'All' ? '' : `?category=${filter}`
      const res = await fetch(`${API_URL}/api/listings${cat}`)
      const data = await res.json()
      setListings(data)
    } catch (err) {
      console.error('Failed to fetch listings:', err)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchListings() }, [fetchListings])

  // Auto-poll every 15s
  useEffect(() => {
    const interval = setInterval(() => fetchListings(), 15000)
    return () => clearInterval(interval)
  }, [fetchListings])

  const [formError, setFormError] = useState('')
  const [touched, setTouched] = useState({ title: false, price: false })

  const handleSubmit = async () => {
    setFormError('')
    if (!wallet) { setFormError('Connect your wallet first'); return }
    if (!form.title.trim()) { setTouched(t => ({ ...t, title: true })); setFormError('Title is required'); return }
    if (!form.price || Number(form.price) <= 0) { setTouched(t => ({ ...t, price: true })); setFormError('Price must be greater than 0'); return }
    // Validate contact
    const method = SOCIAL_OPTIONS.find(s => s.key === form.contactMethod)
    const handle = form.contactHandle.trim()
    if (!handle) { setFormError('Contact handle is required so buyer/seller can reach you'); return }
    const validation = method?.validate?.(handle)
    if (validation) { setFormError(`Contact: ${validation}`); return }
    const socials = { [form.contactMethod]: handle }
    try {
      await authFetch('/api/listings', {
        method: 'POST',
        body: JSON.stringify({
          role: form.role,
          title: form.title.trim(),
          description: form.description,
          category: form.category,
          price: form.price,
          collateral: form.collateral || '0',
          deliveryDays: Number(form.deliveryDays) || 5,
          dealType: Number(form.dealType) || 0,
          socials,
        }),
      }, wallet)
      setForm({ role: 'seller', title: '', description: '', category: 'NFT', price: '', collateral: '', deliveryDays: 5, dealType: 0, contactMethod: 'telegram', contactHandle: '' })
      setTouched({ title: false, price: false })
      setShowForm(false)
      fetchListings()
    } catch (err) {
      console.error(err)
      setFormError(err.message || 'Failed to post listing')
    }
  }

  const handleOpenDeal = (listing) => {
    setOfferTarget(listing)
  }

  const [deleteError, setDeleteError] = useState('')

  const handleDelete = async (id) => {
    setDeleteError('')
    try {
      await authFetch(`/api/listings/${id}`, { method: 'DELETE' }, wallet)
      fetchListings()
    } catch (err) {
      console.error(err)
      setDeleteError(err.message || 'Failed to delete listing. Try again.')
    }
  }

  const sorted = useMemo(() => {
    let data = listings.slice()
    if (search.trim()) {
      const q = search.toLowerCase()
      data = data.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.description?.toLowerCase().includes(q)
      )
    }
    switch (sort) {
      case 'price_asc':
        data.sort((a, b) => Number(a.price) - Number(b.price))
        break
      case 'price_desc':
        data.sort((a, b) => Number(b.price) - Number(a.price))
        break
      case 'delivery':
        data.sort((a, b) => (a.deliveryDays || 5) - (b.deliveryDays || 5))
        break
      case 'newest':
      default:
        data.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0))
        break
    }
    return data
  }, [listings, search, sort])

  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border border-[#ede9df]/10 bg-[#20201f] p-4 lg:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">BOND App</div>
          <div className="mt-6 space-y-1">
            {APP_ACTIONS.map((item) => (
              <Link key={item.label} to={item.to} className={`flex h-10 items-center justify-between border px-3 text-[13px] transition ${
                item.label === 'Market'
                  ? 'border-[#ede9df]/12 bg-[#ede9df]/6 text-[#ede9df]'
                  : 'border-transparent text-[#ede9df]/62 hover:border-[#ede9df]/10 hover:bg-[#ede9df]/5 hover:text-[#ede9df]'
              }`}>
                {item.label}
                <span className="text-[#ede9df]/24">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 border-t border-[#ede9df]/10 pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[#ede9df]/40">
            Wallet<br />
            <span className="text-[#ede9df]/78">{wallet?.address ? formatAddress(wallet.address) : 'Not connected'}</span>
          </div>
        </aside>

        <main className="overflow-hidden border border-[#ede9df]/10 bg-[#111110]">
          <div className="p-4 sm:p-5 lg:p-6">
            {showForm && (
              <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">New listing</div>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <input className="h-12 border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" placeholder="Title *" value={form.title} onChange={(e) => { setForm({ ...form, title: e.target.value }); setTouched(t => ({ ...t, title: true })) }} />
                  <div className="relative">
                    <input className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 pr-16 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" type="number" placeholder="Price *" value={form.price} onChange={(e) => { setForm({ ...form, price: e.target.value }); setTouched(t => ({ ...t, price: true })) }} />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/44">USDC</span>
                  </div>
                  <select className="h-12 border border-[#ede9df]/12 bg-[#111110] px-4 text-[13px] text-[#ede9df] outline-none focus:border-[#d8b15f]/60" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  <div className="grid grid-cols-[140px_1fr] gap-2">
                    <select className="h-12 border border-[#ede9df]/12 bg-[#111110] px-3 text-[13px] text-[#ede9df] outline-none focus:border-[#d8b15f]/60" value={form.contactMethod} onChange={(e) => setForm({ ...form, contactMethod: e.target.value })}>
                      {SOCIAL_OPTIONS.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                    </select>
                    <input className="h-12 border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" placeholder={SOCIAL_OPTIONS.find(s => s.key === form.contactMethod)?.placeholder || '@username'} value={form.contactHandle} onChange={(e) => setForm({ ...form, contactHandle: e.target.value })} />
                  </div>
                  <textarea className="min-h-[96px] border border-[#ede9df]/12 bg-[#111110] px-4 py-3 text-[14px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60 sm:col-span-2" placeholder="Description — terms, proof, delivery expectations" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/38">Contact is required before a listing goes live.</div>
                  <button onClick={handleSubmit} className="h-11 border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Post listing</button>
                </div>
                {formError && <div className="mt-3 border border-[#c98b4a]/30 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{formError}</div>}
              </div>
            )}

            {deleteError && <div className="mb-4 border border-[#c98b4a]/30 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{deleteError}</div>}

            <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">Market</div>
              {wallet && (
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => { setShowOffers(!showOffers); setShowForm(false) }}
                    className={`h-10 border px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition ${showOffers ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/16 text-[#ede9df]/70 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}
                  >
                    Offers
                  </button>
                  <button
                    onClick={() => { setShowForm(!showForm); setShowOffers(false) }}
                    className="h-10 border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]"
                  >
                    {showForm ? 'Cancel' : 'Post listing'}
                  </button>
                </div>
              )}
            </div>

            <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-3">
              <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
                <input
                  className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60"
                  placeholder="Search listings…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <select className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ede9df] outline-none transition focus:border-[#d8b15f]/60" value={sort} onChange={(e) => setSort(e.target.value)}>
                  {SORT_OPTIONS.map(o => <option key={o.key} value={o.key}>{o.label}</option>)}
                </select>
              </div>
              <div className="mt-3 flex gap-2 overflow-x-auto border-t border-[#ede9df]/10 pt-3">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setFilter(cat)} className={`whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${filter === cat ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 bg-transparent text-[#ede9df]/52 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}>
                    {cat !== 'All' && <span className="mr-1 opacity-60">{CATEGORY_ICON[cat]}</span>}{cat}
                  </button>
                ))}
              </div>
            </div>

            {loading && (
              <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-[240px] animate-pulse border border-[#ede9df]/10 bg-[#20201f]" />)}
              </div>
            )}

            {!loading && sorted.length === 0 && (
              <div className="grid min-h-[260px] place-items-center border border-[#ede9df]/10 bg-[#20201f] p-8 text-center">
                <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[#ede9df]/12 bg-[#111110] font-mono text-[20px] text-[#ede9df]/44">⌕</div>
                <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[#ede9df]">{search ? 'No results found' : 'No listings yet'}</h3>
                <p className="max-w-[420px] text-[14px] leading-[1.65] text-[#b9b2a5]">
                  {search ? `No listings match "${search}"` : wallet ? 'Post the first listing and define the escrow terms before value moves.' : 'Connect your wallet to post a listing. Deals should start with clear terms, price, proof, and settlement path.'}
                </p>
              </div>
            )}

            {!loading && sorted.length > 0 && (
              <div className="grid gap-px bg-[#ede9df]/10 p-px md:grid-cols-2 xl:grid-cols-3">
                {sorted.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} wallet={wallet} onOpenDeal={() => handleOpenDeal(listing)} onDelete={() => handleDelete(listing.id)} onExpand={() => setExpandedListing(listing)} />
                ))}
              </div>
            )}

            {showOffers && wallet && <OffersPanel wallet={wallet} API_URL={API_URL} />}
            {offerTarget && wallet && <OfferModal listing={offerTarget} wallet={wallet} onClose={() => setOfferTarget(null)} onSubmitted={() => { setOfferTarget(null); fetchListings() }} />}
            {expandedListing && (
              <ListingDetailModal listing={expandedListing} wallet={wallet} API_URL={API_URL} onClose={() => setExpandedListing(null)} onOpenDeal={() => { setExpandedListing(null); handleOpenDeal(expandedListing) }} onDelete={() => { setExpandedListing(null); handleDelete(expandedListing.id) }} />
            )}
          </div>
        </main>
      </div>
    </section>
  )

}

function ListingCard({ listing, wallet, onOpenDeal, onDelete, onExpand }) {
  const isOwner = wallet && listing.creator?.toLowerCase() === wallet.address?.toLowerCase()
  const hasSocials = listing.socials && Object.keys(listing.socials).length > 0
  const isBuyerListing = listing.role === 'buyer'
  const dealType = DEAL_TYPES.find(t => t.id === Number(listing.dealType))?.label || 'Instant'

  return (
    <div onClick={onExpand} className="group min-h-[300px] cursor-pointer bg-[#111110] p-5 transition hover:bg-[#1a1a18] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/38">
          {listing.category || 'Other'} / {timeAgo(listing.createdAt)}
        </div>
        <span className={`border px-2 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${listing.taken ? 'border-[#c98b4a]/30 text-[#c98b4a]' : 'border-[#b7c8a3]/30 text-[#b7c8a3]'}`}>
          {listing.taken ? 'In progress' : 'Active'}
        </span>
      </div>

      <h3 className="mt-10 min-h-[58px] max-w-[330px] text-[28px] font-medium leading-[0.98] tracking-[-0.06em] text-[#ede9df]">
        {listing.title}
      </h3>

      <div className="mt-7 flex items-end justify-between gap-4 border-b border-[#ede9df]/10 pb-5">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/34">Price</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="font-mono text-[30px] leading-none tracking-[-0.04em] text-[#ede9df]">{listing.price}</span>
            <span className="text-[13px] text-[#ede9df]/42">USDC</span>
          </div>
        </div>
        <div className="text-right font-mono text-[10px] uppercase leading-[1.7] tracking-[0.14em] text-[#ede9df]/38">
          {isBuyerListing ? 'Buyer listing' : 'Seller listing'}<br />
          {dealType}
        </div>
      </div>

      <div className="mt-5 grid gap-3 text-[13px] text-[#b9b2a5]">
        <div className="flex items-center justify-between gap-4">
          <span>Creator</span>
          <span className="font-mono text-[#ede9df]/58">{formatAddress(listing.creator)}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Delivery</span>
          <span className="font-mono text-[#ede9df]/58">{listing.deliveryDays || 5} days</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span>Contact</span>
          <span className="font-mono text-[#ede9df]/58">{hasSocials ? 'DM ready' : 'Not added'}</span>
        </div>
      </div>

      <div className="mt-7">
        {isOwner ? (
          listing.taken ? (
            <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">Room active</span>
          ) : (
            <button onClick={(e) => { e.stopPropagation(); onDelete() }} className="h-10 border border-[#c98b4a]/40 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10">
              Delete listing
            </button>
          )
        ) : listing.taken ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a]">Room in progress</span>
        ) : (
          <button onClick={(e) => { e.stopPropagation(); onOpenDeal() }} className="h-11 w-full border border-[#ede9df] bg-[#ede9df] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">
            {listing.role === 'buyer' ? 'Sell to them' : 'Open deal'}
          </button>
        )}
      </div>
    </div>
  )
}


/* ═══════════════════════════════════════════
   Listing Detail Modal — click card to expand
   ═══════════════════════════════════════════ */
function ListingDetailModal({ listing, wallet, API_URL, onClose, onOpenDeal, onDelete }) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [joinLoading, setJoinLoading] = useState(false)
  const isOwner = wallet && listing.creator?.toLowerCase() === wallet.address?.toLowerCase()
  const isBuyerListing = listing.role === 'buyer'
  const catStyle = CATEGORY_STYLES[listing.category] || CATEGORY_STYLES.Other
  const hasSocials = listing.socials && Object.keys(listing.socials).length > 0

  const handleJoinFromMarket = async () => {
    setJoinLoading(true)
    try {
      // Fetch fresh listing data — frontend state may be stale (takenRoomId not yet polled)
      const res = await fetch(`${API_URL}/api/listings`)
      const all = await res.json()
      const fresh = all.find(l => l.id === listing.id)
      const roomId = fresh?.takenRoomId || listing.takenRoomId
      if (!roomId) {
        addToast('Buyer has not created a room yet. Please wait a moment and try again.', 'err')
        return
      }

      // Try to get join code — first by roomId, then by creator address fallback
      let joinCode = null
      try {
        const data = await authFetch(`/api/room-codes?roomId=${roomId}`, { method: 'GET' }, wallet)
        joinCode = data?.[0]?.joinCode
      } catch (e) { console.error('room-codes by roomId failed:', e) }

      // Fallback: fetch from creator's stored codes
      if (!joinCode && fresh?.creator) {
        try {
          const fallbackData = await authFetch('/api/room-codes', { method: 'GET' }, wallet)
          const match = fallbackData.find(rc => String(rc.roomId) === String(roomId))
          joinCode = match?.joinCode
        } catch (e) { console.error('room-codes fallback failed:', e) }
      }

      if (joinCode) {
        navigate(`/room/${roomId}?joinCode=${encodeURIComponent(joinCode)}`)
      } else {
        addToast('Join code not found. Please ask the buyer for the invite link, or check My Rooms.', 'err')
      }
      onClose()
    } catch (err) {
      console.error('Failed to fetch join code:', err)
      addToast('Failed to load room. Please try My Rooms instead.', 'err')
    } finally {
      setJoinLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div
        className="bg-white dark:bg-[#1a1d2e] rounded-xl border border-zinc-200 dark:border-white/10 shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-zinc-100 dark:border-white/10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {/* Role badge */}
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${
                  isBuyerListing
                    ? 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20'
                    : 'bg-gray-100 text-gray-700 border-gray-200 dark:bg-white/5 dark:text-gray-300 dark:border-white/10'
                }`}
              >
                {isBuyerListing ? '◈ BUYER LISTING' : '◆ SELLER LISTING'}
              </span>
              <span
                className="inline-flex items-center gap-1 px-2 py-[3px] rounded-full text-[10px] font-semibold tracking-wide uppercase border"
                style={{ background: catStyle.bg, color: catStyle.color, borderColor: catStyle.border }}
              >
                {CATEGORY_ICON[listing.category] || '▪'} {listing.category?.toUpperCase()}
              </span>
            </div>
            <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 dark:hover:text-white text-xl leading-none">×</button>
          </div>

          <h2 className="text-[18px] font-semibold text-zinc-900 dark:text-white leading-snug">
            {listing.title}
          </h2>
          <p className="text-[11px] text-zinc-400 dark:text-gray-500 font-mono mt-1">
            Posted {timeAgo(listing.createdAt)} by {formatAddress(listing.creator)}
          </p>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Description */}
          {listing.description ? (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-1.5">Description</div>
              <p className="text-[14px] text-zinc-700 dark:text-gray-300 leading-[1.6] whitespace-pre-wrap">
                {listing.description}
              </p>
            </div>
          ) : (
            <div className="text-[13px] text-zinc-400 italic">No description provided.</div>
          )}

          {/* Price row */}
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-1">Price</div>
              <div className="text-[24px] font-semibold text-zinc-900 dark:text-white font-mono">{listing.price} <span className="text-[14px] text-zinc-400 font-normal">USDC</span></div>
            </div>
            <div className="flex-1">
              <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-1">Collateral</div>
              <div className={`text-[16px] font-semibold font-mono ${Number(listing.collateral) > 0 ? 'text-amber-700 dark:text-amber-400' : 'text-zinc-400 dark:text-gray-500'}`}>
                {Number(listing.collateral) > 0 ? `🔒 ${listing.collateral} USDC` : 'None'}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div className="flex items-center gap-3 text-[13px] text-zinc-600 dark:text-gray-400">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
            </svg>
            Delivery within <span className="font-semibold text-zinc-900 dark:text-white font-mono">{listing.deliveryDays || 5} days</span>
          </div>

          {/* Deal type */}
          <div className="flex items-center gap-2 text-[13px] text-stripe-body dark:text-gray-400">
            <span className={`inline-flex items-center text-[10px] font-medium px-2 py-[2px] rounded border font-mono uppercase tracking-[1px] ${
              Number(listing.dealType) === 0 ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-300 border-indigo-100 dark:border-indigo-500/20' :
              Number(listing.dealType) === 1 ? 'bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 border-purple-100 dark:border-purple-500/20' :
              'bg-sky-50 dark:bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-100 dark:border-sky-500/20'
            }`}>
              {DEAL_TYPES.find(t => t.id === Number(listing.dealType))?.label || 'Instant'}
            </span>
            <span className="text-[12px] opacity-70">{DEAL_TYPES.find(t => t.id === Number(listing.dealType))?.desc}</span>
          </div>

          {/* Creator + reputation */}
          <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-white/5 rounded-lg border border-zinc-100 dark:border-white/5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 flex items-center justify-center text-[10px] font-bold text-zinc-500 dark:text-zinc-400">
              0x
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-mono text-zinc-900 dark:text-white truncate">{listing.creator}</div>
              <div className="text-[11px] text-zinc-400">Creator</div>
            </div>
            <ReputationBadge provider={wallet?.provider} address={listing.creator} />
          </div>

          {/* Socials */}
          {hasSocials && (
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[2px] text-zinc-400 mb-2">Contact</div>
              <div className="flex flex-wrap gap-2">
                {SOCIAL_OPTIONS.map(s => {
                  const val = listing.socials?.[s.key]
                  if (!val) return null
                  const link = socialLink(s.key, val)
                  return link ? (
                    <a
                      key={s.key}
                      href={link}
                      target="_blank"
                      rel="noopener"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-white/10 text-[12px] text-zinc-700 dark:text-gray-300 hover:bg-zinc-50 dark:hover:bg-white/5 transition"
                      onClick={e => e.stopPropagation()}
                    >
                      <span>{s.icon}</span> {val}
                    </a>
                  ) : (
                    <span key={s.key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-zinc-200 dark:border-white/10 text-[12px] text-zinc-500 dark:text-gray-400">
                      <span>{s.icon}</span> {val}
                    </span>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-5 border-t border-zinc-100 dark:border-white/10">
          {isOwner ? (
            listing.taken ? (
              <div className="flex flex-col gap-3">
                {listing.takenRoomId && (
                  <button
                    onClick={handleJoinFromMarket}
                    disabled={joinLoading}
                    className="w-full py-3 rounded-md bg-amber-500 text-white text-[15px] font-medium hover:bg-amber-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {joinLoading ? 'Loading\u2026' : 'Join Room \u2192'}
                  </button>
                )}
                <div className="text-center text-[13px] text-amber-600 dark:text-amber-400 font-medium">
                  ⏳ This listing is in progress
                </div>
              </div>
            ) : (
              <div className="flex gap-2">
                <button onClick={onDelete} className="flex-1 py-2.5 rounded-md border border-red-200 dark:border-red-500/20 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition text-[13px] font-medium">
                  Delete Listing
                </button>
              </div>
            )
          ) : listing.taken ? (
            <div className="text-center text-[13px] text-amber-600 dark:text-amber-400 font-medium">
              ⏳ Room in progress
            </div>
          ) : (
            <button onClick={onOpenDeal} className="btn-primary w-full py-3 text-[15px]">
              {listing.role === 'buyer' ? 'Sell to Them →' : 'Open Deal →'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
