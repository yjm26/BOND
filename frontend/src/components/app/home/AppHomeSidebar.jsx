import { Link } from 'react-router-dom'

export default function AppHomeSidebar({ actions, wallet }) {
  return (
    <aside className="hidden border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-4 lg:block lg:min-h-[calc(100vh-88px-1.5rem)]">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted,#a3a3a3)]">BOND App</div>
      <div className="mt-6 space-y-1">
        {actions.map((item) => (
          <Link
            key={item.label}
            to={item.to}
            className="flex h-10 items-center justify-between border border-transparent px-3 text-[13px] text-[var(--a-ink,#fafafa)]/62 transition duration-160 ease-out hover:border-[var(--a-line)] hover:bg-[var(--a-inverse-bg,#fafafa)]/5 hover:text-[var(--a-ink,#fafafa)] active:scale-[0.99]"
          >
            {item.label}
            <span className="text-[var(--a-ink,#fafafa)]/24">→</span>
          </Link>
        ))}
      </div>
      <div className="mt-8 border-t border-[var(--a-line)] pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[var(--a-ink,#fafafa)]/40">
        Wallet<br />
        <span className="text-[var(--a-ink,#fafafa)]/78">
          {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
        </span>
      </div>
    </aside>
  )
}
