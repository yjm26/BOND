import { useId, useState } from 'react'

export default function HeroHotspot({ hotspot, active, onEnter, onLeave }) {
  const tipId = useId()
  const [pinned, setPinned] = useState(false)
  const open = active || pinned

  return (
    <div
      className="absolute z-20"
      style={hotspot.style}
      onMouseEnter={() => onEnter(hotspot.id)}
      onMouseLeave={() => {
        if (!pinned) onLeave(hotspot.id)
      }}
    >
      <button
        type="button"
        aria-describedby={open ? tipId : undefined}
        aria-expanded={open}
        onFocus={() => onEnter(hotspot.id)}
        onBlur={() => {
          if (!pinned) onLeave(hotspot.id)
        }}
        onClick={() => setPinned((value) => !value)}
        className={`group relative flex h-7 items-center gap-2 border px-2.5 font-mono text-[10px] uppercase tracking-[0.16em] transition duration-160 ease-out active:scale-[0.97] ${
          open
            ? 'border-[#fafafa] bg-[#fafafa] text-[#0a0a0a]'
            : 'border-[#fafafa]/28 bg-[#0a0a0a]/70 text-[#fafafa]/78 hover:border-[#fafafa]/55 hover:text-[#fafafa]'
        }`}
      >
        <span
          className={`h-1.5 w-1.5 rounded-full ${open ? 'bg-[#0a0a0a]' : 'bg-[#fafafa] animate-pulse'}`}
          aria-hidden="true"
        />
        {hotspot.label}
      </button>

      {open && (
        <div
          id={tipId}
          role="tooltip"
          className="absolute left-0 top-[calc(100%+10px)] z-30 w-[min(280px,70vw)] border border-[#fafafa]/14 bg-[#111111] p-3.5 text-left shadow-2xl"
        >
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3a3a3]">{hotspot.title}</div>
          <p className="mt-2 text-[13px] leading-[1.55] text-[#fafafa]/78">{hotspot.body}</p>
        </div>
      )}
    </div>
  )
}
