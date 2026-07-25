import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getContract } from '../utils/contract'
import HeaderBrand from './navbar/HeaderBrand'
import HeaderNavLinks from './navbar/HeaderNavLinks'
import HeaderWalletActions from './navbar/HeaderWalletActions'
import MobileNavMenu from './navbar/MobileNavMenu'

export default function Navbar({ onConnect, wallet, connecting, onDisconnect, profileReady }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const isAppRoute = ['/app', '/market', '/rooms', '/room', '/offers', '/create', '/profile', '/settings', '/arbiter'].some((route) => pathname === route || pathname.startsWith(`${route}/`))
  const isDarkHeader = isAppRoute
  const isDisconnectedAppRoute = isAppRoute && !wallet
  const isProfileSetupLocked = isAppRoute && Boolean(wallet?.address) && profileReady === false
  const hideAppChrome = isDisconnectedAppRoute || isProfileSetupLocked

  useEffect(() => {
    if (!wallet?.address || !wallet?.provider) { setIsAdmin(false); return }
    const contract = getContract(wallet.provider)
    let stale = false
    Promise.all([
      contract.owner().catch(() => ''),
      contract.isArbiter(wallet.address).catch(() => false),
    ]).then(([owner, activeArbiter]) => {
      if (stale) return
      const addr = wallet.address.toLowerCase()
      setIsAdmin(addr === owner.toLowerCase() || activeArbiter)
    }).catch(() => {
      if (!stale) setIsAdmin(false)
    })
    return () => { stale = true }
  }, [wallet?.address, wallet?.provider])

  if (hideAppChrome) return null

  const scrollToSection = (event, sectionId) => {
    event.preventDefault()
    const isHome = window.location.pathname === '/' || window.location.pathname === ''
    if (!isHome) {
      navigate('/')
      setTimeout(() => {
        const el = document.getElementById(sectionId)
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 350)
      return
    }

    const el = document.getElementById(sectionId)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const scrollToHow = (event) => scrollToSection(event, 'how')
  const scrollToUseCases = (event) => scrollToSection(event, 'use-cases')

  return (
    <nav className={`fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6 lg:px-10 ${
      isDarkHeader
        ? 'border-b border-[#ede9df]/12 bg-[#20201f]'
        : 'border-b border-[#0d0d0b]/10 bg-[#ede9df]'
    }`}>
      <div className="flex items-center justify-between">
        <HeaderBrand tone={isDarkHeader ? 'dark' : 'light'} to={isDisconnectedAppRoute ? '/' : (isAppRoute ? '/app' : '/')} hideSubtitle={isDisconnectedAppRoute} bareMark={isDisconnectedAppRoute} />

        {!isDisconnectedAppRoute && <div className="hidden items-center gap-8 md:flex">
          <HeaderNavLinks wallet={wallet} isAdmin={isAdmin} tone={isDarkHeader ? 'dark' : 'light'} mode={isAppRoute ? 'app' : 'landing'} onHowClick={scrollToHow} onUseCasesClick={scrollToUseCases} />
          <HeaderWalletActions
            wallet={wallet}
            isAdmin={isAdmin}
            connecting={connecting}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
            tone={isDarkHeader ? 'dark' : 'light'}
            mode={isAppRoute ? 'app' : 'landing'}
          />
        </div>}

        {!isDisconnectedAppRoute && <button
          className={`flex h-9 w-9 items-center justify-center border md:hidden ${
            isDarkHeader
              ? 'border-[#ede9df]/16 bg-[#ede9df]/8 text-[#ede9df]'
              : 'border-[#0d0d0b]/14 bg-[#ede9df]/70 text-[#0d0d0b]'
          }`}
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>}
      </div>

      {mobileOpen && !isDisconnectedAppRoute && (
        <MobileNavMenu
          wallet={wallet}
          isAdmin={isAdmin}
          connecting={connecting}
          onConnect={onConnect}
          onHowClick={scrollToHow}
          onUseCasesClick={scrollToUseCases}
          onClose={() => setMobileOpen(false)}
          tone={isDarkHeader ? 'dark' : 'light'}
          mode={isAppRoute ? 'app' : 'landing'}
        />
      )}
    </nav>
  )
}
