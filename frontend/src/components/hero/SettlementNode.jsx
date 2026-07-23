const NODE_TONES = {
  accent: 'border-[#7c8cff] bg-[#7c8cff] shadow-[0_0_34px_rgba(124,140,255,0.8)]',
  active: 'border-emerald-300 bg-emerald-300 shadow-[0_0_32px_rgba(52,211,153,0.65)]',
  muted: 'border-[#ede9df]/40 bg-[#ede9df]/20',
  light: 'border-[#ede9df] bg-[#ede9df]',
}

const LABEL_POSITIONS = {
  right: 'left-5 top-1/2 -translate-y-1/2',
  left: 'right-5 top-1/2 -translate-y-1/2',
  top: 'bottom-5 left-1/2 -translate-x-1/2',
  topLeft: 'bottom-5 right-0',
  bottom: 'left-1/2 top-6 -translate-x-1/2',
}

export default function SettlementNode({ node }) {
  return (
    <div className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: node.x, top: node.y }}>
      <div className="group relative">
        <div className={`h-4 w-4 rounded-full border ${NODE_TONES[node.tone] || NODE_TONES.light} animate-pulse`} />
        <div className={`absolute z-20 min-w-[145px] border border-[#ede9df]/15 bg-[#050505]/82 px-3 py-2 backdrop-blur transition group-hover:min-w-[220px] group-hover:border-[#ede9df]/40 group-hover:bg-[#050505]/95 ${LABEL_POSITIONS[node.align || 'right']}`}>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-[#ede9df]">{node.id}</div>
          <div className="mt-1 text-[12px] leading-snug text-[#ede9df]/58">{node.note}</div>
          <div className="mt-2 hidden border-t border-[#ede9df]/10 pt-2 text-[11px] leading-[1.45] text-[#ede9df]/48 group-hover:block">
            {node.detail}
          </div>
        </div>
      </div>
    </div>
  )
}
