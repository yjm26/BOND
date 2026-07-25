import { Link } from 'react-router-dom'

export default function MobileNavMenu({
  wallet,
  isAdmin,
  tone = 'light',
  mode = 'landing',
  connecting,
  onConnect,
  onClose,
}) {
  const dark = tone === 'dark'
  const linkClass = dark
    ? 'block border-t border-[#fafafa]/10 py-3 text-[15px] font-medium !text-[#fafafa]/74'
    : 'block border-t border-[#0a0a0a]/10 py-3 text-[15px] font-medium !text-[#0a0a0a]/72'
  const primaryClass = dark
    ? 'border-[#fafafa] bg-[#fafafa] text-[var(--a-inverse-ink)]'
    : 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]'

  const connectAndClose = () => {
    onConnect?.()
    onClose()
  }

  return (
    <>
      <div className="fixed inset-0 z-30 md:hidden" onClick={onClose} />
      <div
        className={`fixed left-0 right-0 top-[61px] z-40 border-b px-6 pb-6 pt-2 shadow-xl md:hidden ${
          dark ? 'border-[#fafafa]/10 bg-[#111111]' : 'border-[#0a0a0a]/10 bg-[#fafafa]'
        }`}
      >
        {mode === 'app' ? (
          wallet ? (
            <>
              <Link to="/market" className={linkClass} onClick={onClose}>
                Market
              </Link>
              <Link to="/rooms" className={linkClass} onClick={onClose}>
                My rooms
              </Link>
              <Link to="/create" className={linkClass} onClick={onClose}>
                Create room
              </Link>
              {isAdmin && (
                <Link to="/arbiter" className={linkClass} onClick={onClose}>
                  Disputes
                </Link>
              )}
              <Link to="/profile" className={linkClass} onClick={onClose}>
                Profile
              </Link>
            </>
          ) : (
            <Link to="/" className={linkClass} onClick={onClose}>
              Back to home
            </Link>
          )
        ) : (
          <>
            <Link to="/market" className={linkClass} onClick={onClose}>
              Market
            </Link>
            <Link to="/docs" className={linkClass} onClick={onClose}>
              Docs
            </Link>
            <Link to="/app" className={linkClass} onClick={onClose}>
              App
            </Link>
          </>
        )}
        {isAdmin && mode !== 'app' && (
          <Link to="/arbiter" className={linkClass} onClick={onClose}>
            Disputes
          </Link>
        )}
        <div
          className={`mt-5 border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
            dark
              ? 'border-[#fafafa]/14 bg-[#0a0a0a] text-[#fafafa]/55'
              : 'border-[#0a0a0a]/12 bg-white text-[#0a0a0a]/55'
          }`}
        >
          Build on Arc
        </div>
        {mode === 'landing' ? (
          <Link
            to="/app"
            onClick={onClose}
            className={`mt-3 flex w-full items-center justify-center border px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-160 ease-out active:scale-[0.97] ${primaryClass}`}
          >
            Go to app
          </Link>
        ) : !wallet ? (
          <button
            type="button"
            onClick={connectAndClose}
            disabled={connecting}
            className={`mt-3 flex w-full items-center justify-center border px-4 py-3 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-160 ease-out active:scale-[0.97] disabled:opacity-40 ${primaryClass}`}
          >
            {connecting ? 'Connecting…' : 'Connect wallet'}
          </button>
        ) : null}
      </div>
    </>
  )
}
