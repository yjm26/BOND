import { Link } from 'react-router-dom'

export default function HeaderBrand({ tone = 'light', to = '/', hideSubtitle = false }) {
  const dark = tone === 'dark'
  const subtitle = dark ? 'Deal rooms' : 'Escrow rooms on Arc'
  const logoSrc = dark ? '/brand/bond-logo-white-64.png' : '/brand/bond-logo-black-64.png'

  return (
    <Link to={to} className="group inline-flex items-center gap-3">
      <span className={`flex h-8 w-8 items-center justify-center border transition ${
        dark ? 'border-[#ede9df]/14 bg-[#111110]' : 'border-[#0d0d0b]/12 bg-[#ede9df]'
      }`}>
        <img src={logoSrc} alt="BOND" className="h-5 w-5 object-contain" draggable="false" />
      </span>
      <span>
        <span className={`block text-[15px] font-semibold tracking-[-0.03em] ${dark ? 'text-[#ede9df]' : 'text-[#0d0d0b]'}`}>BOND</span>
        {!hideSubtitle && <span className={`hidden font-mono text-[9px] uppercase tracking-[0.22em] sm:block ${dark ? 'text-[#ede9df]/56' : 'text-[#0d0d0b]/55'}`}>{subtitle}</span>}
      </span>
    </Link>
  )
}
