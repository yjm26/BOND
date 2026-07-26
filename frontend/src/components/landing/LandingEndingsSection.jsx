import { Link } from 'react-router-dom'
import { btnLandingOnDarkPrimary, btnLandingOnDarkSecondary } from '../../styles/buttons'

const ENDINGS = [
  {
    key: 'release',
    label: 'Release',
    line: 'Buyer confirms delivery. Seller receives the locked USDC.',
    tone: 'success',
  },
  {
    key: 'refund',
    label: 'Refund',
    line: 'Delivery missed or both sides cancel. Buyer is refunded per contract.',
    tone: 'neutral',
  },
  {
    key: 'dispute',
    label: 'Dispute',
    line: 'Buyer disputes after delivery. After 12 hours the seller can escalate. Arbiter settles on-chain.',
    tone: 'danger',
  },
]

export default function LandingEndingsSection() {
  return (
    <section
      id="endings"
      className="relative overflow-hidden border-t border-[#fafafa]/10 bg-[#0a0a0a] px-4 pt-11 pb-14 text-[#fafafa] sm:px-10 sm:pt-12 sm:pb-16 lg:px-14 lg:pt-16 lg:pb-20"
    >
      <div className="mx-auto max-w-[1080px]">
        <div className="flex flex-col gap-6 border-b border-[#fafafa]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">Endings</div>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(28px,4vw,40px)] font-medium leading-[1.05] tracking-[-0.05em]">
              How a room ends.
            </h2>
          </div>
          <p className="max-w-[240px] text-[14px] leading-[1.5] text-[#a3a3a3] sm:text-right">
            Settlement stays on-chain — not “we’ll sort it in DMs.”
          </p>
        </div>

        <div className="mt-2 divide-y divide-[#fafafa]/10">
          {ENDINGS.map((item, index) => (
            <div
              key={item.key}
              className="grid grid-cols-[40px_minmax(0,1fr)] gap-x-3 gap-y-2 py-6 sm:grid-cols-[72px_minmax(0,1fr)_minmax(0,1.2fr)] sm:items-baseline sm:gap-8 sm:py-7"
            >
              <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-[#6b6b6b]">0{index + 1}</div>
              <div
                className={`text-[clamp(22px,3vw,30px)] font-medium tracking-[-0.04em] ${
                  item.tone === 'success'
                    ? 'text-[#8f9a88]'
                    : item.tone === 'danger'
                      ? 'text-[#b87333]'
                      : 'text-[#fafafa]'
                }`}
              >
                {item.label}
              </div>
              <p className="col-span-2 text-[15px] leading-[1.5] tracking-[-0.01em] text-[#a3a3a3] sm:col-span-1 sm:col-start-3">
                {item.line}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-wrap gap-3 border-t border-[#fafafa]/10 pt-8">
          <Link to="/app" className={btnLandingOnDarkPrimary}>
            Go to app
          </Link>
          <Link to="/docs" className={btnLandingOnDarkSecondary}>
            Docs
          </Link>
        </div>
      </div>
    </section>
  )
}
