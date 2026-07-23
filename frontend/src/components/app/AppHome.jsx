import AppActionCard from './AppActionCard'
import { APP_ACTIONS } from './appHomeData'

export default function AppHome({ wallet }) {
  return (
    <section className="min-h-screen bg-[#ede9df] px-6 pt-[112px] text-[#171716] sm:px-10 lg:px-14">
      <div className="border-b border-[#171716]/15 pb-10">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6b62]">Workspace</div>
        <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_360px] lg:items-end">
          <h1 className="max-w-[780px] text-[clamp(48px,7vw,96px)] font-medium leading-[0.9] tracking-[-0.08em]">
            Your BOND app workspace.
          </h1>
          <div className="border border-[#171716]/14 bg-[#f4f0e7] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.16em] text-[#6f6b62]">
            Connected wallet<br />
            <span className="text-[#171716]">{wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}</span>
          </div>
        </div>
      </div>

      <div className="grid gap-3 py-10 md:grid-cols-2 xl:grid-cols-3">
        {APP_ACTIONS.map((item, index) => (
          <AppActionCard key={item.label} item={item} index={index} />
        ))}
      </div>
    </section>
  )
}
