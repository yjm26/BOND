export default function HeroHotspotBar({ hotspots, activeId, onSelect }) {
  const active = hotspots.find((item) => item.id === activeId) || null

  return (
    <div className="border-b border-white/10 bg-[#0a0a0a] px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
        <div className="flex min-w-0 flex-1 flex-wrap gap-2">
          {hotspots.map((hotspot) => {
            const on = activeId === hotspot.id
            return (
              <button
                key={hotspot.id}
                type="button"
                onMouseEnter={() => onSelect(hotspot.id)}
                onFocus={() => onSelect(hotspot.id)}
                onClick={() => onSelect(on ? null : hotspot.id)}
                className={`inline-flex h-9 shrink-0 items-center gap-2 border px-3 font-mono text-[11px] font-medium uppercase tracking-[0.14em] transition duration-160 ease-out active:scale-[0.97] ${
                  on
                    ? 'border-white bg-white text-black'
                    : 'border-white/25 bg-black text-white/80 hover:border-white/50 hover:text-white'
                }`}
              >
                <span
                  className={`h-1.5 w-1.5 shrink-0 rounded-full ${on ? 'bg-black' : 'bg-white'}`}
                  aria-hidden="true"
                />
                <span className="whitespace-nowrap">{hotspot.label}</span>
              </button>
            )
          })}
        </div>

        <div className="min-h-[48px] w-full max-w-[400px] lg:text-right">
          {active ? (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-white/45">{active.title}</div>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-white/75">{active.body}</p>
            </>
          ) : (
            <p className="text-[13px] leading-[1.5] text-white/40">
              Hover a label.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
