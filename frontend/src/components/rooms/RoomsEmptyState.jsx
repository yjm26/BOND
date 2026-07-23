import { Link } from 'react-router-dom'

export default function RoomsEmptyState({ wallet }) {
  return (
    <div className="grid min-h-[280px] place-items-center border border-[#ede9df]/10 bg-[#20201f] p-8 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center border border-[#ede9df]/12 bg-[#111110] font-mono text-[18px] text-[#ede9df]/44">□</div>
      <h3 className="mb-2 text-[26px] font-medium tracking-[-0.06em] text-[#ede9df]">No rooms yet</h3>
      <p className="max-w-[420px] text-[14px] leading-[1.65] text-[#b9b2a5]">Create your first escrow room to start tracking terms, counterparties, and settlement status.</p>
      {wallet && <Link to="/create" className="mt-6 inline-flex h-11 items-center border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Create room</Link>}
    </div>
  )
}
