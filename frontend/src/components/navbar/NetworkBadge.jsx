export default function NetworkBadge({ tone = 'light' }) {
  const dark = tone === 'dark'

  return (
    <div className={`hidden h-9 items-center gap-2 border px-3 font-mono text-[10px] uppercase tracking-[0.16em] lg:inline-flex ${
      dark
        ? 'border-[#ede9df]/14 bg-[#ede9df]/8 text-[#ede9df]/60'
        : 'border-[#0d0d0b]/12 bg-[#ede9df]/70 text-[#0d0d0b]/55'
    }`}>
      <span className="h-1.5 w-1.5 rounded-full bg-[#d8b15f]" />
      Arc Testnet
    </div>
  )
}
