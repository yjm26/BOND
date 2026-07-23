import { useState } from 'react'
import { Link } from 'react-router-dom'
import NotificationBell from '../NotificationBell'
import NetworkBadge from './NetworkBadge'

export default function HeaderWalletActions({ wallet, isAdmin, connecting, onConnect, onDisconnect }) {
  const [showWalletMenu, setShowWalletMenu] = useState(false)

  return (
    <div className="hidden items-center gap-3 md:flex">
      <NetworkBadge />
      {wallet ? (
        <>
          <NotificationBell wallet={wallet} />
          <div className="relative">
            <button
              onClick={() => setShowWalletMenu(!showWalletMenu)}
              className="flex h-9 items-center gap-2 border border-[#0d0d0b]/12 bg-[#ede9df]/70 px-3 font-mono text-[12px] text-[#0d0d0b]/70 transition hover:border-[#0d0d0b]/25 hover:text-[#0d0d0b]"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#b7c8a3]" />
              {isAdmin && <span className="bg-[#d8b15f]/22 px-1.5 py-0.5 text-[9px] font-bold tracking-wider text-[#6f5628]">ADMIN</span>}
              <span>{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}</span>
            </button>
            {showWalletMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowWalletMenu(false)} />
                <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden border border-[#0d0d0b]/12 bg-[#ede9df] shadow-xl">
                  <div className="border-b border-[#0d0d0b]/10 px-4 py-3">
                    <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#0d0d0b]/42">Connected</div>
                    <div className="mt-1 font-mono text-[12px] text-[#0d0d0b]">{wallet.address.slice(0, 10)}…{wallet.address.slice(-6)}</div>
                  </div>
                  <a href={`https://testnet.arcscan.app/address/${wallet.address}`} target="_blank" rel="noopener noreferrer" className="block px-4 py-3 text-[13px] text-[#0d0d0b]/68 transition hover:bg-[#0d0d0b]/5 hover:text-[#0d0d0b]">
                    View on Arcscan
                  </a>
                  <button onClick={() => { onDisconnect(); setShowWalletMenu(false) }} className="w-full px-4 py-3 text-left text-[13px] text-[#8d2f2f] transition hover:bg-[#8d2f2f]/8">
                    Disconnect
                  </button>
                </div>
              </>
            )}
          </div>
          <Link to="/create" className="inline-flex h-9 items-center border border-[#0d0d0b] bg-[#0d0d0b] px-4 text-[13px] font-medium text-[#ede9df] transition hover:bg-transparent hover:text-[#0d0d0b]">
            Create room
          </Link>
        </>
      ) : (
        <Link to="/market" className="inline-flex h-9 items-center justify-center border border-[#0d0d0b] bg-[#0d0d0b] px-4 text-[13px] font-medium text-[#ede9df] transition hover:bg-transparent hover:text-[#0d0d0b]">
          Go to app
        </Link>
      )}
    </div>
  )
}
