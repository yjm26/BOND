import RoomClarityGrid from './RoomClarityGrid'
import { ROOM_CLARITY_ITEMS } from './clarityData'

export default function RoomClaritySection() {
  return (
    <section className="bg-[#ede9df] px-6 py-16 text-[#171716] sm:px-10 sm:py-24 lg:px-14 lg:py-28">
      <div className="grid gap-10 sm:gap-14 lg:grid-cols-[34%_1fr] lg:gap-12">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6b62]">Room anatomy</div>
          <h2 className="mt-5 max-w-[520px] text-[clamp(40px,5vw,70px)] font-medium leading-[0.92] tracking-[-0.08em] text-[#171716]">
            What a room makes explicit.
          </h2>
          <p className="mt-6 max-w-[430px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#5f5a50]">
            A BOND room is useful because it removes ambiguity before USDC moves. Every important role, amount, proof, deadline, and fallback path is visible in one place.
          </p>
          <div className="mt-7 border-t border-[#171716]/15 pt-4 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.18em] text-[#6f6b62] sm:mt-10">
            Buyer → Escrow → Seller<br />Refund / dispute stays available as fallback.
          </div>
        </div>
        <RoomClarityGrid items={ROOM_CLARITY_ITEMS} />
      </div>
    </section>
  )
}
