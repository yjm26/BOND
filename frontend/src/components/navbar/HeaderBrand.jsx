import { Link } from 'react-router-dom'

export default function HeaderBrand({ tone = 'light', to = '/' }) {
  const dark = tone === 'dark'

  return (
    <Link to={to} className="group inline-flex items-center gap-3">
      <span className={`flex h-8 w-8 items-center justify-center border font-mono text-[12px] font-semibold transition ${
        dark
          ? 'border-[#ede9df]/20 bg-[#ede9df] text-[#20201f] group-hover:bg-transparent group-hover:text-[#ede9df]'
          : 'border-[#0d0d0b]/18 bg-[#0d0d0b] text-[#ede9df] group-hover:bg-transparent group-hover:text-[#0d0d0b]'
      }`}>
        B
      </span>
      <span>
        <span className={`block text-[15px] font-semibold tracking-[-0.03em] ${dark ? 'text-[#ede9df]' : 'text-[#0d0d0b]'}`}>BOND</span>
        <span className={`hidden font-mono text-[9px] uppercase tracking-[0.22em] sm:block ${dark ? 'text-[#ede9df]/56' : 'text-[#0d0d0b]/55'}`}>{dark ? 'App workspace' : 'Escrow rooms on Arc'}</span>
      </span>
    </Link>
  )
}
