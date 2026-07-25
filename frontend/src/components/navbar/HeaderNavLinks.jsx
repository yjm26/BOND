import { Link } from 'react-router-dom'

export default function HeaderNavLinks({ wallet, isAdmin, tone = 'light', mode = 'landing', onHowClick, onUseCasesClick }) {
  const dark = tone === 'dark'
  const navLink = dark
    ? 'text-[13px] font-medium tracking-[-0.01em] !text-[#fafafa]/70 transition hover:!text-[#fafafa]'
    : 'text-[13px] font-medium tracking-[-0.01em] !text-[#0a0a0a]/70 transition hover:!text-[#0a0a0a]'

  if (mode === 'app') {
    if (!wallet) {
      return (
        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className={navLink}>Back to home</Link>
        </div>
      )
    }

    return (
      <div className="hidden items-center gap-6 md:flex">
        <Link to="/market" className={navLink}>Market</Link>
        <Link to="/rooms" className={navLink}>My rooms</Link>
        <Link to="/create" className={navLink}>Create room</Link>
        {isAdmin && <Link to="/arbiter" className={navLink}>Disputes</Link>}
        <Link to="/profile" className={navLink}>Profile</Link>
      </div>
    )
  }

  return (
    <div className="hidden items-center gap-6 md:flex">
      <a href="#how" onClick={onHowClick} className={navLink}>Room states</a>
      <a href="#use-cases" onClick={onUseCasesClick} className={navLink}>Where it fits</a>
      <Link to="/market" className={navLink}>Market</Link>
      <Link to="/docs" className={navLink}>Docs</Link>
      {isAdmin && <Link to="/arbiter" className="text-[13px] font-medium text-[#b87333] transition hover:text-[#a3a3a3]">Disputes</Link>}
    </div>
  )
}
