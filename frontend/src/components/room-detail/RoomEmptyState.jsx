import { Link } from 'react-router-dom'

/**
 * Empty / gate card for /room/:id.
 * Always exposes Connect when disconnected — Navbar hides chrome on bare /room without wallet.
 */
export default function RoomEmptyState({ wallet, status, connecting, onConnect }) {
  const needsWallet = !wallet

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] place-items-center pb-4">
        <div className="w-full max-w-[520px] border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center">
          <div
            className={`font-mono text-[10px] uppercase tracking-[0.22em] ${
              needsWallet ? 'text-[var(--a-muted)]' : 'text-[#b87333]'
            }`}
          >
            {needsWallet ? 'Wallet required' : 'Room unavailable'}
          </div>
          <h2 className="mt-4 text-[clamp(28px,6vw,34px)] font-medium tracking-[-0.07em] text-[var(--a-ink)]">
            {needsWallet ? 'Connect wallet to act on this room.' : 'Room not found'}
          </h2>
          <p className="mt-3 text-[13px] leading-[1.6] text-[var(--a-muted)]">
            {needsWallet
              ? 'You can still open the invite after connecting. No transaction is sent until you choose an action.'
              : status?.msg || 'This room does not exist or could not be loaded.'}
          </p>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center">
            {needsWallet && typeof onConnect === 'function' && (
              <button
                type="button"
                onClick={onConnect}
                disabled={connecting}
                className="inline-flex h-12 items-center justify-center border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-6 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97] disabled:opacity-50"
              >
                {connecting ? 'Connecting…' : 'Connect wallet'}
              </button>
            )}
            <Link
              to="/"
              className="inline-flex h-12 items-center justify-center border border-[var(--a-line)] px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[var(--a-muted)] transition duration-160 ease-out hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] active:scale-[0.97]"
            >
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
