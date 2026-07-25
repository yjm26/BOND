import { Link } from 'react-router-dom'

export default function ArbiterGate({ role, loadingRole, error }) {
  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[var(--a-line)] bg-[var(--a-panel)] font-mono text-[13px] text-[var(--a-muted)]">!</div>
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--a-muted)]">Dispute desk</div>
      <h1 className="mt-4 text-[clamp(34px,5vw,60px)] font-medium leading-[0.94] tracking-[-0.08em] text-[var(--a-ink)]">
        {loadingRole ? 'Checking access.' : 'Arbiter access required.'}
      </h1>
      <p className="mx-auto mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[var(--a-muted)]">
        {loadingRole ? 'Reading owner and arbiter status from the Bond contract.' : 'Only wallets with Role Owner or Role Arbiter can review disputed rooms and send resolution transactions.'}
      </p>
      {error && <div className="mx-auto mt-5 max-w-[560px] border border-[#b87333]/35 bg-[#b87333]/10 px-4 py-3 text-[13px] text-[#b87333]">{error}</div>}
      {!loadingRole && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/profile" className="h-11 border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Open profile</Link>
          <Link to="/rooms" className="h-11 border border-[var(--a-line)] px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)]">My rooms</Link>
        </div>
      )}
      {!loadingRole && role && <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/36">Current role: <span className="text-[var(--a-ink)]">{role}</span></div>}
    </div>
  )
}
