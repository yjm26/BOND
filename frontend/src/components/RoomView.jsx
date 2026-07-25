import { useState } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import ActionPanel from './room/ActionPanel'
import RoomHistory from './room/RoomHistory'
import RoomArbiterPanel from './room-detail/RoomArbiterPanel'
import RoomCountdownPanel from './room-detail/RoomCountdownPanel'
import RoomEmptyState from './room-detail/RoomEmptyState'
import RoomEvidencePanel from './room-detail/RoomEvidencePanel'
import RoomGuidePanel from './room-detail/RoomGuidePanel'
import RoomHeader from './room-detail/RoomHeader'
import RoomJoinCodePanel from './room-detail/RoomJoinCodePanel'
import RoomLoadingState from './room-detail/RoomLoadingState'
import RoomPartiesPanel from './room-detail/RoomPartiesPanel'
import RoomStatusMessage from './room-detail/RoomStatusMessage'
import RoomTermsPanel from './room-detail/RoomTermsPanel'
import { useRoomData } from '../hooks/useRoomData'
import { useRoomTimers } from '../hooks/useRoomTimers'
import { useRoomActions } from '../hooks/useRoomActions'

const STATE_GUIDES = {
  Created: {
    seller: ['Share the invite link with your buyer.', 'Room expires in 1 day if no one joins.', 'You can cancel anytime before someone joins.'],
    buyer: ['Share the invite link if needed.', 'No funds are locked yet.', 'Waiting for the seller to join.'],
  },
  Joined: {
    seller: ['Waiting for the buyer to fund.', 'Collateral stays locked until the room closes.', 'Both parties can agree to mutual cancel before funding completes.'],
    buyer: ['Fund the room with price + 1% fee.', 'You can leave before funding if you change your mind.'],
  },
  Funded: {
    seller: ['Funds are in escrow.', 'Deliver, then mark delivered with optional proof text.', 'Buyer confirms receipt to release funds.'],
    buyer: ['Funds locked in escrow.', 'Waiting for seller delivery.', 'After the delivery deadline you can refund if undelivered.'],
  },
  Delivered: {
    seller: ['Waiting for buyer to confirm or dispute.', 'After the 12h response buffer you can escalate to arbiter.'],
    buyer: ['Confirm received to release funds, or open a dispute with a clear reason.'],
  },
  Disputed: {
    seller: ['Funds are frozen.', 'Arbiter reviews on-chain evidence and API case notes.'],
    buyer: ['Funds are frozen.', 'Arbiter reviews on-chain evidence and API case notes.'],
  },
  Released: { both: ['Deal completed. Funds released to seller.'] },
  Refunded: { both: ['Deal closed. Buyer refunded.'] },
  Expired: { both: ['Room expired due to inactivity.'] },
  Cancelled: { both: ['Room cancelled.'] },
}

export default function RoomView({ wallet, connecting, onConnect }) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [joinCodeInput, setJoinCodeInput] = useState(searchParams.get('joinCode') || searchParams.get('code') || '')
  const joinCode = joinCodeInput.trim().toUpperCase()
  const [disputeReason, setDisputeReason] = useState('')
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [deliveryProofText, setDeliveryProofText] = useState('')

  const {
    room,
    loading,
    status,
    setStatus,
    arbiterName,
    arbiterAddr,
    isActiveArbiter,
    ownerAddr,
    creatorRep,
    counterpartyRep,
    evidence,
    mutualCancelStatus,
    loadEvidence,
    scheduleRoomRefresh,
  } = useRoomData(id, wallet)

  const { countdown, canExpire, canBuyerRefund, canEscalate } = useRoomTimers(room)

  const actions = useRoomActions({
    id,
    room,
    wallet,
    joinCode,
    disputeReason,
    setDisputeReason,
    setShowDisputeForm,
    deliveryProofText,
    scheduleRoomRefresh,
    loadEvidence,
    setStatus,
  })

  const account = wallet?.address?.toLowerCase()
  const isCreator = account === room?.creator?.toLowerCase()
  const isCounter = account === room?.counterparty?.toLowerCase()
  const isParticipant = isCreator || isCounter
  const isAdmin = account === ownerAddr?.toLowerCase() || isActiveArbiter
  const role = isCreator
    ? room?.creatorIsSeller
      ? 'seller'
      : 'buyer'
    : isCounter
      ? room?.creatorIsSeller
        ? 'buyer'
        : 'seller'
      : null
  const isSeller = role === 'seller'
  const isBuyer = role === 'buyer'
  const guide = room && STATE_GUIDES[room.state]
    ? STATE_GUIDES[room.state][role || 'both'] || STATE_GUIDES[room.state].both || []
    : []

  const canMutualCancel = isParticipant && ['Joined', 'Funded', 'Delivered'].includes(room?.state)
  const hasApprovedMutualCancel = isCreator
    ? mutualCancelStatus.creatorApproved
    : isCounter
      ? mutualCancelStatus.counterpartyApproved
      : false
  const counterpartyApprovedMutualCancel = isCreator
    ? mutualCancelStatus.counterpartyApproved
    : isCounter
      ? mutualCancelStatus.creatorApproved
      : false
  const mutualCancelReady = mutualCancelStatus.creatorApproved && mutualCancelStatus.counterpartyApproved

  const priceUSDC = room?.price || '0'
  const taxUSDC = room ? (Number(room.price) * 0.01).toFixed(2) : '0.00'
  const totalUSDC = room ? (Number(room.price) * 1.01).toFixed(2) : '0.00'
  const hasCollateral = Number(room?.collateralAmount || 0) > 0
  const displayRole = role ? role[0].toUpperCase() + role.slice(1) : null

  if (loading) return <RoomLoadingState />
    if (!room) {
      return (
        <RoomEmptyState
          wallet={wallet}
          status={status}
          connecting={connecting}
          onConnect={onConnect}
        />
      )
    }

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="pb-4">
        <main className="overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <button
                          onClick={() => navigate(-1)}
                          className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--a-faint)] transition hover:text-[var(--a-ink)]"
                        >
                          ← Back
                        </button>
                        <RoomHeader id={id} room={room} role={displayRole} />
                        {!wallet && (
                          <div className="mb-5 flex flex-col gap-3 border border-[var(--a-line)] bg-[var(--a-surface)] p-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-[13px] leading-[1.55] text-[var(--a-muted)]">
                              View only. Connect a wallet to join, fund, or act on this room.
                            </p>
                            {typeof onConnect === 'function' && (
                              <button
                                type="button"
                                onClick={onConnect}
                                disabled={connecting}
                                className="inline-flex h-11 shrink-0 items-center justify-center border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97] disabled:opacity-50"
                              >
                                {connecting ? 'Connecting…' : 'Connect wallet'}
                              </button>
                            )}
                          </div>
                        )}
                        <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
                          <div className="grid gap-5">
                            <RoomTermsPanel room={room} priceUSDC={priceUSDC} taxUSDC={taxUSDC} totalUSDC={totalUSDC} hasCollateral={hasCollateral} />
                            <RoomPartiesPanel
                              room={room}
                              isCreator={isCreator}
                              isCounter={isCounter}
                              creatorRep={creatorRep}
                              counterpartyRep={counterpartyRep}
                              role={displayRole}
                            />
                            <RoomEvidencePanel room={room} evidence={evidence} />
                            <RoomHistory roomId={id} provider={wallet?.provider || wallet?.walletProvider} />
                          </div>
                          <aside className="grid content-start gap-5">
                            <RoomGuidePanel guide={guide} />
                            <RoomCountdownPanel countdown={countdown} room={room} />
                            <RoomJoinCodePanel
                              joinCode={joinCode}
                              room={room}
                              isCreator={isCreator}
                              isParticipant={isParticipant}
                              joinCodeInput={joinCodeInput}
                              setJoinCodeInput={setJoinCodeInput}
                            />
                            {wallet ? (
                              <ActionPanel
                                room={room}
                                id={id}
                                isCreator={isCreator}
                                isSeller={isSeller}
                                isBuyer={isBuyer}
                                isAdmin={isAdmin}
                                isParticipant={isParticipant}
                                arbiterName={arbiterName}
                                totalUSDC={totalUSDC}
                                joinCode={joinCode}
                                copied={actions.copied}
                                canExpire={canExpire}
                                canEscalate={canEscalate}
                                canBuyerRefund={canBuyerRefund}
                                handleJoin={actions.handleJoin}
                                handleFund={actions.handleFund}
                                handleDeliver={actions.handleDeliver}
                                handleRelease={actions.handleRelease}
                                handleBuyerRefund={actions.handleBuyerRefund}
                                handleCancel={actions.handleCancel}
                                handleLeave={actions.handleLeave}
                                handleExpire={actions.handleExpire}
                                handleEscalate={actions.handleEscalate}
                                handleArbRelease={actions.handleArbRelease}
                                handleArbRefund={actions.handleArbRefund}
                                handleArbSplit={actions.handleArbSplit}
                                copyInvite={actions.copyInvite}
                                showDisputeForm={showDisputeForm}
                                setShowDisputeForm={setShowDisputeForm}
                                disputeReason={disputeReason}
                                setDisputeReason={setDisputeReason}
                                handleDispute={actions.handleDispute}
                                canMutualCancel={canMutualCancel}
                                mutualCancelStatus={mutualCancelStatus}
                                hasApprovedMutualCancel={hasApprovedMutualCancel}
                                counterpartyApprovedMutualCancel={counterpartyApprovedMutualCancel}
                                mutualCancelReady={mutualCancelReady}
                                handleRequestMutualCancel={actions.handleRequestMutualCancel}
                                handleRevokeMutualCancel={actions.handleRevokeMutualCancel}
                                handleExecuteMutualCancel={actions.handleExecuteMutualCancel}
                                txPending={actions.txPending}
                                deliveryProofText={deliveryProofText}
                                setDeliveryProofText={setDeliveryProofText}
                              />
                            ) : (
                              <div className="border border-[var(--a-line)] bg-[var(--a-surface)] p-5">
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--a-muted)]">
                                  Room actions
                                </div>
                                <p className="mt-3 text-[13px] leading-[1.55] text-[var(--a-muted)]">
                                  Connect a wallet to join, fund, deliver, release, or dispute.
                                </p>
                                {typeof onConnect === 'function' && (
                                  <button
                                    type="button"
                                    onClick={onConnect}
                                    disabled={connecting}
                                    className="mt-5 inline-flex h-11 w-full items-center justify-center border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] px-5 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-inverse-ink)] transition duration-160 ease-out hover:bg-transparent hover:text-[var(--a-ink)] active:scale-[0.97] disabled:opacity-50"
                                  >
                                    {connecting ? 'Connecting…' : 'Connect wallet'}
                                  </button>
                                )}
                              </div>
                            )}
                            <RoomStatusMessage status={status} />
                            <RoomArbiterPanel arbiterName={arbiterName} arbiterAddr={arbiterAddr} />
                          </aside>
                        </div>
          </div>
        </main>
      </div>
    </section>
  )
}
