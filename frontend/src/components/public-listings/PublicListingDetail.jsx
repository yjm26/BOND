import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Link } from 'react-router-dom'
import { formatAddress, listingExpiryLabel, timeAgo } from '../market/marketUtils'

export default function PublicListingDetail({ listing, onClose }) {
  useEffect(() => {
    if (!listing) return undefined
    const onKey = (event) => {
      if (event.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [listing, onClose])

  if (!listing) return null

  const node = (
    <div className="fixed inset-0 z-[80] flex items-end justify-center px-4 py-4 sm:items-center sm:py-8" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 cursor-default bg-[#0a0a0a]/45 backdrop-blur-[2px]"
        aria-label="Close listing detail"
        onClick={onClose}
      />

      <div className="relative flex max-h-[min(860px,92vh)] w-full max-w-[720px] flex-col overflow-hidden border border-[#0a0a0a]/12 bg-[#fafafa] text-[#0a0a0a] shadow-2xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#0a0a0a]/10 px-5 py-4 sm:px-6">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">
              {listing.category || 'Other'} · {timeAgo(listing.createdAt)}
            </div>
            <h2 className="mt-3 max-w-[520px] text-[clamp(28px,4vw,40px)] font-medium leading-[0.95] tracking-[-0.06em]">
              {listing.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#0a0a0a]/14 text-[20px] leading-none text-[#0a0a0a]/55 transition duration-160 ease-out hover:border-[#0a0a0a]/34 hover:text-[#0a0a0a] active:scale-[0.97]"
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-5 sm:px-6">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="border border-[#0a0a0a]/10 bg-white p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Price</div>
              <div className="mt-2 font-mono text-[28px] tracking-[-0.04em]">
                {listing.price} <span className="text-[12px] text-[#737373]">USDC</span>
              </div>
            </div>
            <div className="border border-[#0a0a0a]/10 bg-white p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Role</div>
              <div className="mt-2 text-[18px] font-medium tracking-[-0.03em]">
                {listing.role === 'buyer' ? 'Buyer' : 'Seller'}
              </div>
            </div>
            <div className="border border-[#0a0a0a]/10 bg-white p-4">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Window</div>
              <div className="mt-2 text-[18px] font-medium tracking-[-0.03em]">{listingExpiryLabel(listing)}</div>
            </div>
          </div>

          <div className="mt-5 border border-[#0a0a0a]/10 bg-white p-4 sm:p-5">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Description</div>
            <p className="mt-3 whitespace-pre-wrap text-[14px] leading-[1.65] text-[#525252]">
              {listing.description?.trim() || 'No description.'}
            </p>
          </div>

          <div className="mt-4 grid gap-2 text-[13px] text-[#525252] sm:grid-cols-2">
            <div className="flex justify-between gap-3 border border-[#0a0a0a]/10 bg-white px-4 py-3">
              <span>Creator</span>
              <span className="font-mono text-[#0a0a0a]/75">{formatAddress(listing.creator)}</span>
            </div>
            <div className="flex justify-between gap-3 border border-[#0a0a0a]/10 bg-white px-4 py-3">
              <span>Delivery</span>
              <span className="font-mono text-[#0a0a0a]/75">{listing.deliveryDays || 5} days</span>
            </div>
          </div>
        </div>

        <div className="border-t border-[#0a0a0a]/10 bg-[#fafafa] p-4 sm:p-5">
          <Link
            to="/app"
            className="inline-flex h-11 w-full items-center justify-center border border-[#0a0a0a] bg-[#0a0a0a] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]"
          >
            {listing.taken ? 'Go to app' : 'Open in app'}
          </Link>
          <p className="mt-3 text-center text-[12px] leading-[1.5] text-[#737373]">
            Wallet needed to open a room or post.
          </p>
        </div>
      </div>
    </div>
  )

  return createPortal(node, document.body)
}
