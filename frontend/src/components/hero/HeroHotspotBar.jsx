export default function HeroHotspotBar({ hotspots, activeId, onSelect }) {
  const active = hotspots.find((item) => item.id === activeId) || null

  return (
    <div className="border-b border-[#fafafa]/10 bg-[#0a0a0a] px-3 py-3 sm:px-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {hotspots.map((hotspot) => {
            const on = activeId === hotspot.id
            return (
              <button
                key={hotspot.id}
                type="button"
                onMouseEnter={() => onSelect(hotspot.id)}
                onFocus={() => onSelect(hotspot.id)}
                onClick={() => onSelect(on ? null : hotspot.id)}
                className={`inline-flex h-8 items-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.16em] transition duration-160 ease-out active:scale-[0.97] ${
                  on
                    ? 'border-[#fafafa] bg-[#fafafa] text-[#0a0a0a]'
                    : 'border-[#fafafa]/16 bg-transparent text-[#fafafa]/68 hover:border-[#fafafa]/34 hover:text-[#fafafa]'
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${on ? 'bg-[#0a0a0a]' : 'bg-[#fafafa]/70'}`} />
                {hotspot.label}
              </button>
            )
          })}
        </div>

        <div className="min-h-[52px] max-w-[420px] lg:text-right">
          {active ? (
            <>
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3a3a3]">{active.title}</div>
              <p className="mt-1.5 text-[13px] leading-[1.5] text-[#fafafa]/72">{active.body}</p>
            </>
          ) : (
            <p className="text-[13px] leading-[1.5] text-[#737373]">
              Hover a label to inspect that part of the room.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
