import { Link } from 'react-router-dom'

export default function AppBackToLanding() {
  return (
    <Link
      to="/"
      aria-label="Back to landing"
      className="inline-flex h-10 w-10 items-center justify-center border border-[#ede9df]/14 bg-transparent text-[#ede9df]/72 transition hover:border-[#ede9df]/28 hover:text-[#ede9df] active:scale-[0.97]"
    >
      <span className="text-[22px] leading-none tracking-tight" aria-hidden="true">
        ‹
      </span>
    </Link>
  )
}
