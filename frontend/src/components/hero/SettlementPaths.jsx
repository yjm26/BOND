export default function SettlementPaths() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 760" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="bondPath" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#ede9df" stopOpacity="0.18" />
          <stop offset="52%" stopColor="#7c8cff" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <path className="animate-[dashFlow_5s_linear_infinite]" d="M110 235 C220 140 325 155 365 392 C405 630 550 660 635 560" fill="none" stroke="url(#bondPath)" strokeWidth="2" strokeDasharray="9 13" />
      <path className="animate-[dashFlow_6.5s_linear_infinite]" d="M370 165 C462 220 550 235 610 270 C650 294 637 350 594 388" fill="none" stroke="#ede9df" strokeOpacity="0.24" strokeWidth="1.5" strokeDasharray="4 12" />
      <path className="animate-[dashFlow_7s_linear_infinite]" d="M364 392 C455 402 520 457 545 565" fill="none" stroke="#ede9df" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="4 12" />
    </svg>
  )
}
