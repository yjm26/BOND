import { Link } from 'react-router-dom'

export default function HeroCtaGroup({ wallet, onConnect }) {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <Link to="/create" className="inline-flex h-12 items-center justify-center rounded-none border border-[#0d0d0b] bg-[#0d0d0b] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#ede9df] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-transparent hover:text-[#0d0d0b]">
        Create Room
      </Link>
      <Link to="/market" className="inline-flex h-12 items-center justify-center rounded-none border border-[#0d0d0b]/20 bg-transparent px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0d0d0b] transition duration-300 ease-out hover:border-[#0d0d0b] hover:bg-[#0d0d0b]/[0.03]">
        View Market
      </Link>
      {!wallet && (
        <button onClick={onConnect} className="inline-flex h-12 items-center justify-center rounded-none border border-[#0d0d0b]/20 bg-transparent px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0d0d0b] transition duration-300 ease-out hover:border-[#0d0d0b] hover:bg-[#0d0d0b]/[0.03] lg:hidden">
          Connect
        </button>
      )}
    </div>
  )
}
