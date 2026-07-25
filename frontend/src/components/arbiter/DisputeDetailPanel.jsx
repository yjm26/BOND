import { Link } from 'react-router-dom'
import ArbiterDecisionPanel from './ArbiterDecisionPanel'
import { formatAddress } from '../../utils/constants'
import { formatHash, formatTimestamp, formatUsdc } from './arbiterUtils'

function Fact({ label, children }) {
  return <div className="border border-[#fafafa]/10 bg-[#0a0a0a] p-4"><div className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/34">{label}</div><div className="mt-2 text-[13px] leading-[1.6] text-[#fafafa]">{children}</div></div>
}

export default function DisputeDetailPanel({ room, role, resolving, onResolve, onSplit, txStatus }) {
  if (!room) {
    return (
      <div className="border border-[#fafafa]/10 bg-[#111111] p-8">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Select a dispute</div>
        <h2 className="mt-4 text-[34px] font-medium leading-none tracking-[-0.06em] text-[#fafafa]">Review before resolving.</h2>
        <p className="mt-3 text-[13px] leading-[1.7] text-[#a3a3a3]">Pick a disputed room from the queue. Arbiter decisions are on-chain and move locked USDC, so the desk keeps room facts, parties, proof, and evidence visible together.</p>
      </div>
    )
  }

  return (
    <div className="grid gap-5">
      <div className="border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#b87333]">Room #{room.id} · Dispute review</div>
            <h2 className="mt-4 text-[38px] font-medium leading-[0.95] tracking-[-0.07em] text-[#fafafa]">{room.itemDescription || 'Untitled room'}</h2>
          </div>
          <Link to={`/room/${room.id}`} className="h-11 border border-[#fafafa]/14 px-4 py-3 text-center font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">Open room</Link>
        </div>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Fact label="Locked escrow"><span className="font-mono text-[20px]">{formatUsdc(room.fundedAmount)} USDC</span></Fact>
          <Fact label="Seller bond"><span className="font-mono text-[20px]">{formatUsdc(room.collateralAmount)} USDC</span></Fact>
          <Fact label="Disputed at">{formatTimestamp(room.disputedAt)}</Fact>
          <Fact label="Delivery proof">{formatHash(room.deliveryProofHash)}</Fact>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <Fact label="Buyer"><span className="font-mono break-all">{room.buyer}</span></Fact>
            <Fact label="Seller"><span className="font-mono break-all">{room.seller}</span></Fact>
            <Fact label="Creator"><span className="font-mono">{formatAddress(room.creator)}</span></Fact>
            <Fact label="Counterparty"><span className="font-mono">{formatAddress(room.counterparty)}</span></Fact>
          </div>

          <div className="border border-[#fafafa]/10 bg-[#111111] p-5">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/40">Evidence</div>
            {room.evidence?.length ? (
              <div className="mt-4 grid gap-3">
                {room.evidence.map((item, index) => (
                  <div key={`${item.submitter}-${index}`} className="border border-[#fafafa]/10 bg-[#0a0a0a] p-4">
                    <div className="flex flex-wrap items-center justify-between gap-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/34">
                      <span>{item.evidenceType || 'Evidence'} · {formatAddress(item.submitter)}</span>
                      <span>{formatTimestamp(Number(item.timestamp))}</span>
                    </div>
                    {item.description && <p className="mt-3 text-[13px] leading-[1.7] text-[#a3a3a3]">{item.description}</p>}
                    {item.evidenceRef && <a href={item.evidenceRef} target="_blank" rel="noopener noreferrer" className="mt-3 block break-all font-mono text-[12px] text-[#a3a3a3] hover:text-[#fafafa]">{item.evidenceRef}</a>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 border border-dashed border-[#fafafa]/14 bg-[#0a0a0a] p-5 text-[13px] text-[#a3a3a3]">No evidence attached through the contract yet. Open the room to inspect delivery proof and off-chain context before deciding.</div>
            )}
          </div>
        </div>

        <ArbiterDecisionPanel room={room} role={role} resolving={resolving} txStatus={txStatus} onResolve={onResolve} onSplit={onSplit} />
      </div>
    </div>
  )
}
