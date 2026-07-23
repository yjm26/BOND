import { Link } from 'react-router-dom'

export default function MobileNavMenu({ wallet, isAdmin, connecting, onConnect, onHowClick, onClose }) {
  const linkClass = 'block border-t border-[#0d0d0b]/10 py-3 text-[15px] font-medium text-[#0d0d0b]/72'

  return (
    <>
      <div className="fixed inset-0 z-30 md:hidden" onClick={onClose} />
      <div className="fixed left-0 right-0 top-[61px] z-40 border-b border-[#0d0d0b]/10 bg-[#ede9df]/96 px-6 pb-6 pt-2 shadow-xl backdrop-blur-xl md:hidden">
        <a href="#how" onClick={(e) => { onHowClick(e); onClose() }} className={linkClass}>How it works</a>
        <Link to="/docs" className={linkClass} onClick={onClose}>Docs</Link>
        <Link to="/market" className={linkClass} onClick={onClose}>Market</Link>
        {wallet && <Link to="/rooms" className={linkClass} onClick={onClose}>Rooms</Link>}
        {wallet && <Link to="/offers" className={linkClass} onClick={onClose}>Offers</Link>}
        {isAdmin && <Link to="/arbiter" className={linkClass} onClick={onClose}>Arbiter</Link>}
        <div className="mt-5 border border-[#d8b15f]/25 bg-[#d8b15f]/[0.08] px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#7f6732]">Arc Testnet</div>
        {wallet ? (
          <Link to="/create" className="mt-4 flex h-11 items-center justify-center border border-[#0d0d0b] bg-[#0d0d0b] text-[14px] font-medium text-[#ede9df]" onClick={onClose}>Create room</Link>
        ) : (
          <button onClick={() => { onConnect(); onClose() }} disabled={connecting} className="mt-4 h-11 w-full border border-[#0d0d0b] bg-[#0d0d0b] text-[14px] font-medium text-[#ede9df] disabled:opacity-40">
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </button>
        )}
      </div>
    </>
  )
}
