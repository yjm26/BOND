import { Link } from 'react-router-dom'

export default function RoomsToolbar({ wallet, isRefreshing }) {
  return (
    <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">My rooms</div>
        {isRefreshing && <span className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#ede9df]/34">Syncing</span>}
      </div>
      {wallet && <Link to="/create" className="h-10 border border-[#ede9df] bg-[#ede9df] px-4 pt-[13px] text-center font-mono text-[11px] font-semibold uppercase leading-none tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">New room</Link>}
    </div>
  )
}
