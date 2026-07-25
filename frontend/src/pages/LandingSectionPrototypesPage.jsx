import { Link } from 'react-router-dom'

const LISTINGS = [
  { role: 'Seller', title: 'Landing page + CMS', price: '380', days: '7d' },
  { role: 'Buyer', title: 'Arc integration help', price: '650', days: '10d' },
  { role: 'Seller', title: 'Brand kit pack', price: '220', days: '5d' },
  { role: 'Seller', title: 'Contract review', price: '900', days: '4d' },
]

function ProtoLabel({ id, title, blurb }) {
  return (
    <div className="mb-6 border-b border-[#0a0a0a]/12 pb-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">Prototype {id}</div>
      <h2 className="mt-2 text-[22px] font-medium tracking-[-0.04em] text-[#0a0a0a]">{title}</h2>
      <p className="mt-1 max-w-[520px] text-[13px] leading-[1.5] text-[#525252]">{blurb}</p>
    </div>
  )
}

function MarketChrome({ children }) {
  return (
    <div className="overflow-hidden border border-[#0a0a0a]/25 bg-[#000000] shadow-[0_20px_60px_rgba(0,0,0,0.18)]">
      <div className="flex items-center gap-2 border-b border-[#fafafa]/10 bg-[#111111] px-4 py-2.5">
        <span className="h-2 w-2 rounded-full bg-[#fafafa]/20" />
        <span className="h-2 w-2 rounded-full bg-[#fafafa]/12" />
        <span className="h-2 w-2 rounded-full bg-[#fafafa]/12" />
        <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">BOND · Market</span>
      </div>
      {children}
    </div>
  )
}

function ListingRow({ item, active }) {
  return (
    <div
      className={`grid grid-cols-[64px_1fr_auto] items-center gap-3 border-b border-[#fafafa]/8 px-4 py-3 ${
        active ? 'bg-[#fafafa]/6' : ''
      }`}
    >
      <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[#a3a3a3]">{item.role}</span>
      <span className="truncate text-[13px] text-[#fafafa]">{item.title}</span>
      <span className="font-mono text-[12px] text-[#fafafa]/80">
        {item.price} <span className="text-[#737373]">· {item.days}</span>
      </span>
    </div>
  )
}

/** A — Market as product shot (dark chrome, same class as hero room) */
function ProtoA() {
  return (
    <section className="bg-[#fafafa] px-6 py-16 sm:px-10 lg:px-14">
      <ProtoLabel
        id="A"
        title="Market product shot"
        blurb="Same visual class as hero room: dark app chrome, real market UI feel, short header."
      />
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#737373]">Market</div>
            <h3 className="mt-2 text-[clamp(28px,4vw,40px)] font-medium tracking-[-0.05em] text-[#0a0a0a]">
              Open deals both sides can join.
            </h3>
          </div>
          <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#525252]">Browse free · connect to act</span>
        </div>
        <MarketChrome>
          <div className="flex flex-wrap gap-2 border-b border-[#fafafa]/10 px-4 py-3">
            {['All', 'Seller', 'Buyer', 'Open'].map((t, i) => (
              <span
                key={t}
                className={`border px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] ${
                  i === 0 ? 'border-[#fafafa] bg-[#fafafa] text-[#0a0a0a]' : 'border-[#fafafa]/14 text-[#a3a3a3]'
                }`}
              >
                {t}
              </span>
            ))}
          </div>
          <div className="grid lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              {LISTINGS.map((item, i) => (
                <ListingRow key={item.title} item={item} active={i === 0} />
              ))}
            </div>
            <div className="border-t border-[#fafafa]/10 p-4 lg:border-l lg:border-t-0">
              <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Selected</div>
              <div className="mt-3 text-[20px] font-medium tracking-[-0.04em] text-[#fafafa]">Landing page + CMS</div>
              <div className="mt-4 grid grid-cols-2 gap-2">
                <div className="border border-[#fafafa]/10 bg-[#0a0a0a] p-3">
                  <div className="font-mono text-[9px] text-[#737373]">Price</div>
                  <div className="mt-1 font-mono text-[16px] text-[#fafafa]">380 USDC</div>
                </div>
                <div className="border border-[#fafafa]/10 bg-[#0a0a0a] p-3">
                  <div className="font-mono text-[9px] text-[#737373]">Delivery</div>
                  <div className="mt-1 font-mono text-[16px] text-[#fafafa]">7 days</div>
                </div>
              </div>
              <div className="mt-4 flex h-10 items-center justify-center border border-[#fafafa] bg-[#fafafa] font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0a]">
                Open room from listing
              </div>
            </div>
          </div>
        </MarketChrome>
      </div>
    </section>
  )
}

/** B — Split Room | Market dual doors */
function ProtoB() {
  return (
    <section className="border-t border-[#0a0a0a]/10 bg-[#fafafa] px-6 py-16 sm:px-10 lg:px-14">
      <ProtoLabel
        id="B"
        title="Split Room | Market"
        blurb="Two product doors. Almost no prose. Each panel is a mini product surface."
      />
      <div className="mx-auto grid max-w-[1080px] gap-3 lg:grid-cols-2">
        <div className="border border-[#0a0a0a]/15 bg-white p-3 sm:p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#737373]">Room</span>
            <span className="font-mono text-[10px] text-[#525252]">Escrow</span>
          </div>
          <div className="border border-[#0a0a0a]/20 bg-[#000000] p-4 text-[#fafafa]">
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#737373]">Room #1042 · Delivered</div>
            <div className="mt-3 text-[22px] font-medium tracking-[-0.04em]">Brand kit package</div>
            <div className="mt-4 grid grid-cols-2 gap-2">
              <div className="border border-[#fafafa]/10 p-2.5 font-mono text-[11px] text-[#a3a3a3]">424.2 locked</div>
              <div className="border border-[#fafafa]/10 p-2.5 font-mono text-[11px] text-[#8f9a88]">Release ready</div>
            </div>
            <div className="mt-4 h-9 border border-[#fafafa] bg-[#fafafa] font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] grid place-items-center">
              Create room
            </div>
          </div>
        </div>

        <div className="border border-[#0a0a0a] bg-[#0a0a0a] p-3 text-[#fafafa] sm:p-4">
          <div className="mb-3 flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/45">Market</span>
            <span className="font-mono text-[10px] text-[#fafafa]/40">Listings</span>
          </div>
          <div className="border border-[#fafafa]/12 bg-[#111111]">
            {LISTINGS.slice(0, 3).map((item) => (
              <div key={item.title} className="flex items-center justify-between gap-3 border-b border-[#fafafa]/8 px-3 py-3 last:border-0">
                <div className="min-w-0">
                  <div className="truncate text-[13px]">{item.title}</div>
                  <div className="mt-0.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[#737373]">{item.role}</div>
                </div>
                <div className="shrink-0 font-mono text-[12px]">{item.price}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 h-9 border border-[#fafafa] bg-[#fafafa] font-mono text-[10px] font-semibold uppercase tracking-[0.14em] text-[#0a0a0a] grid place-items-center">
            Browse market
          </div>
        </div>
      </div>
    </section>
  )
}

/** C — Listing → Room flow strip */
function ProtoC() {
  const steps = [
    { n: '01', label: 'Listing', body: 'Open deal on market', mock: '380 USDC · 7d' },
    { n: '02', label: 'Room', body: 'Terms + parties lock', mock: 'Funded · escrow' },
    { n: '03', label: 'End', body: 'Release, refund, dispute', mock: 'Clear exit' },
  ]
  return (
    <section className="border-t border-[#0a0a0a]/10 bg-[#fafafa] px-6 py-16 sm:px-10 lg:px-14">
      <ProtoLabel
        id="C"
        title="Listing → Room flow"
        blurb="One horizontal system story. How market connects to room — almost no paragraphs."
      />
      <div className="mx-auto max-w-[1080px]">
        <div className="mb-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#737373]">How it connects</div>
          <h3 className="mt-2 text-[clamp(28px,4vw,40px)] font-medium tracking-[-0.05em] text-[#0a0a0a]">
            Market finds the deal. Room settles it.
          </h3>
        </div>
        <div className="grid gap-3 md:grid-cols-3">
          {steps.map((step, i) => (
            <div key={step.n} className="relative border border-[#0a0a0a]/12 bg-white p-5">
              {i < steps.length - 1 && (
                <div className="absolute -right-2 top-1/2 z-10 hidden h-px w-4 bg-[#0a0a0a]/20 md:block" aria-hidden />
              )}
              <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#737373]">
                {step.n} · {step.label}
              </div>
              <div className="mt-3 text-[18px] font-medium tracking-[-0.03em] text-[#0a0a0a]">{step.body}</div>
              <div className="mt-6 border border-[#0a0a0a]/10 bg-[#0a0a0a] px-3 py-4 font-mono text-[12px] text-[#fafafa]">
                {step.mock}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default function LandingSectionPrototypesPage() {
  return (
    <div className="min-h-screen bg-[#fafafa] pt-[72px] text-[#0a0a0a]">
      <div className="border-b border-[#0a0a0a]/10 bg-white px-6 py-8 sm:px-10 lg:px-14">
        <div className="mx-auto max-w-[1080px]">
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">Internal · not production nav</div>
          <h1 className="mt-2 text-[clamp(28px,4vw,40px)] font-medium tracking-[-0.05em]">Section 3 prototypes</h1>
          <p className="mt-2 max-w-[520px] text-[14px] text-[#525252]">
            A / B / C stacked for comparison. Landing production unchanged. Pick one, then we ship it.
          </p>
          <Link to="/" className="mt-4 inline-block font-mono text-[11px] uppercase tracking-[0.14em] text-[#0a0a0a]/60 underline-offset-2 hover:underline">
            ← Back to landing
          </Link>
        </div>
      </div>
      <ProtoA />
      <ProtoB />
      <ProtoC />
      <div className="border-t border-[#0a0a0a]/10 px-6 py-12 text-center sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#737373]">End of prototypes · reply A, B, or C</p>
      </div>
    </div>
  )
}
