import AppHomeActionGrid from './home/AppHomeActionGrid'
import AppHomeOpenRooms from './home/AppHomeOpenRooms'
import AppHomeProfilePanel from './home/AppHomeProfilePanel'
import AppHomeSidebar from './home/AppHomeSidebar'
import useDisputeAccess from './useDisputeAccess'
import { visibleAppActions } from './appHomeData'

export default function AppHome({ wallet, profile }) {
  const name = profile?.displayName || 'BOND member'
  const canAccessDisputes = useDisputeAccess(wallet)
  const actions = visibleAppActions(canAccessDisputes)

  return (
    <section className="min-h-screen bg-[#000000] px-4 pt-[88px] pb-6 text-[#fafafa] sm:px-6 lg:px-8">
      <div className="grid gap-4 lg:grid-cols-[260px_1fr] lg:items-start">
        <AppHomeSidebar actions={actions} wallet={wallet} />

        <main className="flex flex-col overflow-hidden border border-[#fafafa]/10 bg-[#0a0a0a]">
          <div className="border-b border-[#fafafa]/10 p-5 sm:p-6 lg:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">Home</div>
            <h1 className="mt-3 max-w-[780px] text-[clamp(36px,5.2vw,64px)] font-medium leading-[0.92] tracking-[-0.07em]">
              Good to see you, {name}.
            </h1>
          </div>

          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:p-5">
            <AppHomeProfilePanel profile={profile} name={name} />
            <div className="border border-[#a3a3a3]/20 bg-[#a3a3a3]/[0.08] p-5 sm:p-6">
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Arc Testnet</div>
              <p className="mt-4 max-w-[420px] text-[14px] leading-[1.6] text-[#fafafa]/72">
                Test funds only. Money moves through explicit room actions: fund, release, refund, dispute.
              </p>
              <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/42">
                Wallet {wallet.address.slice(0, 6)}…{wallet.address.slice(-4)}
              </div>
            </div>
          </div>

          <AppHomeActionGrid actions={actions} />
          <AppHomeOpenRooms wallet={wallet} />
        </main>
      </div>
    </section>
  )
}
