export default function SettlementPaths() {
  return (
    <svg className="absolute inset-0 h-full w-full" viewBox="0 0 760 760" preserveAspectRatio="none" aria-hidden="true">
      <defs>
        <linearGradient id="mainFlow" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#ede9df" stopOpacity="0.48" />
          <stop offset="50%" stopColor="#7c8cff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#34d399" stopOpacity="0.68" />
        </linearGradient>
        <linearGradient id="infraFlow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7c8cff" stopOpacity="0.78" />
          <stop offset="100%" stopColor="#ede9df" stopOpacity="0.24" />
        </linearGradient>
        <linearGradient id="disputeFlow" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#ede9df" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.62" />
        </linearGradient>
        <marker id="arrowMain" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#34d399" fillOpacity="0.9" />
        </marker>
        <marker id="arrowSoft" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill="#ede9df" fillOpacity="0.55" />
        </marker>
      </defs>

      {/* Main rail: clean direction from buyer to escrow to seller. */}
      <path d="M155 335 H365 H585" fill="none" stroke="#ede9df" strokeOpacity="0.08" strokeWidth="18" strokeLinecap="round" />
      <path className="animate-[dashFlow_5s_linear_infinite]" d="M155 335 H350" fill="none" stroke="url(#mainFlow)" strokeWidth="2.8" strokeDasharray="12 12" strokeLinecap="round" markerEnd="url(#arrowSoft)" />
      <path className="animate-[dashFlow_5s_linear_infinite]" d="M382 335 H585" fill="none" stroke="url(#mainFlow)" strokeWidth="2.8" strokeDasharray="12 12" strokeLinecap="round" markerEnd="url(#arrowMain)" />

      {/* Infrastructure rail from Arc USDC into escrow. */}
      <path d="M365 140 V318" fill="none" stroke="#ede9df" strokeOpacity="0.05" strokeWidth="10" strokeLinecap="round" />
      <path className="animate-[dashFlow_7s_linear_infinite]" d="M365 140 V318" fill="none" stroke="url(#infraFlow)" strokeWidth="2" strokeDasharray="5 12" strokeLinecap="round" markerEnd="url(#arrowSoft)" />

      {/* Fallback branch leaves escrow only when a dispute is opened. */}
      <path d="M365 352 V575" fill="none" stroke="#ede9df" strokeOpacity="0.045" strokeWidth="10" strokeLinecap="round" />
      <path className="animate-[dashFlow_8s_linear_infinite]" d="M365 352 V575" fill="none" stroke="url(#disputeFlow)" strokeWidth="2" strokeDasharray="4 12" strokeLinecap="round" markerEnd="url(#arrowSoft)" />

      <g className="font-mono text-[10px] uppercase tracking-[0.18em]" fill="#ede9df" fillOpacity="0.42">
        <text x="214" y="314">fund usdc</text>
        <text x="438" y="314">release</text>
        <text x="386" y="236">arc usdc</text>
        <text x="386" y="470">dispute</text>
      </g>
    </svg>
  )
}
