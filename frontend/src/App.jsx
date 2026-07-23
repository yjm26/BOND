import { useState, useCallback, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { createAppKit } from '@reown/appkit/react'
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/ToastContainer'
import AppPage from './pages/AppPage'
import ArbiterPage from './pages/ArbiterPage'
import CreateRoomPage from './pages/CreateRoomPage'
import DocsPage from './pages/DocsPage'
import LandingPage from './pages/LandingPage'
import MarketPage from './pages/MarketPage'
import OffersRedirectPage from './pages/OffersRedirectPage'
import ProfilePage from './pages/ProfilePage'
import RoomDetailPage from './pages/RoomDetailPage'
import RoomsIndexPage from './pages/RoomsIndexPage'
import { ToastProvider } from './contexts/ToastContext'
import { reconnectWallet } from './lib/wallet'
import { resetAuthCache } from './lib/api'

const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ['https://rpc.testnet.arc.network'] } },
  blockExplorers: { default: { name: 'ArcScan', url: 'https://testnet.arcscan.app' } },
  testnet: true,
}

function PageTransition({ children }) {
  const { pathname } = useLocation()
  return (
    <main key={pathname} className="animate-page-enter">
      {children}
    </main>
  )
}

function RouteFooter() {
  const { pathname } = useLocation()
  const showFooter = pathname === '/' || pathname.startsWith('/docs')
  return showFooter ? <Footer /> : null
}

createAppKit({
  projectId: 'af815ce51d40ec33de9699ee550f21a8',
  adapters: [new EthersAdapter()],
  networks: [ARC_TESTNET],
  metadata: {
    name: 'BOND',
    description: 'Trustless USDC escrow on Arc Network',
    url: typeof window !== 'undefined' ? window.location.origin : '',
    icons: ['https://avatars.githubusercontent.com/u/179229932'],
  },
  features: { analytics: false },
})

export default function App() {
  const { address, isConnected } = useAppKitAccount()
  const { walletProvider } = useAppKitProvider('eip155')
  const { open: openAppKit } = useAppKit()
  const { disconnect } = useDisconnect()

  const [wallet, setWallet] = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [connectError, setConnectError] = useState(null)
  const manualDisconnect = useRef(false)

  useEffect(() => {
    if (!isConnected || !address) {
      setWallet(null)
      return
    }
    if (manualDisconnect.current) {
      manualDisconnect.current = false
      return
    }
    let cancelled = false
    ;(async () => {
      setConnecting(true)
      setConnectError(null)
      try {
        const w = await reconnectWallet(walletProvider)
        if (!cancelled) {
          w.walletProvider = walletProvider // raw provider for SIWE signing
          setWallet(w)
          localStorage.setItem('bond_wallet_connected', '1')
        }
      } catch (e) {
        console.error('Wallet build failed:', e)
        if (!cancelled) setConnectError(e.message)
      } finally {
        if (!cancelled) setConnecting(false)
      }
    })()
    return () => { cancelled = true }
  }, [isConnected, address, walletProvider])

  const handleConnect = useCallback(() => openAppKit(), [openAppKit])

  const handleDisconnect = useCallback(async () => {
    manualDisconnect.current = true
    setWallet(null)
    localStorage.removeItem('bond_wallet_connected')
    resetAuthCache()
    try { await disconnect() } catch (e) { console.error('Disconnect failed:', e) }
  }, [disconnect])

  return (
    <ToastProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Navbar onConnect={handleConnect} onDisconnect={handleDisconnect} wallet={wallet} connecting={connecting} />
      <ErrorBoundary>
      <PageTransition>
      <Routes>
        <Route path="/" element={<LandingPage wallet={wallet} onConnect={handleConnect} />} />
        <Route path="/app" element={<AppPage wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} />} />
        <Route path="/create" element={<CreateRoomPage wallet={wallet} />} />
        <Route path="/rooms" element={<RoomsIndexPage wallet={wallet} />} />
        <Route path="/room/:id" element={<RoomDetailPage wallet={wallet} />} />
        <Route path="/docs/:section?" element={<DocsPage />} />
        <Route path="/market" element={<MarketPage wallet={wallet} />} />
        <Route path="/offers" element={<OffersRedirectPage />} />
        <Route path="/profile" element={<ProfilePage wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} />} />
        <Route path="/arbiter" element={<ArbiterPage wallet={wallet} />} />
      </Routes>
      </PageTransition>
      </ErrorBoundary>
      <RouteFooter />
      <ToastContainer />
    </BrowserRouter>
    </ToastProvider>
  )
}
