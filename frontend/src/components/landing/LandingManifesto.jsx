/**
 * Landing manifesto — Linear-style lead line, BOND stark.
 * One breath between hero and product chapters. No essay.
 */
export default function LandingManifesto() {
  return (
    <section className="border-y border-[#0a0a0a]/10 bg-[#fafafa] px-6 py-14 text-[#0a0a0a] sm:px-10 sm:py-16 lg:px-14 lg:py-20">
      <div className="mx-auto max-w-[920px]">
        <p className="text-[clamp(26px,4.2vw,40px)] font-medium leading-[1.15] tracking-[-0.045em]">
          <span className="text-[#0a0a0a]">A place for the deal.</span>{' '}
          <span className="text-[#737373]">
            Rooms lock USDC and terms. Market surfaces open work. Endings stay legible.
          </span>
        </p>
      </div>
    </section>
  )
}
