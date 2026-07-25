import { useNavigate } from 'react-router-dom'

export default function AppBackToLanding() {
  const navigate = useNavigate()

  return (
    <button
      type="button"
      aria-label="Back to landing"
      onClick={() => navigate('/', { replace: false })}
      className="inline-flex h-10 w-10 items-center justify-center border border-[var(--a-line)] bg-transparent text-[color:var(--a-soft)] transition duration-160 ease-out hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)] active:scale-[0.97]"
    >
      <span className="text-[22px] leading-none tracking-tight" aria-hidden="true">
        ‹
      </span>
    </button>
  )
}
