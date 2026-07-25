import { Link } from 'react-router-dom'

export default function RoomsEmptyState({ wallet }) {
  return (
    <div className="grid min-h-[280px] place-items-center border border-[var(--a-line)] bg-[var(--a-surface)] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[var(--a-line)] bg-[var(--a-panel)] font-mono text-[18px] text-[color:var(--a-faint)]">□</div>
      <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[var(--a-ink)]">No rooms yet</h3>
      <p className="max-w-[420px] text-[14px] leading-[1.65] text-[var(--a-muted)]">Create your first escrow room to start tracking terms, counterparties, and settlement status.</p>
      {wallet && <Link to="/create" className="mt-6 inline-flex h-11 items-center border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)]">Create room</Link>}
    </div>
  )
}
