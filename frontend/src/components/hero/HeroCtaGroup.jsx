import { Link } from 'react-router-dom'

export default function HeroCtaGroup() {
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <Link to="/app" className="inline-flex h-12 items-center justify-center rounded-none border border-[#0a0a0a] bg-[#0a0a0a] px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-300 ease-out hover:-translate-y-0.5 hover:bg-transparent hover:text-[#0a0a0a]">
        Go to app
      </Link>
      <Link to="/docs" className="inline-flex h-12 items-center justify-center rounded-none border border-[#0a0a0a]/20 bg-transparent px-6 font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition duration-300 ease-out hover:border-[#0a0a0a] hover:bg-[#0a0a0a]/[0.03]">
        Read docs
      </Link>
    </div>
  )
}
