import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../hooks/useToast'
import { authFetch } from '../../lib/api'
import { DEAL_TYPES } from '../../utils/contract'
import ReputationBadge from '../ReputationBadge'
import { CATEGORY_ICON, CATEGORY_STYLES, SOCIAL_OPTIONS } from './marketConstants'
import { formatAddress, socialLink, timeAgo } from './marketUtils'

export default function ListingDetailModal({ listing, wallet, API_URL, onClose, onOpenDeal, onDelete }) {
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