import { Link } from 'react-router-dom'

export default function CreateRoomSuccess({ result, copied, fromMarket, creatorIsSeller, onCopy }) {
  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] place-items-center pb-4">
        <div className="w-full max-w-[640px] border border-[var(--a-line)] bg-[var(--a-surface)] p-5 sm:p-7">
          <div className="mb-6 border-b border-[var(--a-line)] pb-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#8f9a88]">Room created</div>
            <h2 className="mt-4 text-[44px] font-medium leading-[0.94] tracking-[-0.08em] text-[var(--a-ink)]">
              Share the private invite.
            </h2>
            <p className="mt-3 text-[13px] leading-[1.6] text-[var(--a-muted)]">
              Send the link or code only to your counterparty. Anyone with the code can join while the room is Created.
              Do not post it in public channels.
            </p>
            {fromMarket && !creatorIsSeller && (
              <p className="mt-3 text-[13px] leading-[1.6] text-[var(--a-muted)]">
                The seller may still need the invite link and join code before funds can move.
              </p>
            )}
          </div>
          <div className="grid gap-4">
            <div>
              <div className="mb-1 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">
                Room ID
              </div>
              <div className="font-mono text-[18px] text-[var(--a-ink)]">#{result.roomId}</div>
            </div>
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">
                Join code
              </div>
              <code className="block border border-[var(--a-line)] bg-[var(--a-panel)] px-4 py-3 font-mono text-[22px] font-semibold tracking-[0.18em] text-[#8f9a88]">
                {result.joinCode}
              </code>
            </div>
            <div>
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">
                Invite link
              </div>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={result.inviteLink}
                  className="h-11 min-w-0 flex-1 border border-[var(--a-line)] bg-[var(--a-panel)] px-3 font-mono text-[12px] text-[var(--a-ink)] outline-none"
                />
                <button
                  type="button"
                  onClick={onCopy}
                  className="h-11 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]"
                >
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>
          </div>
          <div className="mt-6 flex flex-col gap-2 sm:flex-row">
            <Link
              to={`/room/${result.roomId}?code=${result.joinCode}`}
              className="flex h-11 flex-1 items-center justify-center border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]"
            >
              Go to room →
            </Link>
            <Link
              to="/rooms"
              className="flex h-11 items-center justify-center border border-[var(--a-line)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]"
            >
              My rooms
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
