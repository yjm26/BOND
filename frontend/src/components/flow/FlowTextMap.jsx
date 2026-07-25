import { FLOW_WORDS } from './flowData'

const PATH_LABELS = [
  { text: 'CREATE ROOM', left: '54%', top: '16%' },
  { text: 'FUND USDC', left: '62%', top: '32%' },
  { text: 'LOCK ESCROW', left: '70%', top: '48%' },
  { text: 'PROOF ATTACHED', left: '73%', top: '62%' },
  { text: 'RELEASE / REFUND / DISPUTE', left: '68%', top: '78%' },
]

export default function FlowTextMap() {
  return (
    <div className="relative min-h-[680px] overflow-hidden bg-transparent">
      <div className="absolute inset-0 opacity-[0.18] [background-image:linear-gradient(rgba(250,250,250,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(250,250,250,0.12)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_44%,rgba(163,163,163,0.12),transparent_22rem),radial-gradient(circle_at_82%_74%,rgba(143,154,136,0.10),transparent_20rem)]" />

      <div className="bond-flow-noise absolute inset-[-10%] grid grid-cols-12 gap-x-4 gap-y-2 font-mono text-[9px] uppercase tracking-[0.22em] text-[#fafafa]/10">
        {Array.from({ length: 240 }).map((_, index) => (
          <span key={index}>{FLOW_WORDS[index % FLOW_WORDS.length]}</span>
        ))}
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 760" preserveAspectRatio="none" aria-hidden="true">
        <defs>
          <linearGradient id="flowSectionRail" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0%" stopColor="#fafafa" stopOpacity="0.18" />
            <stop offset="48%" stopColor="#a3a3a3" stopOpacity="0.72" />
            <stop offset="100%" stopColor="#8f9a88" stopOpacity="0.58" />
          </linearGradient>
          <filter id="flowSectionGlow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M420 112 C510 170 530 245 575 305 C650 405 625 500 698 616" fill="none" stroke="#fafafa" strokeOpacity="0.08" strokeWidth="20" strokeLinecap="round" />
        <path className="animate-[dashFlow_9s_linear_infinite]" d="M420 112 C510 170 530 245 575 305 C650 405 625 500 698 616" fill="none" stroke="url(#flowSectionRail)" strokeWidth="2.3" strokeDasharray="10 14" strokeLinecap="round" />
        <circle r="5" fill="#fafafa" filter="url(#flowSectionGlow)">
          <animateMotion dur="7.5s" repeatCount="indefinite" path="M420 112 C510 170 530 245 575 305 C650 405 625 500 698 616" />
        </circle>
      </svg>

      <div className="absolute inset-0">
        {PATH_LABELS.map((label, index) => (
          <div
            key={label.text}
            className="bond-flow-label absolute border border-[#fafafa]/12 bg-[#111111]/82 px-3 py-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/72 backdrop-blur-sm"
            style={{ left: label.left, top: label.top, animationDelay: `${index * 180}ms` }}
          >
            <span className="mr-2 text-[#a3a3a3]">0{index + 1}</span>{label.text}
          </div>
        ))}
      </div>

      <div className="absolute bottom-8 right-8 max-w-[300px] border-t border-[#fafafa]/15 pt-4 text-right">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/38">Application flow</div>
        <p className="mt-2 text-[15px] leading-[1.45] tracking-[-0.02em] text-[#fafafa]/68">
          One room carries the deal from terms to settlement, with every value-moving state visible.
        </p>
      </div>
    </div>
  )
}
