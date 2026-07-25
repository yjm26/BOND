import { Link } from 'react-router-dom'
import { APP_ACTIONS } from '../app/appHomeData'
import { formatAddress } from '../../utils/constants'

export default function ArbiterSidebar({ wallet, role }) {
  const actions = APP_ACTIONS
  return (
    <aside className="hidden border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-4 lg:block">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted,#a3a3a3)]">BOND App</div>
      <div className="mt-6 space-y-1">
        {actions.map((item) => (
          <Link key={item.label} to={item.to} className={`flex h-10 items-center justify-between border px-3 text-[13px] transition ${item.label === 'Disputes' ? 'border-[var(--a-line)] bg-[var(--a-inverse-bg,#fafafa)]/6 text-[var(--a-ink,#fafafa)]' : 'border-transparent text-[var(--a-ink,#fafafa)]/62 hover:border-[var(--a-line)] hover:bg-[var(--a-inverse-bg,#fafafa)]/5 hover:text-[var(--a-ink,#fafafa)]'}`}>
            {item.label}<span className="text-[var(--a-ink,#fafafa)]/24">→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t border-[var(--a-line)] pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[var(--a-ink,#fafafa)]/40">
        Wallet<br />
        <span className="text-[var(--a-ink,#fafafa)]/78">{wallet?.address ? formatAddress(wallet.address) : 'Not connected'}</span><br />
        Role<br />
        <span className="text-[var(--a-muted,#a3a3a3)]">{role || 'Checking'}</span>
      </div>
    </aside>
  )
}
