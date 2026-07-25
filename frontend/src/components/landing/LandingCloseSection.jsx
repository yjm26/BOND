import { Link } from 'react-router-dom'

/** Short landing close — dual product doors, no essay. */
export default function LandingCloseSection() {
  return (
    <section className="border-t border-[#0a0a0a]/10 bg-[#fafafa] px-6 py-16 text-[#0a0a0a] sm:px-10 sm:py-20 lg:px-14">
      <div className="mx-auto max-w-[1180px]">
        <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Start</div>
        <h2 className="mt-4 max-w-[18ch] text-[clamp(32px,4.8vw,48px)] font-medium leading-[1.02] tracking-[-0.055em]">
          Room or market. Pick a door.
        </h2>

        <div className="mt-10 grid gap-3 sm:grid-cols-2">
          <Link
            to="/app"
            className="group border border-[#0a0a0a]/14 bg-white p-6 transition duration-160 ease-out hover:border-[#0a0a0a]/34 active:scale-[0.995] sm:p-8"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#737373]">Room</div>
            <div className="mt-3 text-[24px] font-medium tracking-[-0.04em] sm:text-[28px]">Create a deal room</div>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#0a0a0a]/50 transition group-hover:text-[#0a0a0a]">
              Go to app →
            </div>
          </Link>

          <Link
            to="/market"
            className="group border border-[#0a0a0a] bg-[#0a0a0a] p-6 text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.995] sm:p-8"
          >
            <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/45 group-hover:text-[#0a0a0a]/45">
              Market
            </div>
            <div className="mt-3 text-[24px] font-medium tracking-[-0.04em] sm:text-[28px]">Browse open listings</div>
            <div className="mt-6 font-mono text-[11px] uppercase tracking-[0.16em] text-[#fafafa]/50 transition group-hover:text-[#0a0a0a]">
              Open market →
            </div>
          </Link>
        </div>
      </div>
    </section>
  )
}
