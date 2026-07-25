import { useState } from 'react'
import ConfirmModal from '../ConfirmModal'

const primaryButton = 'h-11 w-full border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition hover:bg-transparent hover:text-[var(--a-ink)] disabled:cursor-not-allowed disabled:opacity-40'
const ghostButton = 'h-11 w-full border border-[var(--a-line)] px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-ink)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] disabled:cursor-not-allowed disabled:opacity-40'
const dangerButton = 'h-11 w-full border border-[#b87333]/38 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[#b87333] transition hover:bg-[#b87333]/10 disabled:cursor-not-allowed disabled:opacity-40'

function ActionNote({ children, tone = 'muted' }) {
  const toneClass = tone === 'success' ? 'border-[#8f9a88]/24 bg-[#8f9a88]/10 text-[#8f9a88]' : tone === 'danger' ? 'border-[#b87333]/32 bg-[#b87333]/10 text-[#b87333]' : 'border-[var(--a-line)] bg-[var(--a-panel)] text-[var(--a-muted)]'
  return <div className={`border px-4 py-3 text-center text-[13px] leading-[1.55] ${toneClass}`}>{children}</div>
}

const closeActionCopy = {
  cancel: {
    eyebrow: 'Close room',
    title: 'Cancel this room?',
    description: 'This closes the room before a counterparty joins. Any locked collateral is returned on-chain after the transaction confirms.',
    confirmLabel: 'Cancel room',
  },
  leave: {
    eyebrow: 'Leave room',
    title: 'Leave this room?',
    description: 'You will leave the room before funding starts. If collateral is locked for your side, it is returned on-chain after confirmation.',
    confirmLabel: 'Leave room',
  },
  expire: {
    eyebrow: 'Expire room',
    title: 'Close expired room?',
    description: 'This closes the stale room and returns eligible collateral according to the contract state.',
    confirmLabel: 'Close room',
  },
  executeMutual: {
    eyebrow: 'Mutual cancel',
    title: 'Execute mutual cancel?',
    description: 'Both parties approved cancellation. This transaction closes the room and refunds all eligible funds on-chain.',
    confirmLabel: 'Execute cancel',
  },
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
  const [pendingCloseAction, setPendingCloseAction] = useState(null)
  const pendingCopy = pendingCloseAction ? closeActionCopy[pendingCloseAction] : null

  const wrap = async (fn) => fn()

  const runCloseAction = async () => {
    const handlers = {
      cancel: handleCancel,
      leave: handleLeave,
      expire: handleExpire,
      executeMutual: handleExecuteMutualCancel,
    }
    const ok = await handlers[pendingCloseAction]?.()
    if (ok !== false) setPendingCloseAction(null)
  }

  return (
    <>
      <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5">
        <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink)]/40">Room actions</div>
        <div className="flex flex-col gap-3">
          {room.state === 'Created' && canExpire && (
            <button onClick={() => setPendingCloseAction('expire')} disabled={txPending} className={dangerButton}>Expired — close room</button>
          )}
          {room.state === 'Created' && !canExpire && !isCreator && (
            <button onClick={handleJoin} disabled={txPending || !joinCode} className={primaryButton}>{!joinCode ? 'Need invite link' : 'Join room'}</button>
          )}
          {room.state === 'Created' && !canExpire && isCreator && (
            <>
              <button onClick={copyInvite} className={primaryButton}>{copied ? 'Copied' : 'Copy invite link'}</button>
              <button onClick={() => setPendingCloseAction('cancel')} disabled={txPending} className={dangerButton}>Cancel room</button>
            </>
          )}

          {room.state === 'Joined' && canExpire && (
            <button onClick={() => setPendingCloseAction('expire')} disabled={txPending} className={dangerButton}>Expired — close room</button>
          )}
          {room.state === 'Joined' && !canExpire && isBuyer && (
            <>
              <button onClick={() => wrap(handleFund)} disabled={txPending} className={primaryButton}>Fund {totalUSDC} USDC</button>
              <button onClick={() => setPendingCloseAction('leave')} disabled={txPending} className={ghostButton}>Leave room</button>
            </>
          )}
          {room.state === 'Joined' && !canExpire && isSeller && (
            <>
              <ActionNote>Waiting for buyer to fund.</ActionNote>
              <button onClick={() => setPendingCloseAction('leave')} disabled={txPending} className={ghostButton}>Leave room</button>
            </>
          )}

          {room.state === 'Funded' && isSeller && (
            <>
              {Number(room.collateralAmount) > 0 && <ActionNote tone="success">Collateral locked: {room.collateralAmount} USDC</ActionNote>}
              <ActionNote>Click below once you have sent the item or delivery proof.</ActionNote>
              <button onClick={() => wrap(handleDeliver)} disabled={txPending} className={primaryButton}>{txPending ? 'Processing…' : 'Mark delivered'}</button>
            </>
          )}
          {room.state === 'Funded' && isBuyer && (
            <>
              <ActionNote>Waiting for seller to deliver.</ActionNote>
              {Number(room.collateralAmount) > 0 && <ActionNote tone="success">Seller locked {room.collateralAmount} USDC collateral.</ActionNote>}
              {canBuyerRefund && <button onClick={() => wrap(handleBuyerRefund)} disabled={txPending} className={dangerButton}>Refund — seller missed deadline</button>}
            </>
          )}

          {room.state === 'Delivered' && isBuyer && (
            <>
              <button onClick={() => wrap(handleRelease)} disabled={txPending} className={primaryButton}>Confirm received</button>
              <button onClick={() => setShowDisputeForm(!showDisputeForm)} className={dangerButton}>Open dispute</button>
            </>
          )}
          {room.state === 'Delivered' && isSeller && canEscalate && (
            <button onClick={() => wrap(handleEscalate)} disabled={txPending} className="h-11 w-full border border-[var(--a-muted)]/40 px-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--a-muted)] transition hover:bg-[var(--a-muted)]/10 disabled:opacity-40">Escalate to arbiter</button>
          )}
          {room.state === 'Delivered' && isSeller && !canEscalate && <ActionNote>Waiting for buyer to confirm or dispute.</ActionNote>}

          {showDisputeForm && room.state === 'Delivered' && (
            <div className="border border-[#b87333]/35 bg-[#b87333]/10 p-4">
              <div className="mb-1 text-[13px] font-medium text-[#b87333]">Open dispute</div>
              <div className="mb-3 text-[11px] leading-[1.55] text-[#b87333]/80">Explain the issue. This opens a case for arbiter review.</div>
              <textarea placeholder="Why are you disputing?" value={disputeReason} onChange={(e) => setDisputeReason(e.target.value)} rows={3} className="w-full resize-none border border-[#b87333]/28 bg-[var(--a-panel)] px-3 py-2 text-[13px] text-[var(--a-ink)] outline-none placeholder:text-[var(--a-ink)]/26" />
              <div className="mt-3 flex gap-2">
                <button onClick={handleDispute} disabled={txPending || !disputeReason.trim()} className={primaryButton}>Submit dispute</button>
                <button onClick={() => setShowDisputeForm(false)} className={ghostButton}>Cancel</button>
              </div>
            </div>
          )}

          {room.state === 'Disputed' && (
            <div className="border border-[#b87333]/35 bg-[#b87333]/10 p-4">
              <div className="text-center text-[13px] font-medium text-[#b87333]">Under dispute</div>
              <div className="mt-1 text-center text-[12px] text-[#b87333]/80">{arbiterName} will review and decide on-chain.</div>
              {isAdmin ? (
                <div className="mt-3 flex flex-col gap-2">
                  <button onClick={() => wrap(handleArbRelease)} disabled={txPending} className={primaryButton}>Release to seller</button>
                  <button onClick={() => wrap(handleArbRefund)} disabled={txPending} className={ghostButton}>Refund to buyer</button>
                  <button onClick={() => wrap(handleArbSplit)} disabled={txPending} className={ghostButton}>50/50 split</button>
                </div>
              ) : <div className="mt-3 text-center text-[12px] text-[#b87333]/80">Awaiting arbiter decision. Funds are frozen.</div>}
            </div>
          )}

          {canMutualCancel && (
            <div className={`border p-4 ${mutualCancelReady ? 'border-[var(--a-muted)]/30 bg-[var(--a-muted)]/[0.07]' : 'border-[var(--a-line)] bg-[var(--a-panel)]'}`}>
              <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--a-ink)]/40">Mutual cancel</div>
              {mutualCancelReady ? (
                <>
                  <ActionNote tone="success">Both parties agreed. All funds will be refunded.</ActionNote>
                  <button onClick={() => setPendingCloseAction('executeMutual')} disabled={txPending} className="mt-3 h-10 w-full border border-[var(--a-muted)]/40 text-[10px] font-mono uppercase tracking-[0.16em] text-[var(--a-muted)] hover:bg-[var(--a-muted)]/10 disabled:opacity-40">Execute mutual cancel</button>
                </>
              ) : (
                <>
                  <div className="mb-3 flex items-center justify-between text-[12px] text-[var(--a-muted)]"><span>Creator {mutualCancelStatus.creatorApproved ? 'approved' : 'pending'}</span><span>Counterparty {mutualCancelStatus.counterpartyApproved ? 'approved' : 'pending'}</span></div>
                  <div className="mb-3 text-center text-[12px] text-[var(--a-muted)]">{hasApprovedMutualCancel ? 'You approved. Waiting for counterparty.' : counterpartyApprovedMutualCancel ? 'Counterparty approved. Your turn.' : 'Both parties must agree to cancel.'}</div>
                  {!hasApprovedMutualCancel && <button onClick={() => wrap(handleRequestMutualCancel)} disabled={txPending} className={ghostButton}>Request mutual cancel</button>}
                  {hasApprovedMutualCancel && !counterpartyApprovedMutualCancel && <button onClick={() => wrap(handleRevokeMutualCancel)} disabled={txPending} className={dangerButton}>Revoke approval</button>}
                </>
              )}
            </div>
          )}

          {['Released', 'Refunded', 'Expired', 'Cancelled'].includes(room.state) && <ActionNote>This deal is closed.</ActionNote>}
        </div>
      </div>

      <ConfirmModal
        open={Boolean(pendingCopy)}
        tone="dark"
        danger
        eyebrow={pendingCopy?.eyebrow}
        title={pendingCopy?.title}
        description={pendingCopy?.description}
        confirmLabel={pendingCopy?.confirmLabel}
        cancelLabel="Keep room"
        onCancel={() => setPendingCloseAction(null)}
        onConfirm={runCloseAction}
      />
    </>
  )
}
