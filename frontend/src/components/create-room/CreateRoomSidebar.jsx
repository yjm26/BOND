import { Link } from 'react-router-dom'
import { visibleAppActions } from '../app/appHomeData'
import useDisputeAccess from '../app/useDisputeAccess'
import { formatAddress } from '../../utils/constants'

export default function CreateRoomSidebar({ wallet }) {
  const actions = visibleAppActions(useDisputeAccess(wallet))

  return (
    <aside className="hidden border border-[#ede9df]/10 bg-[#20201f] p-4 lg:block">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">BOND App</div>
      <div className="mt-6 space-y-1">
        {actions.map((item) => (
          <Link key={item.label} to={item.to} className={`flex h-10 items-center justify-between border px-3 text-[13px] transition ${item.label === 'Create room' ? 'border-[#ede9df]/12 bg-[#ede9df]/6 text-[#ede9df]' : 'border-transparent text-[#ede9df]/62 hover:border-[#ede9df]/10 hover:bg-[#ede9df]/5 hover:text-[#ede9df]'}`}>
            {item.label}<span className="text-[#ede9df]/24">→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t border-[#ede9df]/10 pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[#ede9df]/40">
        Wallet<br />
        <span className="text-[#ede9df]/78">{wallet?.address ? formatAddress(wallet.address) : 'Not connected'}</span>
      </div>
    </aside>
  )
}
