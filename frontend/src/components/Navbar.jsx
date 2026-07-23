import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getContract } from '../utils/contract'
import HeaderBrand from './navbar/HeaderBrand'
import HeaderNavLinks from './navbar/HeaderNavLinks'
import HeaderWalletActions from './navbar/HeaderWalletActions'
import MobileNavMenu from './navbar/MobileNavMenu'

export default function Navbar({ onConnect, wallet, connecting, onDisconnect }) {
  const navigate = useNavigate()
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
    <nav className="fixed inset-x-0 top-0 z-50 border-b border-[#0d0d0b]/10 bg-[#ede9df]/88 px-4 py-3 backdrop-blur-xl sm:px-6 lg:px-10">
      <div className="flex items-center justify-between">
        <HeaderBrand />

        <div className="hidden items-center gap-8 md:flex">
          <HeaderNavLinks wallet={wallet} isAdmin={isAdmin} onHowClick={scrollToHow} onUseCasesClick={scrollToUseCases} />
          <HeaderWalletActions
            wallet={wallet}
            isAdmin={isAdmin}
            connecting={connecting}
            onConnect={onConnect}
            onDisconnect={onDisconnect}
          />
        </div>

        <button
          className="flex h-9 w-9 items-center justify-center border border-[#0d0d0b]/14 bg-[#ede9df]/70 text-[#0d0d0b] md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Open navigation"
          aria-expanded={mobileOpen}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d={mobileOpen ? 'M6 6l12 12M18 6L6 18' : 'M4 7h16M4 12h16M4 17h16'} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <MobileNavMenu
          wallet={wallet}
          isAdmin={isAdmin}
          connecting={connecting}
          onConnect={onConnect}
          onHowClick={scrollToHow}
          onUseCasesClick={scrollToUseCases}
          onClose={() => setMobileOpen(false)}
        />
      )}
    </nav>
  )
}
