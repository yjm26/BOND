import { useToast } from '../../hooks/useToast'

const primaryButton = 'h-11 w-full border border-[#ede9df] bg-[#ede9df] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40'
const ghostButton = 'h-11 w-full border border-[#ede9df]/14 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40'
const dangerButton = 'h-11 w-full border border-[#c98b4a]/38 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#c98b4a] transition hover:bg-[#c98b4a]/10 disabled:cursor-not-allowed disabled:opacity-40'

function ActionNote({ children, tone = 'muted' }) {
  const toneClass = tone === 'success' ? 'border-[#b7c8a3]/24 bg-[#b7c8a3]/10 text-[#b7c8a3]' : tone === 'danger' ? 'border-[#c98b4a]/32 bg-[#c98b4a]/10 text-[#c98b4a]' : 'border-[#ede9df]/10 bg-[#111110] text-[#b9b2a5]'
  return <div className={`border px-4 py-3 text-center text-[13px] leading-[1.55] ${toneClass}`}>{children}</div>
}

export default function ActionPanel({
  room, id, isCreator, isSeller, isBuyer, isAdmin, isParticipant,
  arbiterName, totalUSDC, joinCode, copied,
  canExpire, canEscalate, canBuyerRefund,
  handleJoin, handleFund, handleDeliver, handleRelease,
  handleBuyerRefund, handleCancel, handleLeave, handleExpire,
  handleEscalate, handleArbRelease, handleArbRefund, handleArbSplit,
  copyInvite,
  showDisputeForm, setShowDisputeForm,
  disputeReason, setDisputeReason,
  handleDispute,
  canMutualCancel,
  mutualCancelStatus,
  hasApprovedMutualCancel,
  counterpartyApprovedMutualCancel,
  mutualCancelReady,
  handleRequestMutualCancel,
  handleRevokeMutualCancel,
  handleExecuteMutualCancel,
  txPending,
}) {
  const { addToast } = useToast()

  const wrap = async (fn, label, successMsg) => {
    addToast(label, 'info')
    try {
      const ok = await fn()
      if (ok !== false) addToast(successMsg, 'ok')
      return ok
    } catch (e) {
      addToast(e.reason || e.message || 'Transaction failed', 'err')
      throw e
    }
  }

  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/40">Room actions</div>
      <div className="flex flex-col gap-3">
        {room.state === 'Created' && canExpire && (
          <button onClick={() => wrap(handleExpire, 'Expiring room…', 'Room expired.')} disabled={txPending} className={dangerButton}>Expired — close room</button>
        )}
        {room.state === 'Created' && !canExpire && !isCreator && (
          <button onClick={handleJoin} disabled={txPending || !joinCode} className={primaryButton}>{!joinCode ? 'Need invite link' : 'Join room'}</button>
        )}
        {room.state === 'Created' && !canExpire && isCreator && (
          <>
            <button onClick={copyInvite} className={primaryButton}>{copied ? 'Copied' : 'Copy invite link'}</button>
            <button onClick={() => wrap(handleCancel, 'Cancelling room…', 'Room cancelled.')} disabled={txPending} className={dangerButton}>Cancel room</button>
          </>
        )}

        {room.state === 'Joined' && canExpire && (
          <button onClick={() => wrap(handleExpire, 'Expiring room…', 'Room expired.')} disabled={txPending} className={dangerButton}>Expired — close room</button>
        )}
        {room.state === 'Joined' && !canExpire && isBuyer && (
          <>
            <button onClick={() => wrap(handleFund, 'Funding room…', 'Room funded!')} disabled={txPending} className={primaryButton}>Fund {totalUSDC} USDC</button>
            <button onClick={() => wrap(handleLeave, 'Leaving room…', 'Left room.')} disabled={txPending} className={ghostButton}>Leave room</button>
          </>
        )}
        {room.state === 'Joined' && !canExpire && isSeller && (
          <>
            <ActionNote>Waiting for buyer to fund.</ActionNote>
            <button onClick={() => wrap(handleLeave, 'Leaving room…', 'Left room.')} disabled={txPending} className={ghostButton}>Leave room</button>
          </>
        )}

        {room.state === 'Funded' && isSeller && (
          <>
            {Number(room.collateralAmount) > 0 && <ActionNote tone="success">Collateral locked: {room.collateralAmount} USDC</ActionNote>}
            <ActionNote>Click below once you have sent the item or delivery proof.</ActionNote>
            <button onClick={() => wrap(handleDeliver, 'Confirming delivery…', 'Delivered! Buyer can now release funds.')} disabled={txPending} className={primaryButton}>{txPending ? 'Processing…' : 'Mark delivered'}</button>
          </>
        )}
        {room.state === 'Funded' && isBuyer && (
          <>
            <ActionNote>Waiting for seller to deliver.</ActionNote>
            {Number(room.collateralAmount) > 0 && <ActionNote tone="success">Seller locked {room.collateralAmount} USDC collateral.</ActionNote>}
            {canBuyerRefund && <button onClick={() => wrap(handleBuyerRefund, 'Requesting refund…', 'Refunded! You receive price + collateral.')} disabled={txPending} className={dangerButton}>Refund — seller missed deadline</button>}
          </>
        )}

        {room.state === 'Delivered' && isBuyer && (
          <>
            <button onClick={() => wrap(handleRelease, 'Confirming receipt…', 'Funds released to seller!')} disabled={txPending} className={primaryButton}>Confirm received</button>
            <button onClick={() => setShowDisputeForm(!showDisputeForm)} className={dangerButton}>Open dispute</button>
          </>
        )}
        {room.state === 'Delivered' && isSeller && canEscalate && (
          <button onClick={() => wrap(handleEscalate, 'Escalating to arbiter…', 'Escalated! Arbiter will review.')} disabled={txPending} className="h-11 w-full border border-[#d8b15f]/40 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#d8b15f] transition hover:bg-[#d8b15f]/10 disabled:opacity-40">Escalate to arbiter</button>
        )}
        {room.state === 'Delivered' && isSeller && !canEscalate && <ActionNote>Waiting for buyer to confirm or dispute.</ActionNote>}

        {showDisputeForm && room.state === 'Delivered' && (
          <div className="border border-[#c98b4a]/35 bg-[#c98b4a]/10 p-4">
            <div className="mb-1 text-[13px] font-medium text-[#c98b4a]">Open dispute</div>
            <div className="mb-3 text-[11px] leading-[1.55] text-[#c98b4a]/80">Explain the issue. This opens a case for arbiter review.</div>
            <textarea placeholder="Why are you disputing?" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} rows={3} className="w-full resize-none border border-[#c98b4a]/28 bg-[#111110] px-3 py-2 text-[13px] text-[#ede9df] outline-none placeholder:text-[#ede9df]/26" />
            <div className="mt-3 flex gap-2">
              <button onClick={handleDispute} disabled={txPending || !disputeReason.trim()} className={primaryButton}>Submit dispute</button>
              <button onClick={() => setShowDisputeForm(false)} className={ghostButton}>Cancel</button>
            </div>
          </div>
        )}

        {room.state === 'Disputed' && (
          <div className="border border-[#c98b4a]/35 bg-[#c98b4a]/10 p-4">
            <div className="text-center text-[13px] font-medium text-[#c98b4a]">Under dispute</div>
            <div className="mt-1 text-center text-[12px] text-[#c98b4a]/80">{arbiterName} will review and decide on-chain.</div>
            {isAdmin ? (
              <div className="mt-3 flex flex-col gap-2">
                <button onClick={() => wrap(handleArbRelease, 'Resolving…', 'Released to seller!')} disabled={txPending} className={primaryButton}>Release to seller</button>
                <button onClick={() => wrap(handleArbRefund, 'Resolving…', 'Refunded to buyer!')} disabled={txPending} className={ghostButton}>Refund to buyer</button>
                <button onClick={() => wrap(handleArbSplit, 'Splitting…', '50/50 split executed!')} disabled={txPending} className={ghostButton}>50/50 split</button>
              </div>
            ) : <div className="mt-3 text-center text-[12px] text-[#c98b4a]/80">Awaiting arbiter decision. Funds are frozen.</div>}
          </div>
        )}

        {canMutualCancel && (
          <div className={`border p-4 ${mutualCancelReady ? 'border-[#d8b15f]/30 bg-[#d8b15f]/[0.07]' : 'border-[#ede9df]/10 bg-[#111110]'}`}>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/40">Mutual cancel</div>
            {mutualCancelReady ? (
              <>
                <ActionNote tone="success">Both parties agreed. All funds will be refunded.</ActionNote>
                <button onClick={() => wrap(handleExecuteMutualCancel, 'Executing mutual cancel…', 'Deal cancelled. All funds refunded.')} disabled={txPending} className="mt-3 h-10 w-full border border-[#d8b15f]/40 text-[10px] font-mono uppercase tracking-[0.16em] text-[#d8b15f] hover:bg-[#d8b15f]/10 disabled:opacity-40">Execute mutual cancel</button>
              </>
            ) : (
              <>
                <div className="mb-3 flex items-center justify-between text-[12px] text-[#b9b2a5]"><span>Creator {mutualCancelStatus.creatorApproved ? 'approved' : 'pending'}</span><span>Counterparty {mutualCancelStatus.counterpartyApproved ? 'approved' : 'pending'}</span></div>
                <div className="mb-3 text-center text-[12px] text-[#b9b2a5]">{hasApprovedMutualCancel ? 'You approved. Waiting for counterparty.' : counterpartyApprovedMutualCancel ? 'Counterparty approved. Your turn.' : 'Both parties must agree to cancel.'}</div>
                {!hasApprovedMutualCancel && <button onClick={() => wrap(handleRequestMutualCancel, 'Requesting mutual cancel…', 'You approved mutual cancel. Waiting for counterparty.')} disabled={txPending} className={ghostButton}>Request mutual cancel</button>}
                {hasApprovedMutualCancel && !counterpartyApprovedMutualCancel && <button onClick={() => wrap(handleRevokeMutualCancel, 'Revoking…', 'You revoked your approval.')} disabled={txPending} className={dangerButton}>Revoke approval</button>}
              </>
            )}
          </div>
        )}

        {['Released', 'Refunded', 'Expired', 'Cancelled'].includes(room.state) && <ActionNote>This deal is closed.</ActionNote>}
      </div>
    </div>
  )
}
