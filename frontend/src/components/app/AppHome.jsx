import { Link } from 'react-router-dom'
import AppActionCard from './AppActionCard'
import { APP_ACTIONS } from './appHomeData'

export default function AppHome({ wallet, profile }) {
  const name = profile?.displayName || 'BOND member'

  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <aside className="hidden border border-[#ede9df]/10 bg-[#20201f] p-4 lg:block">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">BOND App</div>
          <div className="mt-6 space-y-1">
            {APP_ACTIONS.map((item) => (
              <Link key={item.label} to={item.to} className="flex h-10 items-center justify-between border border-transparent px-3 text-[13px] text-[#ede9df]/62 transition hover:border-[#ede9df]/10 hover:bg-[#ede9df]/5 hover:text-[#ede9df]">
                {item.label}
                <span className="text-[#ede9df]/24">→</span>
              </Link>
            ))}
          </div>
          <div className="mt-8 border-t border-[#ede9df]/10 pt-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.14em] text-[#ede9df]/40">
            Wallet<br />
            <span className="text-[#ede9df]/78">{wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}</span>
          </div>
        </aside>

        <main className="overflow-hidden border border-[#ede9df]/10 bg-[#111110]">
          <div className="border-b border-[#ede9df]/10 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">Workspace ready</div>
                <h1 className="mt-4 max-w-[780px] text-[clamp(42px,6vw,86px)] font-medium leading-[0.9] tracking-[-0.08em]">
                  Good to see you, {name}.
                </h1>
              </div>
              <Link to="/create" className="inline-flex h-11 w-fit items-center justify-center border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">
                Create room
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-[1.2fr_0.8fr] lg:p-6">
            <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/42">Next useful action</div>
                <span className="h-2 w-2 rounded-full bg-[#b7c8a3]" />
              </div>
              <h2 className="mt-16 max-w-[520px] text-[34px] font-medium leading-[0.96] tracking-[-0.06em] sm:text-[44px]">
                Create, inspect, or settle rooms from one app surface.
              </h2>
              <p className="mt-5 max-w-[560px] text-[15px] leading-[1.65] text-[#b9b2a5]">
                Market, rooms, offers, profile, and settings live here. Wallet connection is already established before value-moving actions appear.
              </p>
            </div>

            <div className="grid gap-4">
              <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/42">Profile</div>
                <div className="mt-8 text-[28px] font-medium tracking-[-0.05em]">{name}</div>
                <div className="mt-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[#ede9df]/46">Default role: {profile?.defaultRole || 'buyer'}</div>
              </div>
              <div className="border border-[#d8b15f]/20 bg-[#d8b15f]/[0.08] p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Arc Testnet</div>
                <p className="mt-4 text-[14px] leading-[1.6] text-[#ede9df]/72">Actions here are prepared for the testnet app. Funds should only move through explicit room states.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-px bg-[#ede9df]/10 p-px md:grid-cols-2 xl:grid-cols-5">
            {APP_ACTIONS.map((item, index) => (
              <AppActionCard key={item.label} item={item} index={index} />
            ))}
          </div>
        </main>
      </div>
    </section>
  )
}
