export default function RoomsLoadingState() {
  const rows = ['Preparing room index', 'Reading Arc state', 'Matching your wallet']

  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="mb-5 flex items-center justify-between gap-4 border-b border-[#ede9df]/10 pb-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Loading rooms</div>
          <p className="mt-2 text-[13px] leading-[1.55] text-[#ede9df]/48">Reading your escrow rooms from Arc.</p>
        </div>
        <div className="grid h-10 w-10 place-items-center border border-[#ede9df]/12 bg-[#111110]">
          <div className="h-2 w-2 rounded-full bg-[#d8b15f]" />
        </div>
      </div>

      <div className="grid gap-px bg-[#ede9df]/10 p-px">
        {rows.map((label, index) => (
          <div key={label} className="grid gap-3 bg-[#111110] p-4 sm:grid-cols-[1fr_160px] sm:items-center">
            <div>
              <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[#ede9df]/28">0{index + 1}</div>
              <div className="mt-2 h-3 w-[min(72%,360px)] bg-[#ede9df]/10" />
              <div className="mt-2 h-2 w-[min(48%,240px)] bg-[#ede9df]/6" />
            </div>
            <div className="justify-self-start border border-[#ede9df]/10 px-3 py-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[#ede9df]/36 sm:justify-self-end">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
