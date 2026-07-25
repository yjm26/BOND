import { Link } from 'react-router-dom'
import AppHomeActionGrid from './home/AppHomeActionGrid'
import AppHomeProfilePanel from './home/AppHomeProfilePanel'
import AppHomeSidebar from './home/AppHomeSidebar'
import useDisputeAccess from './useDisputeAccess'
import { visibleAppActions } from './appHomeData'

export default function AppHome({ wallet, profile }) {
  const name = profile?.displayName || 'BOND member'
  const canAccessDisputes = useDisputeAccess(wallet)
  const actions = visibleAppActions(canAccessDisputes)

  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <AppHomeSidebar actions={actions} wallet={wallet} />

        <main className="flex min-h-0 flex-col overflow-hidden border border-[#ede9df]/10 bg-[#111110]">
          <div className="border-b border-[#ede9df]/10 p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">Home</div>
                <h1 className="mt-4 max-w-[780px] text-[clamp(42px,6vw,86px)] font-medium leading-[0.9] tracking-[-0.08em]">
                  Good to see you, {name}.
                </h1>
              </div>
              <Link
                to="/create"
                className="inline-flex h-11 w-fit items-center justify-center border border-[#ede9df] bg-[#ede9df] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition duration-160 ease-out hover:bg-transparent hover:text-[#ede9df] active:scale-[0.97]"
              >
                Create room
              </Link>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:p-6">
            <AppHomeProfilePanel profile={profile} name={name} />
            <div className="border border-[#d8b15f]/20 bg-[#d8b15f]/[0.08] p-5 sm:p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Arc Testnet</div>
              <p className="mt-4 max-w-[420px] text-[14px] leading-[1.6] text-[#ede9df]/72">
                Test funds only. Money moves through explicit room actions: fund, release, refund, dispute.
              </p>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/42">
                Wallet {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
              </div>
            </div>
          </div>

          <AppHomeActionGrid actions={actions} />
        </main>
      </div>
    </section>
  )
}
