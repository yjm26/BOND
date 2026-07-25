import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { STAGE_LISTINGS } from './marketDemoData'

/**
 * Market chapter — product chrome, numbered like Linear chapters.
 */
export default function MarketStageSection() {
  const [filter, setFilter] = useState('all')
  const [activeId, setActiveId] = useState(STAGE_LISTINGS[0].id)

  const filters = [
    { key: 'all', label: 'All' },
    { key: 'seller', label: 'Seller' },
    { key: 'buyer', label: 'Buyer' },
  ]

  const rows = useMemo(() => {
    if (filter === 'all') return STAGE_LISTINGS
    return STAGE_LISTINGS.filter((item) => item.role === filter)
  }, [filter])

  const active = rows.find((item) => item.id === activeId) || rows[0] || STAGE_LISTINGS[0]
  const selected = rows.some((item) => item.id === active?.id) ? active : rows[0]

  return (
    <section id="market" className="bg-[#fafafa] px-6 py-16 text-[#0a0a0a] sm:px-10 sm:py-24 lg:px-14 lg:py-28">
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between sm:gap-10">
          <div className="min-w-0">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">01 · Market</div>
            <h2 className="mt-3 max-w-[14ch] text-[clamp(30px,4.4vw,44px)] font-medium leading-[1.02] tracking-[-0.055em]">
              Open deals. One board.
            </h2>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:items-end">
            <p className="max-w-[260px] text-[14px] leading-[1.55] tracking-[-0.01em] text-[#525252] sm:text-right">
              Browse free. Connect only to open a room.
            </p>
            <Link
              to="/market"
              className="inline-flex h-10 w-fit items-center justify-center border border-[#0a0a0a] bg-[#0a0a0a] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]"
            >
              Browse market →
            </Link>
          </div>
        </div>

        <div className="relative mt-10 sm:mt-12">
          <div className="pointer-events-none absolute -inset-x-6 -bottom-10 -top-4 hidden rounded-[42%] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.1),transparent_70%)] sm:block" />

          <div className="relative rounded-[2px] border border-[#0a0a0a]/30 bg-[#000000] p-[3px] shadow-[0_1px_0_rgba(255,255,255,0.7)_inset,0_18px_50px_rgba(0,0,0,0.14)]">
            <div className="overflow-hidden border border-[#fafafa]/12 bg-[#000000] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
              <div className="flex items-center justify-between border-b border-[#fafafa]/10 bg-[#111111] px-3 py-2.5 sm:px-4">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fafafa]/18" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fafafa]/12" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#fafafa]/12" />
                  <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">
                    BOND · Market
                  </span>
                </div>
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[#525252]">
                  {rows.length} open
                </span>
              </div>

              <div className="flex flex-wrap gap-2 border-b border-[#fafafa]/10 px-3 py-3 sm:px-4">
                {filters.map((item) => {
                  const on = filter === item.key
                  return (
                    <button
                      key={item.key}
                      type="button"
                      onClick={() => {
                        setFilter(item.key)
                        const next =
                          item.key === 'all' ? STAGE_LISTINGS : STAGE_LISTINGS.filter((l) => l.role === item.key)
                        if (next[0]) setActiveId(next[0].id)
                      }}
                      className={`h-8 border px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition duration-160 ease-out active:scale-[0.97] ${
                        on
                          ? 'border-[#fafafa] bg-[#fafafa] text-[#0a0a0a]'
                          : 'border-[#fafafa]/14 text-[#a3a3a3] hover:border-[#fafafa]/28 hover:text-[#fafafa]'
                      }`}
                    >
                      {item.label}
                    </button>
                  )
                })}
              </div>

              <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(260px,0.85fr)]">
                <ul className="divide-y divide-[#fafafa]/8 border-b border-[#fafafa]/10 lg:border-b-0 lg:border-r">
                  {rows.map((item) => {
                    const on = selected?.id === item.id
                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          onClick={() => setActiveId(item.id)}
                          className={`grid w-full grid-cols-[56px_minmax(0,1fr)_auto] items-center gap-3 px-3 py-3.5 text-left transition duration-160 ease-out sm:px-4 ${
                            on ? 'bg-[#fafafa]/[0.07]' : 'hover:bg-[#fafafa]/[0.04]'
                          }`}
                        >
                          <span
                            className={`font-mono text-[9px] uppercase tracking-[0.14em] ${
                              on ? 'text-[#fafafa]/80' : 'text-[#737373]'
                            }`}
                          >
                            {item.role}
                          </span>
                          <span
                            className={`truncate text-[13px] tracking-[-0.015em] sm:text-[14px] ${
                              on ? 'text-[#fafafa]' : 'text-[#fafafa]/78'
                            }`}
                          >
                            {item.title}
                          </span>
                          <span className="shrink-0 font-mono text-[12px] tabular-nums text-[#fafafa]/70">
                            {item.price}
                            <span className="ml-1.5 text-[#525252]">USDC</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>

                <aside className="flex flex-col bg-[#0a0a0a] p-4 sm:p-5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#737373]">Listing</div>
                  <div key={selected?.id} className="mt-3 bond-market-detail-in">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="border border-[#fafafa]/16 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#fafafa]/70">
                        {selected?.role}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#737373]">
                        {selected?.category}
                      </span>
                    </div>
                    <h3 className="mt-3 text-[20px] font-medium leading-[1.15] tracking-[-0.04em] text-[#fafafa] sm:text-[22px]">
                      {selected?.title}
                    </h3>
                    <p className="mt-3 text-[13px] leading-[1.55] text-[#a3a3a3]">{selected?.blurb}</p>

                    <div className="mt-5 grid grid-cols-2 gap-2">
                      <div className="border border-[#fafafa]/10 bg-[#000000] p-3">
                        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#737373]">Price</div>
                        <div className="mt-1.5 font-mono text-[18px] tracking-[-0.03em] text-[#fafafa]">
                          {selected?.price} <span className="text-[11px] text-[#737373]">USDC</span>
                        </div>
                      </div>
                      <div className="border border-[#fafafa]/10 bg-[#000000] p-3">
                        <div className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#737373]">Delivery</div>
                        <div className="mt-1.5 font-mono text-[18px] tracking-[-0.03em] text-[#fafafa]">
                          {selected?.days}d
                        </div>
                      </div>
                    </div>

                    <div className="mt-3 border border-[#fafafa]/10 bg-[#000000] px-3 py-2.5 font-mono text-[11px] text-[#a3a3a3]">
                      {selected?.creator}
                    </div>
                  </div>

                  <div className="mt-auto pt-5">
                    <Link
                      to="/market"
                      className="flex h-11 items-center justify-center border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition duration-160 ease-out hover:bg-transparent hover:text-[#fafafa] active:scale-[0.97]"
                    >
                      Open in market
                    </Link>
                  </div>
                </aside>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
