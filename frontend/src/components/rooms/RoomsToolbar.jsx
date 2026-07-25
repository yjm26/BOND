import { Link } from 'react-router-dom'

export default function RoomsToolbar({ wallet, isRefreshing }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--a-muted,#a3a3a3)]">My rooms</div>
        {isRefreshing && <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">Syncing</span>}
      </div>
      {wallet && <Link to="/create" className="h-10 border border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] px-4 pt-[13px] text-center font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[var(--a-ink,#fafafa)]">New room</Link>}
    </div>
  )
}
