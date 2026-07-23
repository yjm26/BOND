import { Link } from 'react-router-dom'

export default function HeaderBrand() {
  return (
    <Link to="/" className="group inline-flex items-center gap-3">
      <span className="flex h-8 w-8 items-center justify-center border border-[#0d0d0b]/18 bg-[#0d0d0b] font-mono text-[12px] font-semibold text-[#ede9df] transition group-hover:bg-transparent group-hover:text-[#0d0d0b]">
        B
      </span>
      <span>
        <span className="block text-[15px] font-semibold tracking-[-0.03em] text-[#0d0d0b]">BOND</span>
        <span className="hidden font-mono text-[9px] uppercase tracking-[0.22em] text-[#0d0d0b]/55 sm:block">Escrow rooms on Arc</span>
      </span>
    </Link>
  )
}
