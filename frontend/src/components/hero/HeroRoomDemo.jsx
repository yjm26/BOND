import { useMemo, useState } from 'react'
import HeroHotspotBar from './HeroHotspotBar'
import { DEMO_BY_STATE, DEMO_HOTSPOTS, DEMO_STATES } from './heroDemoData'

function ring(active, id) {
  return active === id
    ? 'ring-1 ring-[#fafafa]/55 ring-offset-2 ring-offset-[#000000]'
    : ''
}

function Metric({ label, value, note, tone = 'default' }) {
  const toneClass =
    tone === 'success'
      ? 'border-[#8f9a88]/30'
      : tone === 'warning'
        ? 'border-[#fafafa]/14'
        : 'border-[#fafafa]/10'

  return (
    <div className={`border bg-[#0a0a0a] p-3 sm:p-3.5 ${toneClass}`}>
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#a3a3a3]">{label}</div>
      <div className="mt-2 font-mono text-[18px] tracking-[-0.04em] text-[#fafafa] sm:text-[20px]">{value}</div>
      {note && <div className="mt-1.5 text-[11px] leading-[1.4] text-[#737373]">{note}</div>}
    </div>
  )
}

function Party({ label, address, you }) {
  return (
    <div className="border border-[#fafafa]/10 bg-[#0a0a0a] p-3">
      <div className="flex items-center justify-between gap-2">
        <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#a3a3a3]">{label}</div>
        {you && (
          <span className="border border-[#fafafa]/16 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[#fafafa]/70">
            You
          </span>
        )}
      </div>
      <div className="mt-2 font-mono text-[13px] text-[#fafafa]/85">{address}</div>
    </div>
  )
}

function stateTone(state) {
  if (state === 'Disputed') return 'border-[#b87333]/40 text-[#b87333]'
  if (state === 'Funded' || state === 'Delivered') return 'border-[#8f9a88]/30 text-[#8f9a88]'
  return 'border-[#fafafa]/16 text-[#fafafa]/60'
}

export default function HeroRoomDemo() {
  const [roomState, setRoomState] = useState('Delivered')
  const [activeId, setActiveId] = useState(null)
  const room = useMemo(() => DEMO_BY_STATE[roomState], [roomState])

  const noteClass =
    room.actionNoteTone === 'success'
      ? 'border-[#8f9a88]/24 bg-[#8f9a88]/10 text-[#8f9a88]'
      : room.actionNoteTone === 'danger'
        ? 'border-[#b87333]/32 bg-[#b87333]/10 text-[#b87333]'
        : 'border-[#fafafa]/10 bg-[#0a0a0a] text-[#a3a3a3]'

  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <div className="pointer-events-none absolute -inset-x-10 -bottom-16 -top-8 hidden rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.14),transparent_68%)] sm:block" />

      {/* State switcher — outside the product frame */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Demo state</div>
        <div className="flex flex-wrap gap-2">
          {DEMO_STATES.map((state) => {
            const on = roomState === state
            return (
              <button
                key={state}
                type="button"
                onClick={() => setRoomState(state)}
                className={`h-8 border px-3 font-mono text-[10px] uppercase tracking-[0.16em] transition duration-160 ease-out active:scale-[0.97] ${
                  on
                    ? 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]'
                    : 'border-[#0a0a0a]/14 bg-white text-[#0a0a0a]/65 hover:border-[#0a0a0a]/28 hover:text-[#0a0a0a]'
                }`}
              >
                {state}
              </button>
            )
          })}
        </div>
      </div>

      <div className="relative overflow-hidden border border-[#0a0a0a]/12 bg-[#000000] shadow-[0_40px_120px_rgba(0,0,0,0.28)]">
        <div className="flex items-center justify-between border-b border-[#fafafa]/10 bg-[#111111] px-3 py-2.5 sm:px-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#fafafa]/18" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fafafa]/12" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#fafafa]/12" />
            <span className="ml-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">
              BOND · Room
            </span>
          </div>
          <div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#525252]">
            Arc testnet · demo
          </div>
        </div>

        <HeroHotspotBar hotspots={DEMO_HOTSPOTS} activeId={activeId} onSelect={setActiveId} />

        <div className="bg-[#000000] p-3 text-[#fafafa] sm:p-4 lg:p-5">
          <div
            className={`mb-4 border border-[#fafafa]/10 bg-[#111111] p-4 transition duration-160 sm:mb-5 sm:p-5 ${ring(activeId, 'state')} ${ring(activeId, 'buffer')}`}
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">
                  Room #{room.id}
                </div>
                <h2 className="mt-3 max-w-[640px] text-[clamp(28px,4vw,44px)] font-medium leading-[0.94] tracking-[-0.07em]">
                  {room.item}
                </h2>
                <p className="mt-3 max-w-[480px] text-[13px] leading-[1.6] text-[#a3a3a3]">
                  {room.roleHint}. Escrow terms, participants, proof, and fallback path stay visible in one room.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className={`border px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] ${stateTone(room.state)} ${activeId === 'state' ? 'bg-[#fafafa]/6' : ''}`}>
                  {room.state}
                </span>
                <span className={`border border-[#fafafa]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#737373] ${activeId === 'buffer' ? 'border-[#fafafa]/40 text-[#fafafa]/80' : ''}`}>
                  12h arbiter buffer
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
            <div className="grid gap-4">
              <div className={`grid gap-3 transition duration-160 sm:grid-cols-2 ${ring(activeId, 'terms')}`}>
                <Metric label="Item price" value={`${room.price} USDC`} />
                <Metric
                  label="Total to fund"
                  value={`${room.total} USDC`}
                  note={`Includes ${room.fee} USDC platform fee.`}
                  tone="warning"
                />
                <Metric
                  label="Locked escrow"
                  value={`${room.locked} USDC`}
                  note="Held on-chain until release, refund, or dispute resolution."
                  tone="success"
                />
                <Metric
                  label="Delivery window"
                  value={`${room.deliveryDays} days`}
                  note="Agreed before the room was funded."
                />
              </div>

              <div className={`grid gap-3 transition duration-160 sm:grid-cols-2 ${ring(activeId, 'parties')}`}>
                <Party label="Buyer" address={room.buyer} you={room.state !== 'Funded'} />
                <Party label="Seller" address={room.seller} you={room.state === 'Funded'} />
              </div>

              {room.showEvidence && (
                <div className="border border-[#fafafa]/10 bg-[#111111] p-4">
                  <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">
                    Evidence
                  </div>
                  {room.evidence.length ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {room.evidence.map((item) => (
                        <span
                          key={item.label}
                          className="border border-[#fafafa]/12 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-[#fafafa]/75"
                        >
                          {item.label}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-[13px] text-[#737373]">No evidence filed.</p>
                  )}
                </div>
              )}
            </div>

            <aside className={`border border-[#fafafa]/10 bg-[#111111] p-4 transition duration-160 sm:p-5 ${ring(activeId, 'actions')}`}>
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/40">
                Room actions
              </div>
              <div className={`border px-3 py-3 text-center text-[12px] leading-[1.5] ${noteClass}`}>
                {room.actionNote}
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                <div className="flex h-11 items-center justify-center border border-[#fafafa] bg-[#fafafa] px-4 text-center font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111]">
                  {room.primaryAction}
                </div>
                {room.secondaryAction && (
                  <div
                    className={`flex h-11 items-center justify-center border px-4 text-center font-mono text-[10px] uppercase tracking-[0.16em] ${
                      room.secondaryTone === 'danger'
                        ? 'border-[#b87333]/38 text-[#b87333]'
                        : 'border-[#fafafa]/16 text-[#fafafa]/70'
                    }`}
                  >
                    {room.secondaryAction}
                  </div>
                )}
              </div>
              <p className="mt-4 text-[12px] leading-[1.5] text-[#737373]">
                Demo only — buttons are not live.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
