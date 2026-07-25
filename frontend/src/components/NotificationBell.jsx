import { useState, useEffect } from 'react'
import { authFetch, API_URL } from '../lib/api'

export default function NotificationBell({ wallet, tone = 'dark' }) {
  const [notifs, setNotifs] = useState([])
  const [open, setOpen] = useState(false)
  const unread = notifs.filter((n) => !n.read).length
  const dark = tone === 'dark'

  async function fetchNotifs() {
    if (!wallet) return
    try {
      const res = await fetch(`${API_URL}/api/notifications/${wallet.address.toLowerCase()}`)
      const data = await res.json()
      setNotifs(Array.isArray(data) ? data : [])
    } catch {
      setNotifs([])
    }
  }

  useEffect(() => {
    fetchNotifs()
  }, [wallet])

  useEffect(() => {
    if (!wallet) return undefined
    const interval = setInterval(() => fetchNotifs(), 10000)
    return () => clearInterval(interval)
  }, [wallet])

  async function markAllRead() {
      if (!wallet) return
      // Only mark-read when user opens the tray — and only if they already have API auth
      // or they explicitly click (this is an intentional write). Still single-flight.
      try {
        await authFetch(`/api/notifications/${wallet.address.toLowerCase()}/read`, { method: 'POST' }, wallet)
        fetchNotifs()
      } catch {
        /* ignore */
      }
    }

  if (!wallet) return null

  const triggerClass = dark
    ? 'text-[var(--a-ink)]/50 hover:text-[var(--a-ink)]'
    : 'text-[var(--a-inverse-ink)]/50 hover:text-[var(--a-inverse-ink)]'
  const panelClass = dark
    ? 'border-[var(--a-line)] bg-[var(--a-surface)] text-[var(--a-ink)]'
    : 'border-[#0a0a0a]/12 bg-[var(--a-inverse-bg)] text-[var(--a-inverse-ink)]'
  const borderClass = dark ? 'border-[var(--a-line)]' : 'border-[#0a0a0a]/10'
  const muted = dark ? 'text-[var(--a-muted)]' : 'text-[var(--a-faint)]'
  const rowUnread = dark ? 'bg-[var(--a-inverse-bg)]/4' : 'bg-[var(--a-panel)]/[0.03]'
  const rowText = dark ? 'text-[var(--a-ink)]/88' : 'text-[var(--a-inverse-ink)]/80'

  return (
    <div className="relative">
      <button
        onClick={() => {
          setOpen(!open)
          if (!open) markAllRead()
        }}
        className={`relative p-1.5 transition duration-160 ease-out active:scale-[0.97] ${triggerClass}`}
        aria-label="Notifications"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center border border-[#0a0a0a] bg-[var(--a-inverse-bg)] font-mono text-[9px] font-bold text-[var(--a-inverse-ink)]">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className={`absolute right-0 top-8 z-50 w-80 overflow-hidden border shadow-[0_18px_60px_rgba(0,0,0,0.35)] ${panelClass}`}>
            <div className={`flex items-center justify-between border-b px-4 py-2.5 ${borderClass}`}>
              <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${muted}`}>Notifications</span>
              {unread > 0 && (
                <button onClick={markAllRead} className={`text-[11px] transition hover:opacity-100 ${muted} opacity-80`}>
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifs.length === 0 ? (
                <div className={`px-4 py-6 text-center text-[13px] ${muted}`}>No notifications yet</div>
              ) : (
                notifs.slice(0, 10).map((n) => (
                  <div key={n.id} className={`border-b px-4 py-3 ${borderClass} ${!n.read ? rowUnread : ''}`}>
                    <div className={`text-[12px] leading-[1.45] ${rowText}`}>{n.message}</div>
                    <div className={`mt-1 font-mono text-[10px] ${muted}`}>
                      {new Date(n.createdAt).toLocaleString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
