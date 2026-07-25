import { Link } from 'react-router-dom'
import { visibleAppActions } from '../appHomeData'
import useDisputeAccess from '../useDisputeAccess'
import { formatAddress } from '../../../utils/constants'

export default function ProfileSidebar({ wallet }) {
  const actions = visibleAppActions(useDisputeAccess(wallet))

  return (
    <aside className="hidden border border-[var(--a-line)] bg-[var(--a-surface)] p-4 lg:block">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">BOND App</div>
      <div className="mt-6 space-y-1">
        {actions.map((item) => (
          <Link key={item.label} to={item.to} className={`flex h-10 items-center justify-between border px-3 text-[13px] transition ${item.label === 'Profile' ? 'border-[var(--a-line)] bg-[var(--a-inverse-bg)]/6 text-[var(--a-ink)]' : 'border-transparent text-[var(--a-ink)]/62 hover:border-[var(--a-line)] hover:bg-[var(--a-inverse-bg)]/5 hover:text-[var(--a-ink)]'}`}>
            {item.label}<span className="text-[var(--a-ink)]/24">→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t border-[var(--a-line)] pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[var(--a-ink)]/40">
        Wallet<br />
        <span className="text-[var(--a-ink)]/78">{wallet?.address ? formatAddress(wallet.address) : 'Not connected'}</span>
      </div>
    </aside>
  )
}
