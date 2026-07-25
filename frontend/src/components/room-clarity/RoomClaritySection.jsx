import RoomClarityGrid from './RoomClarityGrid'
import { ROOM_CLARITY_ITEMS } from './clarityData'

export default function RoomClaritySection() {
  return (
    <section className="bg-[#fafafa] px-6 py-16 text-[#0a0a0a] sm:px-10 sm:py-24 lg:px-14 lg:py-28">
      <div className="grid gap-10 sm:gap-14 lg:grid-cols-[36%_1fr] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">The room</div>
          <h2 className="mt-5 max-w-[560px] text-[clamp(42px,5vw,74px)] font-medium leading-[0.9] tracking-[-0.085em] text-[#0a0a0a]">
            Put the deal somewhere both sides can point to.
          </h2>
          <p className="mt-6 max-w-[460px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#525252]">
            DMs are good for negotiation. They are bad at remembering what was agreed. A BOND room gives the money, proof, people, and fallback path one shared surface.
          </p>
        </div>
        <RoomClarityGrid items={ROOM_CLARITY_ITEMS} />
      </div>
    </section>
  )
}
