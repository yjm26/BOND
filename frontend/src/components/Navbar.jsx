import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useAppThemeRouteSync, useTheme } from '../contexts/ThemeContext'
import { ARC_READ_PROVIDER, getContract } from '../utils/contract'
import HeaderBrand from './navbar/HeaderBrand'
import HeaderNavLinks from './navbar/HeaderNavLinks'
import HeaderWalletActions from './navbar/HeaderWalletActions'
import MobileNavMenu from './navbar/MobileNavMenu'
import ThemeToggle from './navbar/ThemeToggle'

const APP_SHELL_PREFIXES = ['/app', '/rooms', '/room', '/offers', '/create', '/profile', '/settings', '/arbiter']

export default function Navbar({ onConnect, wallet, connecting, onDisconnect, profileReady }) {
  const { pathname } = useLocation()
  const { isDark } = useTheme()
  const [isAdmin, setIsAdmin] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const inWorkspace = Boolean(wallet?.address && profileReady === true)
  const onMarket = pathname === '/market' || pathname.startsWith('/market/')
  const isAppShellRoute =
      APP_SHELL_PREFIXES.some((route) => pathname === route || pathname.startsWith(`${route}/`)) ||
      (onMarket && inWorkspace)
    // Invite links (/room/:id) should keep a minimal header so Connect is always reachable
    const isPublicRoomRoute = pathname.startsWith('/room/')

    useAppThemeRouteSync(isAppShellRoute)

    const isDarkHeader = isAppShellRoute ? isDark : false
    const isDisconnectedAppRoute = isAppShellRoute && !wallet && !isPublicRoomRoute
    const isProfileSetupLocked = isAppShellRoute && Boolean(wallet?.address) && profileReady === false
    const hideAppChrome = isDisconnectedAppRoute || isProfileSetupLocked

  useEffect(() => {
    if (!wallet?.address) {
      setIsAdmin(false)
      return undefined
    }
    const addr = wallet.address
    let stale = false
    const contract = getContract(ARC_READ_PROVIDER)
    Promise.all([
      contract.owner().catch(() => ''),
      contract.isArbiter(addr).catch(() => false),
    ])
      .then(([owner, activeArbiter]) => {
        if (stale) return
        const lower = addr.toLowerCase()
        setIsAdmin((owner && lower === String(owner).toLowerCase()) || Boolean(activeArbiter))
      })
      .catch(() => {
        if (!stale) setIsAdmin(false)
      })
    return () => {
      stale = true
    }
  }, [wallet?.address])

  if (hideAppChrome) return null

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
            <HeaderNavLinks wallet={wallet} isAdmin={isAdmin} tone={headerTone} mode={navMode} />
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
          onClose={() => setMobileOpen(false)}
          tone={headerTone}
          mode={navMode}
        />
      )}
    </nav>
  )
}
