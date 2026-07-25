import { Link } from 'react-router-dom'

const ENDINGS = [
  {
    key: 'release',
    label: 'Release',
    line: 'Buyer accepts delivery. Seller receives locked USDC.',
    tone: 'success',
  },
  {
    key: 'refund',
    label: 'Refund',
    line: 'Deal cancelled under terms. Buyer gets USDC back.',
    tone: 'neutral',
  },
  {
    key: 'dispute',
    label: 'Dispute',
    line: 'Parties disagree. Evidence + arbiter after the 12h buffer.',
    tone: 'danger',
  },
]

export default function LandingEndingsSection() {
  return (
    <section
      id="endings"
      className="relative overflow-hidden bg-[#0a0a0a] px-6 py-16 text-[#fafafa] sm:px-10 sm:py-24 lg:px-14 lg:py-28"
    >
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-col gap-6 border-b border-[#fafafa]/10 pb-10 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">Endings</div>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(30px,4.4vw,44px)] font-medium leading-[1.02] tracking-[-0.055em]">
              Three ways a room closes.
            </h2>
          </div>
          <p className="max-w-[240px] text-[14px] leading-[1.5] text-[#a3a3a3] sm:text-right">
            No off-platform “we’ll settle later.”
          </p>
        </div>

        <div className="mt-2 divide-y divide-[#fafafa]/10">
          {ENDINGS.map((item, index) => (
            <div
              key={item.key}
              className="grid gap-4 py-8 sm:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-baseline sm:gap-8 sm:py-9"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#525252]">
                0{index + 1}
              </div>
              <div
                className={`text-[clamp(28px,3.5vw,36px)] font-medium tracking-[-0.045em] ${
                  item.tone === 'success'
                    ? 'text-[#8f9a88]'
                    : item.tone === 'danger'
                      ? 'text-[#b87333]'
                      : 'text-[#fafafa]'
                }`}
              >
                {item.label}
              </div>
              <p className="text-[15px] leading-[1.5] tracking-[-0.01em] text-[#a3a3a3]">{item.line}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-[#fafafa]/10 pt-8">
          <Link
            to="/app"
            className="inline-flex h-11 items-center justify-center border border-[#fafafa] bg-[#fafafa] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#0a0a0a] transition duration-160 ease-out hover:bg-transparent hover:text-[#fafafa] active:scale-[0.97]"
          >
            Go to app
          </Link>
          <Link
            to="/docs"
            className="inline-flex h-11 items-center justify-center border border-[#fafafa]/18 px-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/70 transition duration-160 ease-out hover:border-[#fafafa]/40 hover:text-[#fafafa] active:scale-[0.97]"
          >
            Docs
          </Link>
        </div>
      </div>
    </section>
  )
}
