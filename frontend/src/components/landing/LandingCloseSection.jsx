import { Link } from 'react-router-dom'

export default function LandingCloseSection() {
  return (
    <section className="border-t border-[#0a0a0a]/10 bg-[#fafafa] px-4 py-12 text-[#0a0a0a] sm:px-10 sm:py-14 lg:px-14">
      <div className="mx-auto max-w-[1080px]">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Start</div>
        <h2 className="mt-3 max-w-[16ch] text-[clamp(28px,4vw,40px)] font-medium leading-[1.05] tracking-[-0.05em]">
          Start here.
        </h2>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          <Link
            to="/app"
            className="group border border-[#0a0a0a]/14 bg-white p-5 transition-[transform,border-color] duration-160 ease-out hover:border-[#0a0a0a]/32 active:scale-[0.97] sm:p-6"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Room</div>
            <div className="mt-2 text-[20px] font-medium tracking-[-0.035em] sm:text-[22px]">Open a room</div>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0a0a0a]/45 transition duration-160 group-hover:text-[#0a0a0a]">
              App →
            </div>
          </Link>

          <Link
            to="/market"
            className="group border border-[#0a0a0a] bg-[#0a0a0a] p-5 text-[#fafafa] transition-[transform,background-color,color] duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97] sm:p-6"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/45 transition group-hover:text-[#0a0a0a]/45">
              Market
            </div>
            <div className="mt-2 text-[20px] font-medium tracking-[-0.035em] sm:text-[22px]">Open market</div>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/50 transition group-hover:text-[#0a0a0a]">
              Market →
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
