import { Link } from 'react-router-dom'

export default function MobileNavMenu({ wallet, isAdmin, tone = 'light', mode = 'landing', connecting, onConnect, onHowClick, onUseCasesClick, onClose }) {
  const dark = tone === 'dark'
  const linkClass = dark
    ? 'block border-t border-[#fafafa]/10 py-3 text-[15px] font-medium !text-[#fafafa]/74'
    : 'block border-t border-[#0a0a0a]/10 py-3 text-[15px] font-medium !text-[#0a0a0a]/72'
  const primaryClass = dark
    ? 'border-[#fafafa] bg-[#fafafa] text-[#111111]'
    : 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]'

  const connectAndClose = () => {
    onConnect?.()
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-30 md:hidden" onClick={onClose} />
      <div className={`fixed left-0 right-0 top-[61px] z-40 border-b px-6 pb-6 pt-2 shadow-xl md:hidden ${
        dark
          ? 'border-[#fafafa]/10 bg-[#111111]'
          : 'border-[#0a0a0a]/10 bg-[#fafafa]'
      }`}>
        {mode === 'app' ? (
          wallet ? (
            <>
              <Link to="/market" className={linkClass} onClick={onClose}>Market</Link>
              <Link to="/rooms" className={linkClass} onClick={onClose}>My rooms</Link>
              {isAdmin && <Link to="/arbiter" className={linkClass} onClick={onClose}>Disputes</Link>}
              <Link to="/profile" className={linkClass} onClick={onClose}>Profile</Link>
              <Link to="/profile" className={linkClass} onClick={onClose}>Settings</Link>
            </>
          ) : (
            <Link to="/" className={linkClass} onClick={onClose}>Back to home</Link>
          )
        ) : (
          <>
            <a href="#how" onClick={(e) => { onHowClick(e); onClose() }} className={linkClass}>Room states</a>
            <a href="#use-cases" onClick={(e) => { onUseCasesClick(e); onClose() }} className={linkClass}>Where it fits</a>
            <Link to="/docs" className={linkClass} onClick={onClose}>Docs</Link>
          </>
        )}
        {isAdmin && mode !== 'app' && <Link to="/arbiter" className={linkClass} onClick={onClose}>Disputes</Link>}
        <div className={`mt-5 border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
          dark
            ? 'border-[#a3a3a3]/25 bg-[#a3a3a3]/[0.08] text-[#a3a3a3]'
            : 'border-[#a3a3a3]/25 bg-[#a3a3a3]/[0.08] text-[#525252]'
        }`}>Arc Testnet</div>
        {wallet ? (
          <Link to="/create" className={`mt-4 flex h-11 items-center justify-center border text-[14px] font-medium ${primaryClass}`} onClick={onClose}>
            Create room
          </Link>
        ) : mode === 'app' ? (
          <button onClick={connectAndClose} disabled={connecting} className={`mt-4 h-11 w-full border text-[14px] font-medium disabled:opacity-50 ${primaryClass}`}>
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </button>
        ) : (
          <Link to="/app" className={`mt-4 flex h-11 items-center justify-center border text-[14px] font-medium ${primaryClass}`} onClick={onClose}>
            Go to app
          </Link>
        )}
      </div>
    </>
  )
}
