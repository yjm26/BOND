import { useState } from 'react'
import HeroHotspot from './HeroHotspot'
import { DEMO_HOTSPOTS, DEMO_ROOM } from './heroDemoData'

function Metric({ label, value, note, tone = 'default' }) {
  const toneClass =
    tone === 'success'
      ? 'border-[#8f9a88]/30 text-[#8f9a88]'
      : tone === 'warning'
        ? 'border-[#a3a3a3]/35 text-[#fafafa]'
        : 'border-[#fafafa]/10 text-[#fafafa]'

  return (
    <div className={`border bg-[#0a0a0a] p-3 sm:p-3.5 ${toneClass}`}>
      <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-[#a3a3a3]">{label}</div>
      <div className="mt-2 font-mono text-[18px] tracking-[-0.04em] sm:text-[20px]">{value}</div>
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

/** Static replica of the real app room shell — display only. */
export default function HeroRoomDemo() {
  const [activeId, setActiveId] = useState(null)

  return (
    <div className="relative mx-auto w-full max-w-[1080px]">
      <div className="pointer-events-none absolute -inset-x-10 -bottom-16 -top-8 hidden rounded-[40%] bg-[radial-gradient(ellipse_at_center,rgba(10,10,10,0.14),transparent_68%)] sm:block" />

      <div className="relative overflow-hidden border border-[#0a0a0a]/12 bg-[#000000] shadow-[0_40px_120px_rgba(0,0,0,0.28)]">
        {/* Window chrome */}
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

        <div className="relative bg-[#000000] p-3 text-[#fafafa] sm:p-4 lg:p-5">
          {/* Hotspots over the replica */}
          {DEMO_HOTSPOTS.map((hotspot) => (
            <HeroHotspot
              key={hotspot.id}
              hotspot={hotspot}
              active={activeId === hotspot.id}
              onEnter={setActiveId}
              onLeave={(id) => setActiveId((current) => (current === id ? null : current))}
            />
          ))}

          {/* Header — mirrors RoomHeader */}
          <div className="mb-4 border border-[#fafafa]/10 bg-[#111111] p-4 sm:mb-5 sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0 pr-20 sm:pr-28">
                <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">
                  Room #{DEMO_ROOM.id}
                </div>
                <h2 className="mt-3 max-w-[640px] text-[clamp(28px,4vw,44px)] font-medium leading-[0.94] tracking-[-0.07em]">
                  {DEMO_ROOM.item}
                </h2>
                <p className="mt-3 max-w-[480px] text-[13px] leading-[1.6] text-[#a3a3a3]">
                  {DEMO_ROOM.roleHint}. Escrow terms, participants, proof, and fallback path stay visible in one
                  room.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <span className="border border-[#8f9a88]/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f9a88]">
                  {DEMO_ROOM.state}
                </span>
                <span className="border border-[#fafafa]/10 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#737373]">
                  12h arbiter buffer
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1fr_300px]">
            <div className="grid gap-4">
              {/* Terms */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Metric label="Item price" value={`${DEMO_ROOM.price} USDC`} />
                <Metric
                  label="Total to fund"
                  value={`${DEMO_ROOM.total} USDC`}
                  note={`Includes ${DEMO_ROOM.fee} USDC platform fee.`}
                  tone="warning"
                />
                <Metric
                  label="Locked escrow"
                  value={`${DEMO_ROOM.locked} USDC`}
                  note="Held on-chain until release, refund, or dispute resolution."
                  tone="success"
                />
                <Metric
                  label="Delivery window"
                  value={`${DEMO_ROOM.deliveryDays} days`}
                  note="Agreed before the room was funded."
                />
              </div>

              {/* Parties */}
              <div className="grid gap-3 sm:grid-cols-2">
                <Party label="Buyer" address={DEMO_ROOM.buyer} you />
                <Party label="Seller" address={DEMO_ROOM.seller} />
              </div>

              {/* Evidence strip */}
              <div className="border border-[#fafafa]/10 bg-[#111111] p-4">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Evidence</div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="border border-[#fafafa]/12 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-[#fafafa]/75">
                    drive/brand-kit-final.zip
                  </span>
                  <span className="border border-[#fafafa]/12 bg-[#0a0a0a] px-3 py-2 font-mono text-[11px] text-[#fafafa]/75">
                    note: delivered via shared folder
                  </span>
                </div>
              </div>
            </div>

            {/* Actions — mirrors ActionPanel chrome */}
            <aside className="border border-[#fafafa]/10 bg-[#111111] p-4 sm:p-5">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/40">
                Room actions
              </div>
              <div className="border border-[#8f9a88]/24 bg-[#8f9a88]/10 px-3 py-3 text-center text-[12px] leading-[1.5] text-[#8f9a88]">
                Seller marked delivered. Review the work, then release or dispute.
              </div>
              <div className="mt-3 flex flex-col gap-2.5">
                <div className="flex h-11 items-center justify-center border border-[#fafafa] bg-[#fafafa] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111]">
                  Release {DEMO_ROOM.locked} USDC
                </div>
                <div className="flex h-11 items-center justify-center border border-[#b87333]/38 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333]">
                  Open dispute
                </div>
              </div>
              <p className="mt-4 text-[12px] leading-[1.5] text-[#737373]">
                Demo only — buttons are not live. Hover the labels to learn each part.
              </p>
            </aside>
          </div>
        </div>
      </div>
    </div>
  )
}
