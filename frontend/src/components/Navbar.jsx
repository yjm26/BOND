import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAppThemeRouteSync, useTheme } from '../contexts/ThemeContext'
import { getContract } from '../utils/contract'
import HeaderBrand from './navbar/HeaderBrand'
import HeaderNavLinks from './navbar/HeaderNavLinks'
import HeaderWalletActions from './navbar/HeaderWalletActions'
import MobileNavMenu from './navbar/MobileNavMenu'
import ThemeToggle from './navbar/ThemeToggle'

const APP_SHELL_PREFIXES = ['/app', '/rooms', '/room', '/offers', '/create', '/profile', '/settings', '/arbiter']

export default function Navbar({ onConnect, wallet, connecting, onDisconnect, profileReady }) {
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const { isDark } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const inWorkspace = Boolean(wallet?.address && profileReady === true)
  const onMarket = pathname === '/market' || pathname.startsWith('/market/')
  const isAppShellRoute =
    APP_SHELL_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
    (onMarket && inWorkspace)

  useAppThemeRouteSync(isAppShellRoute)

  // Landing always light chrome. App chrome follows theme (light app = landing paper).
  const isDarkHeader = isAppShellRoute ? isDark : false
  const isDisconnectedAppRoute = isAppShellRoute && !wallet
  const isProfileSetupLocked = isAppShellRoute && Boolean(wallet?.address) && profileReady === false
  const hideAppChrome = isDisconnectedAppRoute || isProfileSetupLocked

  useEffect(() => {
    if (!wallet?.address || !wallet?.provider) {
      setIsAdmin(false)
      return undefined
    }
    const contract = getContract(wallet.provider)
    let stale = false
    Promise.all([
      contract.owner().catch(() => ''),
      contract.isArbiter(wallet.address).catch(() => false),
    ])
      .then(([owner, activeArbiter]) => {
        if (stale) return
        const addr = wallet.address.toLowerCase()
        setIsAdmin(addr === owner.toLowerCase() || activeArbiter)
      })
      .catch(() => {
        if (!stale) setIsAdmin(false)
      })
    return () => {
      stale = true
    }
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

  const scrollToMarket = (event) => scrollToSection(event, 'market')
  const headerTone = isDarkHeader ? 'dark' : 'light'
  const navMode = isAppShellRoute ? 'app' : 'landing'

  return (
    <nav
      className={`fixed inset-x-0 top-0 z-50 px-4 py-3 sm:px-6 lg:px-10 ${
        isDarkHeader
          ? 'border-b border-[#fafafa]/12 bg-[#111111]'
          : 'border-b border-[#0a0a0a]/10 bg-[#fafafa]'
      }`}
    >
      <div className="flex items-center justify-between">
        <HeaderBrand
          tone={headerTone}
          to={isDisconnectedAppRoute ? '/' : isAppShellRoute ? '/app' : '/'}
          hideSubtitle={isDisconnectedAppRoute}
          bareMark={isDisconnectedAppRoute}
        />

        {!isDisconnectedAppRoute && (
          <div className="hidden items-center gap-8 md:flex">
            <HeaderNavLinks
              wallet={wallet}
              isAdmin={isAdmin}
              tone={headerTone}
              mode={navMode}
              onMarketClick={scrollToMarket}
            />
            <div className="flex items-center gap-3">
              {isAppShellRoute && <ThemeToggle tone={headerTone} />}
              <HeaderWalletActions
                wallet={wallet}
                isAdmin={isAdmin}
                connecting={connecting}
                onConnect={onConnect}
                onDisconnect={onDisconnect}
                tone={headerTone}
                mode={navMode}
              />
            </div>
          </div>
        )}

        {!isDisconnectedAppRoute && (
          <div className="flex items-center gap-2 md:hidden">
            {isAppShellRoute && <ThemeToggle tone={headerTone} />}
            <button
              className={`flex h-9 w-9 items-center justify-center border ${
                isDarkHeader
                  ? 'border-[#fafafa]/16 bg-[#fafafa]/8 text-[#fafafa]'
                  : 'border-[#0a0a0a]/14 bg-[#fafafa]/70 text-[#0a0a0a]'
              }`}
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Open navigation"
              aria-expanded={mobileOpen}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'}
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          </div>
        )}
      </div>

      {mobileOpen && !isDisconnectedAppRoute && (
        <MobileNavMenu
          wallet={wallet}
          isAdmin={isAdmin}
          connecting={connecting}
          onConnect={onConnect}
          onMarketClick={scrollToMarket}
          onClose={() => setMobileOpen(false)}
          tone={headerTone}
          mode={navMode}
        />
      )}
    </nav>
  )
}
