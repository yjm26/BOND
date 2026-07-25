import { useParams } from 'react-router-dom'
import { DOC_SECTIONS } from './docs/docsData'
import { NavPill, SideLink } from './docs/DocsUi'
import {
  OverviewSection,
  OnArcSection,
  RoomsSection,
  MarketSection,
  SettlementSection,
  DisputesSection,
  FeesTimersSection,
  SecuritySection,
  FaqSection,
} from './docs/DocsSections'

const SECTION_MAP = {
  overview: OverviewSection,
  'on-arc': OnArcSection,
  rooms: RoomsSection,
  market: MarketSection,
  settlement: SettlementSection,
  disputes: DisputesSection,
  'fees-timers': FeesTimersSection,
  security: SecuritySection,
  faq: FaqSection,
}

/**
 * Docs shell only — section copy lives in docs/ modules.
 * Layout: large title + sticky section nav (style kept).
 */
export default function Docs() {
  const { section } = useParams()
  const active = section || 'overview'
  const ActiveSection = SECTION_MAP[active] || OverviewSection

  return (
    <section className="min-h-screen bg-[#fafafa] px-4 pb-24 pt-[92px] text-[#0a0a0a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="border-b border-[#0a0a0a]/14 pb-8 sm:pb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">BOND docs</div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <h1 className="max-w-[780px] text-[clamp(48px,8vw,104px)] font-medium leading-[0.86] tracking-[-0.09em]">
              Room mechanics, fees, and settlement.
            </h1>
            <p className="max-w-[380px] text-[15px] leading-[1.7] tracking-[-0.01em] text-[#525252] lg:justify-self-end">
                          BOND on Arc Testnet: room mechanics, USDC gas and settlement, fees, disputes, and network setup.
                        </p>
          </div>
        </header>

        <div className="sticky top-[60px] z-20 -mx-4 border-b border-[#0a0a0a]/12 bg-[#fafafa]/94 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {DOC_SECTIONS.map((item) => (
              <NavPill key={item.id} item={item} active={active === item.id} />
            ))}
          </div>
        </div>

        <div className="grid gap-10 pt-8 md:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden md:block">
            <nav className="sticky top-[96px] border-l border-[#0a0a0a]/14 pl-4">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#737373]">Sections</div>
              <div className="grid gap-1">
                {DOC_SECTIONS.map((item) => (
                  <SideLink key={item.id} item={item} active={active === item.id} />
                ))}
              </div>
            </nav>
          </aside>

          <main className="min-w-0">
            <ActiveSection />
          </main>
        </div>
      </div>
    </section>
  )
}
