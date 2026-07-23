import { Link } from 'react-router-dom'

export default function HeaderNavLinks({ wallet, isAdmin, onHowClick, onUseCasesClick }) {
  const navLink = 'text-[13px] font-medium tracking-[-0.01em] !text-[#0d0d0b]/70 transition hover:!text-[#0d0d0b]'

  return (
    <div className="hidden items-center gap-6 md:flex">
      <a href="#how" onClick={onHowClick} className={navLink}>How it works</a>
      <a href="#use-cases" onClick={onUseCasesClick} className={navLink}>Use cases</a>
      <Link to="/docs" className={navLink}>Docs</Link>
      {wallet && (
        <>
          <Link to="/rooms" className={navLink}>Rooms</Link>
          <Link to="/offers" className={navLink}>Offers</Link>
        </>
      )}
      {isAdmin && <Link to="/arbiter" className="text-[13px] font-medium text-[#8d2f2f] transition hover:text-[#5f1f1f]">Arbiter</Link>}
    </div>
  )
}
