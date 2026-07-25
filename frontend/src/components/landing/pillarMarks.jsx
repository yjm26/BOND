/** Isometric line marks — Linear FIG density, BOND stark mono. */

const stroke = {
  color: '#f5f5f5',
  width: 1.35,
}

export function RoomMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Stacked vault — purpose-built box */}
      <path
        d="M42 52 L90 28 L138 52 L138 108 L90 132 L42 108 Z"
        stroke={stroke.color}
        strokeWidth={stroke.width}
        strokeLinejoin="round"
      />
      <path d="M42 52 L90 76 L138 52" stroke={stroke.color} strokeWidth={stroke.width} strokeLinejoin="round" />
      <path d="M90 76 L90 132" stroke={stroke.color} strokeWidth={stroke.width} />
      {/* Layers */}
      <path d="M50 62 L90 42 L130 62" stroke={stroke.color} strokeWidth="1.15" opacity="0.55" />
      <path d="M54 70 L90 52 L126 70" stroke={stroke.color} strokeWidth="1.15" opacity="0.4" />
      {/* Lock disc */}
      <ellipse cx="90" cy="54" rx="14" ry="8" stroke={stroke.color} strokeWidth="1.2" opacity="0.9" />
      <path d="M90 46 V38" stroke={stroke.color} strokeWidth="1.2" opacity="0.85" />
      <circle cx="90" cy="36" r="3.5" stroke={stroke.color} strokeWidth="1.15" />
    </svg>
  )
}

export function MarketMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Listing cubes cluster */}
      <g stroke={stroke.color} strokeWidth={stroke.width} strokeLinejoin="round">
        <path d="M34 78 L62 62 L90 78 L90 108 L62 124 L34 108 Z" opacity="0.55" />
        <path d="M34 78 L62 94 L90 78" opacity="0.45" />
        <path d="M62 94 L62 124" opacity="0.45" />

        <path d="M70 70 L98 54 L126 70 L126 100 L98 116 L70 100 Z" opacity="0.85" />
        <path d="M70 70 L98 86 L126 70" opacity="0.7" />
        <path d="M98 86 L98 116" opacity="0.7" />

        <path d="M92 48 L120 32 L148 48 L148 78 L120 94 L92 78 Z" />
        <path d="M92 48 L120 64 L148 48" />
        <path d="M120 64 L120 94" />
      </g>
      {/* Accent ticks */}
      <path d="M104 56 H116" stroke={stroke.color} strokeWidth="1.2" opacity="0.8" />
      <path d="M82 78 H92" stroke={stroke.color} strokeWidth="1.2" opacity="0.65" />
    </svg>
  )
}

export function ExitMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 180 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Fan of exit panels */}
      <g stroke={stroke.color} strokeLinejoin="round">
        <path d="M38 108 L62 36 L78 40 L54 112 Z" strokeWidth="1.2" opacity="0.4" />
        <path d="M58 112 L86 32 L104 36 L76 116 Z" strokeWidth="1.25" opacity="0.7" />
        <path d="M80 116 L112 28 L132 32 L100 120 Z" strokeWidth={stroke.width} />
      </g>
      <path d="M34 118 H140" stroke={stroke.color} strokeWidth="1.15" opacity="0.35" />
      <path d="M42 124 H132" stroke={stroke.color} strokeWidth="1.1" opacity="0.2" />
      {/* Direction ticks on front plane */}
      <path d="M118 48 L126 50" stroke={stroke.color} strokeWidth="1.2" opacity="0.85" />
      <path d="M114 62 L124 65" stroke={stroke.color} strokeWidth="1.2" opacity="0.7" />
      <path d="M110 76 L122 80" stroke={stroke.color} strokeWidth="1.2" opacity="0.55" />
    </svg>
  )
}
