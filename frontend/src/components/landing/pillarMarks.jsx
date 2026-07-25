/** Isometric line marks — Linear FIG density, BOND stark mono. */

export function RoomMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Vault / room chamber */}
      <path
        d="M40 48 L80 28 L120 48 L120 100 L80 120 L40 100 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M40 48 L80 68 L120 48" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
      <path d="M80 68 L80 120" stroke="currentColor" strokeWidth="1.2" />
      {/* Inner lock plane */}
      <path
        d="M56 58 L80 46 L104 58 L104 82 L80 94 L56 82 Z"
        stroke="currentColor"
        strokeWidth="1.1"
        strokeLinejoin="round"
        opacity="0.7"
      />
      <circle cx="80" cy="68" r="6" stroke="currentColor" strokeWidth="1.1" opacity="0.85" />
      <path d="M80 74 V84" stroke="currentColor" strokeWidth="1.1" opacity="0.85" />
    </svg>
  )
}

export function MarketMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Cluster of listing boards */}
      <path
        d="M48 70 L72 56 L96 70 L96 98 L72 112 L48 98 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />
      <path d="M48 70 L72 84 L96 70" stroke="currentColor" strokeWidth="1.1" opacity="0.75" />
      <path
        d="M70 46 L94 32 L118 46 L118 74 L94 88 L70 74 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.9"
      />
      <path d="M70 46 L94 60 L118 46" stroke="currentColor" strokeWidth="1.1" opacity="0.65" />
      <path
        d="M28 54 L52 40 L76 54 L76 82 L52 96 L28 82 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.55"
      />
      <path d="M28 54 L52 68 L76 54" stroke="currentColor" strokeWidth="1.1" opacity="0.45" />
      {/* Price ticks */}
      <path d="M58 62 H66" stroke="currentColor" strokeWidth="1.1" opacity="0.7" />
      <path d="M84 48 H94" stroke="currentColor" strokeWidth="1.1" opacity="0.8" />
    </svg>
  )
}

export function ExitMark({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 160 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Three exit planes fanning forward */}
      <path
        d="M36 92 L56 36 L68 40 L48 96 Z"
        stroke="currentColor"
        strokeWidth="1.15"
        strokeLinejoin="round"
        opacity="0.45"
      />
      <path
        d="M54 96 L78 34 L92 38 L68 100 Z"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinejoin="round"
        opacity="0.75"
      />
      <path
        d="M74 100 L102 32 L118 36 L90 104 Z"
        stroke="currentColor"
        strokeWidth="1.25"
        strokeLinejoin="round"
      />
      {/* Base rail */}
      <path d="M32 104 H122" stroke="currentColor" strokeWidth="1.1" opacity="0.35" />
      <path d="M40 110 H114" stroke="currentColor" strokeWidth="1.1" opacity="0.2" />
    </svg>
  )
}
