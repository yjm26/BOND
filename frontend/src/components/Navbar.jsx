import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { getContract } from '../utils/contract'
import NotificationBell from './NotificationBell'
import ThemeToggle from './ThemeToggle'

export default function Navbar({ onConnect, wallet, connecting, onDisconnect }) {
  const navigate = useNavigate()
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  useEffect(() => {
    if (!wallet) { setIsAdmin(false); return }
    const provider = wallet.provider
    const contract = getContract(provider)
    let stale = false
    Promise.all([
      contract.owner().catch(() => ''),
      contract.arbiter().catch(() => ''),
    ]).then(([owner, arbiter]) => {
      if (stale) return
      const addr = wallet.address.toLowerCase()
      setIsAdmin(addr === owner.toLowerCase() || addr === arbiter.toLowerCase())
    })
    return () => { stale = true }
  }, [wallet])

  useEffect(() => {
    setMobileOpen(false)
  }, [typeof window !== 'undefined' ? window.location.pathname : ''])

  const scrollToHow = (e) => {
    e.preventDefault()
    const isHome = window.location.pathname === '/' || window.location.pathname === ''
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById('how')
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 350)
    } else {
      const el = document.getElementById('how')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const navLink = 'text-[13px] font-medium text-[#0d0d0b] opacity-60 hover:opacity-100 transition-opacity'

  return (
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#0d0d0b]/10 bg-[#ede9df]/92 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="mx-auto flex max-w-[1240px] items-center justify-between">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-none border border-[#0d0d0b]/15 bg-transparent">
            <span className="font-mono text-[12px] font-bold text-[#0d0d0b]">B</span>
          </div>
          <div>
            <span className="block text-[15px] font-semibold tracking-[-0.025em] text-[#0d0d0b]">BOND</span>
            <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-[#0d0d0b]/45 sm:block">Arc settlement rooms</span>
          </div>
        </Link>

        <button className="border border-[#0d0d0b]/15 bg-transparent p-2 text-[#0d0d0b] md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></svg>
        </button>

        <div className="hidden items-center gap-8 md:flex">
          <div className="flex items-center gap-6">
            <a href="#how" onClick={scrollToHow} className={navLink}>How it works</a>
            <Link to="/docs" className={navLink}>Docs</Link>
            <Link to="/market" className={navLink}>Market</Link>
            {wallet && (
              <>
                <Link to="/rooms" className={navLink}>Rooms</Link>
                <Link to="/offers" className={navLink}>Offers</Link>
              </>
            )}
            {isAdmin && (
              <Link to="/arbiter" className="text-[13px] font-medium text-red-300 hover:text-red-200 transition-colors">Arbiter</Link>
            )}
          </div>

          <div className="flex items-center gap-3 border-l border-white/[0.08] pl-5">
            <ThemeToggle />
            {wallet ? (
              <>
                <NotificationBell wallet={wallet} />
                <div className="relative">
                  <button onClick={() => setShowWalletMenu(!showWalletMenu)} className="flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.035] px-3 py-2 font-mono text-[12px] text-bond-muted transition hover:border-white/[0.16] hover:text-bond-text">
                    <span className="h-2 w-2 rounded-full bg-[#b7c8a3] shadow-[0_0_14px_rgba(183,200,163,0.28)]" />
                    {isAdmin && <span className="rounded bg-[#d8b15f]/20 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#6f5628]">ADMIN</span>}
                    <span>{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}</span>
                    <svg className="ml-1 h-3 w-3 text-bond-faint" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                  </button>
                  {showWalletMenu && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                      <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-xl border border-white/10 bg-[#111317] shadow-2xl">
                        <div className="border-b border-white/[0.08] px-4 py-3">
                          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bond-faint">Connected</div>
                          <div className="mt-1 font-mono text-[12px] text-bond-text">{wallet.address.slice(0, 10)}…{wallet.address.slice(-6)}</div>
                        </div>
                        <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target="_blank" rel="noopener" className="block px-4 py-3 text-[13px] text-bond-muted transition hover:bg-white/[0.045] hover:text-bond-text">
                          View on Arcscan
                        </a>
                        <button onClick={() => { onDisconnect(); setShowWalletMenu(false) }} className="w-full px-4 py-3 text-left text-[13px] text-red-300 transition hover:bg-red-500/10">
                          Disconnect
                        </button>
                      </div>
                    </>
                  )}
                </div>
                <Link to="/create" className="btn-primary text-[13px]">Create Room</Link>
              </>
            ) : (
              <button onClick={onConnect} disabled={connecting} className="inline-flex h-10 items-center justify-center border border-[#0d0d0b] bg-[#0d0d0b] px-5 text-[13px] font-medium text-[#ede9df] transition hover:bg-transparent hover:text-[#0d0d0b] disabled:opacity-40">
                {connecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </div>
      </div>

      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setMobileOpen(false)} />
          <div className="fixed left-0 right-0 top-[61px] z-40 space-y-4 border-b border-white/[0.08] bg-bond-bg/95 p-6 backdrop-blur-xl md:hidden">
            <a href="#how" onClick={(e) => { scrollToHow(e); setMobileOpen(false) }} className="block text-[14px] font-medium text-bond-muted">How it works</a>
            <Link to="/docs" className="block text-[14px] font-medium text-bond-muted" onClick={() => setMobileOpen(false)}>Docs</Link>
            <Link to="/market" className="block text-[14px] font-medium text-bond-muted" onClick={() => setMobileOpen(false)}>Market</Link>
            {wallet && <Link to="/rooms" className="block text-[14px] font-medium text-bond-muted" onClick={() => setMobileOpen(false)}>Rooms</Link>}
            {wallet && <Link to="/offers" className="block text-[14px] font-medium text-bond-muted" onClick={() => setMobileOpen(false)}>Offers</Link>}
            {isAdmin && <Link to="/arbiter" className="block text-[14px] font-medium text-red-300" onClick={() => setMobileOpen(false)}>Arbiter</Link>}
            <div onClick={() => setMobileOpen(false)}><ThemeToggle /></div>
            {wallet ? (
              <Link to="/create" className="btn-primary block text-center text-[14px]" onClick={() => setMobileOpen(false)}>Create Room</Link>
            ) : (
              <button onClick={() => { onConnect(); setMobileOpen(false) }} disabled={connecting} className="btn-primary w-full">
                {connecting ? 'Connecting…' : 'Connect Wallet'}
              </button>
            )}
          </div>
        </>
      )}
    </nav>
  )
}
