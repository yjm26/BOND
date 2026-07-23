export default function RoomEmptyState({ wallet, status }) {
  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] place-items-center pb-4">
        <div className="w-full max-w-[520px] border border-[#ede9df]/10 bg-[#20201f] p-8 text-center">
          <div className={`font-mono text-[10px] uppercase tracking-[0.22em] ${wallet ? 'text-[#c98b4a]' : 'text-[#d8b15f]'}`}>
            {wallet ? 'Room unavailable' : 'Wallet required'}
          </div>
          <h2 className="mt-4 text-[34px] font-medium tracking-[-0.07em] text-[#ede9df]">
            {wallet ? 'Room not found' : 'Connect wallet to view this room.'}
          </h2>
          <p className="mt-3 text-[13px] leading-[1.6] text-[#b9b2a5]">
            {wallet ? (status?.msg || 'This room does not exist or could not be loaded.') : 'Use the Connect wallet button in the top navigation. No room action is sent until you choose one.'}
          </p>
        </div>
      </div>
    </section>
  )
}
