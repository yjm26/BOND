import { Link } from 'react-router-dom'

export default function AppBackToLanding() {
  return (
    <Link
      to="/"
      aria-label="Back to landing"
      className="inline-flex h-10 w-10 items-center justify-center border border-[#fafafa]/14 bg-transparent text-[#fafafa]/72 transition hover:border-[#fafafa]/28 hover:text-[#fafafa] active:scale-[0.97]"
    >
      <span className="text-[22px] leading-none tracking-tight" aria-hidden="true">
        ‹
      </span>
    </Link>
  )
}
