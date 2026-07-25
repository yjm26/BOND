import { useState, useCallback, useEffect, useRef } from 'react'
import { BrowserRouter, Navigate, Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { createAppKit } from '@reown/appkit/react'
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import ToastContainer from './components/ToastContainer'
import { loadProfile } from './components/app/profile/profileStorage'
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
import { ARC_RPC_URLS } from './utils/contract'

const ARC_TESTNET = {
  id: 5042002,
  name: 'Arc Testnet',
  network: 'arc-testnet',
  nativeCurrency: { name: 'USDC', symbol: 'USDC', decimals: 18 },
  rpcUrls: { default: { http: ARC_RPC_URLS } },
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

function DisconnectRedirect({ tick }) {
  const navigate = useNavigate()
  useEffect(() => {
    if (tick > 0) navigate('/app', { replace: true })
  }, [tick, navigate])
  return null
}

function DisconnectOverlay({ active }) {
  if (!active) return null
  return (
    <div className="fixed inset-0 z-[100] grid place-items-center bg-[#000000]/88 px-6 text-[#fafafa] backdrop-blur-md animate-page-enter">
      <div className="w-full max-w-[420px] border border-[#fafafa]/12 bg-[#111111] p-6 text-center shadow-2xl">
        <div className="mx-auto h-10 w-10 animate-spin rounded-full border border-[#fafafa]/14 border-t-[#a3a3a3]" />
        <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">Closing wallet session</div>
        <p className="mt-3 text-[15px] leading-[1.55] text-[#fafafa]/72">Clearing the workspace and returning to the app gate.</p>
      </div>
    </div>
  )
}

function ProfileRequiredRoute({ wallet, profileReady, children }) {
  if (wallet?.address && profileReady === false) return <Navigate to="/app" replace />
  return children
}

createAppKit({
  projectId: 'af815ce51d40ec33de9699ee550f21a8',
  adapters: [new EthersAdapter()],
  networks: [ARC_TESTNET],
  metadata: {
    name: 'BOND',
    description: 'USDC escrow rooms for internet deals on Arc.',
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
  const [disconnecting, setDisconnecting] = useState(false)
  const [disconnectRedirectTick, setDisconnectRedirectTick] = useState(0)
  const [connectError, setConnectError] = useState(null)
  const [profileReady, setProfileReady] = useState(null)
  const manualDisconnect = useRef(false)
  const walletRef = useRef(null)

  useEffect(() => { walletRef.current = wallet }, [wallet])

  useEffect(() => {
    if (!wallet?.address) {
      setProfileReady(null)
      return
    }
    setProfileReady(Boolean(loadProfile(wallet.address)?.displayName))
  }, [wallet?.address])

  useEffect(() => {
    if (!isConnected || !address) {
      if (walletRef.current && !manualDisconnect.current && localStorage.getItem('bond_wallet_connected') === '1') {
        setConnecting(true)
        const grace = window.setTimeout(() => {
          setWallet(null)
          setConnecting(false)
        }, 3000)
        return () => window.clearTimeout(grace)
      }
      if (!manualDisconnect.current) setWallet(null)
      setConnecting(false)
      return
    }
    if (manualDisconnect.current) {
      manualDisconnect.current = false
      return
    }

    const activeWalletAddress = walletRef.current?.address?.toLowerCase()
    const nextAddress = address.toLowerCase()
    if (activeWalletAddress && activeWalletAddress !== nextAddress) {
      setDisconnecting(true)
      setConnecting(false)
      setConnectError('Wallet changed. Connect again to open a clean BOND session.')
      localStorage.removeItem('bond_wallet_connected')
      resetAuthCache()
      setWallet(null)
      setDisconnectRedirectTick((tick) => tick + 1)
      disconnect().catch((e) => console.error('Wallet switch disconnect failed:', e))
      window.setTimeout(() => setDisconnecting(false), 650)
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
  }, [isConnected, address, walletProvider, disconnect])

  const handleConnect = useCallback(() => openAppKit(), [openAppKit])

  const handleDisconnect = useCallback(async () => {
    manualDisconnect.current = true
    setDisconnecting(true)
    localStorage.removeItem('bond_wallet_connected')
    resetAuthCache()
    try { await disconnect() } catch (e) { console.error('Disconnect failed:', e) }
    window.setTimeout(() => {
      setWallet(null)
      setDisconnectRedirectTick((tick) => tick + 1)
      window.setTimeout(() => setDisconnecting(false), 450)
    }, 450)
  }, [disconnect])

  return (
    <ToastProvider>
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <DisconnectRedirect tick={disconnectRedirectTick} />
      <Navbar onConnect={handleConnect} onDisconnect={handleDisconnect} wallet={wallet} connecting={connecting} profileReady={profileReady} />
      <ErrorBoundary>
      <PageTransition>
      <Routes>
        <Route path="/" element={<LandingPage wallet={wallet} onConnect={handleConnect} />} />
        <Route path="/app" element={<AppPage wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} onProfileStateChange={setProfileReady} />} />
        <Route path="/create" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><CreateRoomPage wallet={wallet} /></ProfileRequiredRoute>} />
        <Route path="/rooms" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><RoomsIndexPage wallet={wallet} /></ProfileRequiredRoute>} />
        <Route path="/room/:id" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><RoomDetailPage wallet={wallet} /></ProfileRequiredRoute>} />
        <Route path="/docs/:section?" element={<DocsPage />} />
        <Route path="/market" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><MarketPage wallet={wallet} /></ProfileRequiredRoute>} />
        <Route path="/offers" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><OffersRedirectPage /></ProfileRequiredRoute>} />
        <Route path="/profile" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><ProfilePage wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} /></ProfileRequiredRoute>} />
        <Route path="/arbiter" element={<ProfileRequiredRoute wallet={wallet} profileReady={profileReady}><ArbiterPage wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} /></ProfileRequiredRoute>} />
      </Routes>
      </PageTransition>
      </ErrorBoundary>
      <RouteFooter />
      <ToastContainer />
      <DisconnectOverlay active={disconnecting} />
    </BrowserRouter>
    </ToastProvider>
  )
}
