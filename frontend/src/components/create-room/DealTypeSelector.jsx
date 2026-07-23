import { DEAL_TYPES } from './createRoomData'

export default function DealTypeSelector({ dealType, fromMarket, onChange }) {
  return (
    <div>
      <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/42">Deal type</div>
      <div className="grid gap-2">
        {DEAL_TYPES.map((type) => (
          <button key={type.key} type="button" onClick={() => onChange(type.key)} disabled={fromMarket} className={`border p-4 text-left transition ${dealType === type.key ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 bg-[#111110] text-[#ede9df]/58 hover:border-[#ede9df]/34 hover:text-[#ede9df]'} ${fromMarket ? 'cursor-not-allowed opacity-60' : ''}`}>
            <div className="text-[14px] font-medium">{type.label}</div>
            <div className="mt-1 text-[12px] opacity-75">{type.desc}</div>
          </button>
        ))}
      </div>
    </div>
  )
}
