export default function HeroFactStrip({ facts }) {
  return (
    <div className="mt-14 grid max-w-[780px] grid-cols-2 border-y border-[#0d0d0b]/15 font-mono text-[10px] uppercase tracking-[0.16em] text-[#0d0d0b]/70 sm:grid-cols-4 lg:mt-0">
      {facts.map(([label, value], index) => (
        <div key={label} className={`px-4 py-4 ${index > 0 ? 'border-l border-[#0d0d0b]/15' : ''}`}>
          <div className="text-[#0d0d0b]/40">{label}</div>
          <div className="mt-1 leading-snug text-[#0d0d0b]">{value}</div>
        </div>
      ))}
    </div>
  )
}
