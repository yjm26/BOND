import { useState, useCallback, useEffect, useRef } from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { createAppKit } from '@reown/appkit/react'
import { useAppKit, useAppKitAccount, useAppKitProvider, useDisconnect } from '@reown/appkit/react'
import { EthersAdapter } from '@reown/appkit-adapter-ethers'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ErrorBoundary from './components/ErrorBoundary'
import Hero from './components/Hero'
import HowItWorks from './components/HowItWorks'
import RoomClaritySection from './components/room-clarity/RoomClaritySection'
import UseCasesSection from './components/use-cases/UseCasesSection'
import AppWorkspace from './components/app/AppWorkspace'
import ProfileSettings from './components/app/ProfileSettings'
import RoomsPage from './components/RoomsPage'
import RoomView from './components/RoomView'
import CreateRoom from './components/CreateRoom'
import Market from './components/Market'
import Offers from './components/Offers'
import Docs from './components/Docs'
import ArbiterDashboard from './components/ArbiterDashboard'
import ToastContainer from './components/ToastContainer'
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
        <Route path="/" element={<><Hero wallet={wallet} onConnect={handleConnect} /><HowItWorks /><RoomClaritySection /><UseCasesSection /></>} />
        <Route path="/app" element={<AppWorkspace wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} />} />
        <Route path="/create" element={<CreateRoom wallet={wallet} />} />
        <Route path="/rooms" element={<RoomsPage wallet={wallet} />} />
        <Route path="/room/:id" element={<RoomView wallet={wallet} />} />
        <Route path="/docs/:section?" element={<Docs />} />
        <Route path="/market" element={<Market wallet={wallet} />} />
        <Route path="/offers" element={<Offers wallet={wallet} />} />
        <Route path="/profile" element={<ProfileSettings wallet={wallet} connecting={connecting} connectError={connectError} onConnect={handleConnect} />} />
        <Route path="/arbiter" element={<ArbiterDashboard wallet={wallet} />} />
      </Routes>
      </PageTransition>
      </ErrorBoundary>
      <RouteFooter />
      <ToastContainer />
    </BrowserRouter>
    </ToastProvider>
  )
}
