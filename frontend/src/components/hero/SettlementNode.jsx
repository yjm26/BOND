const NODE_TONES = {
  accent: 'border-[#7c8cff] bg-[#7c8cff] shadow-[0_0_34px_rgba(124,140,255,0.8)]',
  active: 'border-emerald-300 bg-emerald-300 shadow-[0_0_32px_rgba(52,211,153,0.65)]',
  muted: 'border-[#ede9df]/40 bg-[#ede9df]/20',
  light: 'border-[#ede9df] bg-[#ede9df]',
}

export default function SettlementNode({ node }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: node.x, top: node.y }}>
      <div className="group relative">
        <div className={`h-4 w-4 rounded-full border ${NODE_TONES[node.tone] || NODE_TONES.light} animate-pulse`} />
        <div className="absolute left-5 top-1/2 min-w-[150px] -translate-y-1/2 border border-[#ede9df]/15 bg-[#050505]/72 px-3 py-2 backdrop-blur transition group-hover:border-[#ede9df]/35">
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ede9df]">{node.id}</div>
          <div className="mt-1 text-[12px] leading-snug text-[#ede9df]/48">{node.note}</div>
        </div>
      </div>
    </div>
  )
}
