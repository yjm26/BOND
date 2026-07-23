import { REVIEW_TIMEOUTS } from './createRoomData'

export default function ReviewTimeoutSelector({ dealType, fromMarket, onChange }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/42">Review timeout</div>
      <div className="grid gap-2 sm:grid-cols-3">
        {REVIEW_TIMEOUTS.map((timeout) => (
          <button key={timeout.key} type="button" onClick={() => onChange(timeout.key)} disabled={fromMarket} className={`border p-4 text-left transition ${dealType === timeout.key ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 bg-[#111110] text-[#ede9df]/58 hover:border-[#ede9df]/34 hover:text-[#ede9df]'} ${fromMarket ? 'cursor-not-allowed opacity-60' : ''}`}>
            <div className="text-[14px] font-medium">{timeout.label}</div>
            <div className="mt-1 text-[12px] leading-[1.45] opacity-75">{timeout.desc}</div>
          </button>
        ))}
      </div>
      <p className="mt-2 text-[12px] leading-[1.55] text-[#b9b2a5]">After seller marks delivered, buyer can confirm or dispute within this window. If buyer is silent, seller can escalate to arbiter.</p>
    </div>
  )
}
