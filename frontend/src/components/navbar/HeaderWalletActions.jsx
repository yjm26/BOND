import { useState } from 'react'
import { Link } from 'react-router-dom'
import ConfirmModal from '../ConfirmModal'
import NotificationBell from '../NotificationBell'
import NetworkBadge from './NetworkBadge'

export default function HeaderWalletActions({ wallet, isAdmin, tone = 'light', mode = 'landing', connecting, onConnect, onDisconnect }) {
  const [showWalletMenu, setShowWalletMenu] = useState(false)
  const [confirmDisconnect, setConfirmDisconnect] = useState(false)
  const dark = tone === 'dark'
  const secondaryButton = dark
    ? 'border-[#fafafa]/14 bg-[#fafafa]/8 text-[#fafafa]/72 hover:border-[#fafafa]/28 hover:text-[#fafafa]'
    : 'border-[#0a0a0a]/12 bg-[#fafafa]/70 text-[#0a0a0a]/70 hover:border-[#0a0a0a]/25 hover:text-[#0a0a0a]'
  const primaryButton = dark
    ? 'border-[#fafafa] bg-[#fafafa] text-[#111111] hover:bg-transparent hover:text-[#fafafa] disabled:opacity-50'
    : 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] hover:bg-transparent hover:text-[#0a0a0a] disabled:opacity-50'

  return (
    <div className="hidden items-center gap-3 md:flex">
      <NetworkBadge tone={tone} />
      {wallet ? (
        <>
          <NotificationBell wallet={wallet} />
          <div className="relative">
            <button
              onClick={() => setShowWalletMenu(!showWalletMenu)}
              className={`flex h-9 items-center gap-2 border px-3 font-mono text-[12px] transition ${secondaryButton}`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#8f9a88]" />
              {isAdmin && <span className="bg-[#a3a3a3]/22 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#a3a3a3]">ADMIN</span>}
              <span>{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}</span>
            </button>
            {showWalletMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden border border-[#0a0a0a]/12 bg-[#fafafa] shadow-xl">
                  <div className="border-b border-[#0a0a0a]/10 px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0a0a0a]/42">Connected</div>
                    <div className="mt-1 font-mono text-[12px] text-[#0a0a0a]">{wallet.address.slice(0, 10)}…{wallet.address.slice(-6)}</div>
                  </div>
                  <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[13px] text-[#0a0a0a]/68 transition hover:bg-[#0a0a0a]/5 hover:text-[#0a0a0a]">
                    View on Arcscan
                  </a>
                  <button onClick={() => { setConfirmDisconnect(true); setShowWalletMenu(false) }} className="w-full px-4 py-3 text-left text-[13px] text-[#7f1d1d] transition hover:bg-[#7f1d1d]/8">
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
          <Link to="/create" className={`inline-flex h-9 items-center border px-4 text-[13px] font-medium transition ${primaryButton}`}>
            Create room
          </Link>
        </>
      ) : mode === 'app' ? (
        <button onClick={onConnect} disabled={connecting} className={`inline-flex h-9 items-center justify-center border px-4 text-[13px] font-medium transition ${primaryButton}`}>
          {connecting ? 'Connecting…' : 'Connect wallet'}
        </button>
      ) : (
        <Link to="/app" className={`inline-flex h-9 items-center justify-center border px-4 text-[13px] font-medium transition ${primaryButton}`}>
          Go to app
        </Link>
      )}
      <ConfirmModal
        open={confirmDisconnect}
        tone={tone}
        danger
        eyebrow="Wallet session"
        title="Disconnect this wallet?"
        description="You can reconnect anytime, but BOND will clear the active workspace session and wallet-gated actions will pause."
        confirmLabel="Disconnect"
        cancelLabel="Keep wallet"
        onCancel={() => setConfirmDisconnect(false)}
        onConfirm={() => {
          setConfirmDisconnect(false)
          onDisconnect?.()
        }}
      />
    </div>
  )
}
