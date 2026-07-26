/**
 * Manifesto — one concrete line. No poetry.
 */
export default function LandingManifesto() {
  return (
    <section className="border-y border-[#0a0a0a]/10 bg-[#fafafa] px-4 py-12 text-[#0a0a0a] sm:px-10 sm:py-14 lg:px-14">
      <div className="mx-auto max-w-[880px]">
        <p className="text-[clamp(24px,3.8vw,36px)] font-medium leading-[1.2] tracking-[-0.04em]">
          <span className="text-[#0a0a0a]">Two products.</span>{' '}
          <span className="text-[#737373]">
            Rooms hold escrow. Market lists open work. Release, refund, or dispute ends the room.
          </span>
        </p>
      </div>
    </section>
  )
}
