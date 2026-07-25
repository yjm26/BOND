export default function RoomsLoadingState() {
  const rows = ['Preparing room index', 'Reading Arc state', 'Matching your wallet']

  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#fafafa]/10 pb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Loading rooms</div>
          <p className="mt-2 text-[13px] leading-[1.55] text-[#fafafa]/48">Reading your escrow rooms from Arc.</p>
        </div>
        <div className="grid h-10 w-10 place-items-center border border-[#fafafa]/12 bg-[#0a0a0a]">
          <div className="h-2 w-2 rounded-full bg-[#a3a3a3]" />
        </div>
      </div>

      <div className="grid gap-px bg-[#fafafa]/10 p-px">
        {rows.map((label, index) => (
          <div key={label} className="grid gap-3 bg-[#0a0a0a] p-4 sm:grid-cols-[1fr_160px] sm:items-center">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#fafafa]/28">0{index + 1}</div>
              <div className="mt-2 h-3 w-[min(72%,360px)] bg-[#fafafa]/10" />
              <div className="mt-2 h-2 w-[min(48%,240px)] bg-[#fafafa]/6" />
            </div>
            <div className="justify-self-start border border-[#fafafa]/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#fafafa]/36 sm:justify-self-end">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
