import { Link } from 'react-router-dom'

export default function HeaderBrand({ tone = 'light', to = '/', hideSubtitle = false, bareMark = false }) {
  const dark = tone === 'dark'
  const subtitle = dark ? 'Deal rooms' : 'Escrow rooms on Arc'
  const logoSrc = dark ? '/brand/bond-logo-white.png' : '/brand/bond-logo-black.png'
  const markClass = bareMark || dark
    ? 'flex h-8 w-10 items-center justify-center transition'
    : `flex h-8 w-10 items-center justify-center border transition ${
      'border-[#0a0a0a]/12 bg-[#fafafa]'
    }`

  return (
    <Link to={to} className="group inline-flex items-center gap-3">
      <span className={markClass}>
        <img src={logoSrc} alt="BOND" className="w-8 object-contain" draggable="false" />
      </span>
      <span>
        <span className={`block text-[15px] font-semibold tracking-[-0.03em] ${dark ? 'text-[#fafafa]' : 'text-[#0a0a0a]'}`}>BOND</span>
        {!hideSubtitle && <span className={`hidden font-mono text-[9px] uppercase tracking-[0.22em] sm:block ${dark ? 'text-[#fafafa]/56' : 'text-[#0a0a0a]/55'}`}>{subtitle}</span>}
      </span>
    </Link>
  )
}
