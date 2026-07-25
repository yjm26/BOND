import { Link } from 'react-router-dom'

export default function AppHomeSidebar({ actions, wallet }) {
  return (
    <aside className="hidden border border-[#ede9df]/10 bg-[#20201f] p-4 lg:block lg:min-h-[calc(100vh-88px-1.5rem)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">BOND App</div>
      <div className="mt-6 space-y-1">
        {actions.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex h-10 items-center justify-between border border-transparent px-3 text-[13px] text-[#ede9df]/62 transition duration-160 ease-out hover:border-[#ede9df]/10 hover:bg-[#ede9df]/5 hover:text-[#ede9df] active:scale-[0.99]"
          >
            {item.label}
            <span className="text-[#ede9df]/24">→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t border-[#ede9df]/10 pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[#ede9df]/40">
        Wallet<br />
        <span className="text-[#ede9df]/78">
          {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
        </span>
      </div>
    </aside>
  )
}
