import { Link } from 'react-router-dom'
import { visibleAppActions } from '../app/appHomeData'
import useDisputeAccess from '../app/useDisputeAccess'
import { formatAddress } from './marketUtils'

export default function MarketSidebar({ wallet }) {
  const actions = visibleAppActions(useDisputeAccess(wallet))

  return (
    <aside className="hidden border border-[#fafafa]/10 bg-[#111111] p-4 lg:block">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">BOND App</div>
      <div className="mt-6 space-y-1">
        {actions.map((item) => (
          <Link key={item.label} to={item.to} className={`flex h-10 items-center justify-between border px-3 text-[13px] transition ${item.label === 'Market' ? 'border-[#fafafa]/12 bg-[#fafafa]/6 text-[#fafafa]' : 'border-transparent text-[#fafafa]/62 hover:border-[#fafafa]/10 hover:bg-[#fafafa]/5 hover:text-[#fafafa]'}`}>
            {item.label}<span className="text-[#fafafa]/24">→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t border-[#fafafa]/10 pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[#fafafa]/40">
        Wallet<br />
        <span className="text-[#fafafa]/78">{wallet?.address ? formatAddress(wallet.address) : 'Not connected'}</span>
      </div>
    </aside>
  )
}
