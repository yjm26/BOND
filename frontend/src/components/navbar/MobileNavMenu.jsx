import { Link } from 'react-router-dom'

export default function MobileNavMenu({ wallet, isAdmin, tone = 'light', onHowClick, onUseCasesClick, onClose }) {
  const dark = tone === 'dark'
  const linkClass = dark
    ? 'block border-t border-[#ede9df]/10 py-3 text-[15px] font-medium !text-[#ede9df]/74'
    : 'block border-t border-[#0d0d0b]/10 py-3 text-[15px] font-medium !text-[#0d0d0b]/72'

  return (
    <>
      <div className="fixed inset-0 z-30 md:hidden" onClick={onClose} />
      <div className={`fixed left-0 right-0 top-[61px] z-40 border-b px-6 pb-6 pt-2 shadow-xl md:hidden ${
        dark
          ? 'border-[#ede9df]/10 bg-[#20201f]'
          : 'border-[#0d0d0b]/10 bg-[#ede9df]'
      }`}>
        <a href="#how" onClick={(e) => { onHowClick(e); onClose() }} className={linkClass}>How it works</a>
        <a href="#use-cases" onClick={(e) => { onUseCasesClick(e); onClose() }} className={linkClass}>Use cases</a>
        <Link to="/docs" className={linkClass} onClick={onClose}>Docs</Link>
        {wallet && <Link to="/rooms" className={linkClass} onClick={onClose}>Rooms</Link>}
        {wallet && <Link to="/offers" className={linkClass} onClick={onClose}>Offers</Link>}
        {isAdmin && <Link to="/arbiter" className={linkClass} onClick={onClose}>Arbiter</Link>}
        <div className={`mt-5 border px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] ${
          dark
            ? 'border-[#d8b15f]/25 bg-[#d8b15f]/[0.08] text-[#d8b15f]'
            : 'border-[#d8b15f]/25 bg-[#d8b15f]/[0.08] text-[#7f6732]'
        }`}>Arc Testnet</div>
        <Link to={wallet ? '/create' : '/app'} className={`mt-4 flex h-11 items-center justify-center border text-[14px] font-medium ${
          dark
            ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]'
            : 'border-[#0d0d0b] bg-[#0d0d0b] text-[#ede9df]'
        }`} onClick={onClose}>
          {wallet ? 'Create room' : 'Go to app'}
        </Link>
      </div>
    </>
  )
}
