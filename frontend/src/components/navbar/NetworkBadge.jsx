export default function NetworkBadge({ tone = 'light' }) {
  const dark = tone === 'dark'

  return (
    <div className={`hidden h-9 items-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.16em] lg:inline-flex ${
      dark
        ? 'border-[#fafafa]/14 bg-[#fafafa]/8 text-[#fafafa]/60'
        : 'border-[#0a0a0a]/12 bg-[#fafafa]/70 text-[#0a0a0a]/55'
    }`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#a3a3a3]" />
      Arc Testnet
    </div>
  )
}
