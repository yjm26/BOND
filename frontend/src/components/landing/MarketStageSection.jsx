import { Link } from 'react-router-dom'
import MarketDemoCard from './MarketDemoCard'
import { DEMO_LISTINGS } from './marketDemoData'

/**
 * Section 3 — Market stage (Linear density, BOND stark).
 * Static demo listings; CTA goes to live /market.
 */
export default function MarketStageSection() {
  const front = DEMO_LISTINGS.slice(0, 3)
  const back = DEMO_LISTINGS.slice(3, 6)

  return (
    <section id="market" className="bg-[#fafafa] px-6 pb-20 pt-6 text-[#0a0a0a] sm:px-10 sm:pb-28 sm:pt-10 lg:px-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="grid gap-6 border-y border-[#0a0a0a]/12 py-8 sm:py-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-end lg:gap-12">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Market</div>
            <h2 className="mt-4 max-w-[16ch] text-[clamp(34px,5vw,56px)] font-medium leading-[0.98] tracking-[-0.06em] text-[#0a0a0a]">
              Open deals both sides can join.
            </h2>
          </div>
          <div className="flex flex-col gap-5 lg:items-end lg:text-right">
            <p className="max-w-[420px] text-[15px] leading-[1.6] tracking-[-0.015em] text-[#525252]">
              Browse free. Connect only when you open a room.
            </p>
            <Link
              to="/market"
              className="inline-flex h-11 w-fit items-center justify-center border border-[#0a0a0a] bg-[#0a0a0a] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]"
            >
              Browse market
            </Link>
          </div>
        </div>

        {/* Stage — layered board */}
        <div className="relative mt-10 sm:mt-14">
          {/* Back layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-6 hidden grid-cols-3 gap-3 opacity-90 sm:grid lg:top-8 lg:gap-4"
            style={{ transform: 'scale(0.96) translateY(12px)' }}
          >
            {back.map((listing) => (
              <MarketDemoCard key={listing.id} listing={listing} dimmed />
            ))}
          </div>

          {/* Soft wash so front reads first */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[-4%] bottom-[-8%] top-[18%] hidden rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.06),transparent_70%)] sm:block"
          />

          {/* Front layer */}
          <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-3 lg:gap-4">
            {front.map((listing) => (
              <MarketDemoCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
