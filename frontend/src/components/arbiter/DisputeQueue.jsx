import DisputeCard from './DisputeCard'

export default function DisputeQueue({ disputes, selectedId, onSelect, loading, error }) {
  if (loading) {
    return <div className="border border-[#ede9df]/10 bg-[#20201f] p-6 text-[13px] text-[#b9b2a5]">Scanning rooms on Arc Testnet…</div>
  }
  if (error) {
    return <div className="border border-[#c98b4a]/35 bg-[#c98b4a]/10 p-5 text-[13px] text-[#c98b4a]">{error}</div>
  }
  if (!disputes.length) {
    return (
      <div className="border border-[#ede9df]/10 bg-[#20201f] p-8 text-center">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Queue clear</div>
        <h2 className="mt-4 text-[34px] font-medium leading-none tracking-[-0.06em] text-[#ede9df]">No disputed rooms.</h2>
        <p className="mx-auto mt-3 max-w-[420px] text-[13px] leading-[1.7] text-[#b9b2a5]">When a buyer disputes or a seller escalates no response, the room will appear here for arbiter review.</p>
      </div>
    )
  }
  return (
    <div className="grid gap-3">
      {disputes.map((room) => <DisputeCard key={room.id} room={room} active={room.id === selectedId} onClick={() => onSelect(room)} />)}
    </div>
  )
}
