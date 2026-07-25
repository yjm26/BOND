import { useState, useEffect } from 'react'
import { useParams, useSearchParams, useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { getContract, getUsdc, ensureArcChain, ARC_GAS, ARC_GAS_APPROVE, ARC_READ_PROVIDER, STATE_NAMES, CONTRACT_ADDRESS, waitForTx , parseRoom, fixSignerNonce, getLatestNonce } from '../utils/contract'
import { fetchReputation } from '../utils/reputation'
import RoomHistory from './room/RoomHistory'
import ActionPanel from './room/ActionPanel'
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
import { useToast } from '../hooks/useToast'
import { useSmartPolling } from '../hooks/useSmartPolling'
import { API_URL } from '../lib/api'

const MAX_REASON_BYTES = 500

const STATE_GUIDES = {
  Created: {
    seller: [
      'Share the invite link with your buyer.',
      'Room expires in 1 day if no one joins.',
      'You can cancel anytime before someone joins.',
    ],
    buyer: [
      'Room created from market deal.',
      'Seller has been notified to join.',
      'You can share the invite link as backup.',
      'No funds are locked yet.',
    ],
  },
  Joined: {
    seller: [
      'Buyer has joined. Waiting for them to fund.',
      'Your collateral is locked as guarantee.',
      'Both parties can agree to mutual cancel before funding.',
    ],
    buyer: [
      'Fund the room with the total amount shown.',
      'Seller collateral is locked — your funds are protected.',
      'After funding, seller must deliver the item.',
      'You can leave now if you change your mind.',
    ],
  },
  Funded: {
    seller: [
      'Funds are now in escrow.',
      'Deliver the item, then click "I delivered".',
      'Buyer will confirm receipt to release funds.',
      'Both parties can agree to mutual cancel.',
    ],
    buyer: [
      'Funds locked in escrow.',
      'Waiting for seller to deliver.',
      'You will confirm receipt once satisfied.',
      'Both parties can agree to mutual cancel.',
    ],
  },
  Delivered: {
    seller: [
      'Waiting for buyer to confirm receipt.',
      'Buyer has a confirm window based on deal type.',
      'If buyer ghosts, you can escalate to arbiter after the window.',
      'Both parties can still agree to mutual cancel.',
    ],
    buyer: [
      'Seller marked item as delivered.',
      'If satisfied, click "Confirm Received" to release funds.',
      'If there is an issue, open a dispute with evidence.',
      'You have a confirm window — check the timer above.',
      'Both parties can agree to mutual cancel.',
    ],
  },
  Disputed: {
    seller: [
      'Dispute is open. Funds are frozen.',
      'Submit evidence to support your case.',
      'Arbiter will review and resolve on-chain.',
    ],
    buyer: [
      'Dispute is open. Funds are frozen.',
      'Submit evidence to support your case.',
      'Arbiter will review and resolve on-chain.',
    ],
  },
  Released: {
    both: ['Deal completed. Funds released to seller.'],
  },
  Refunded: {
    both: ['Deal closed. Buyer refunded.'],
  },
  Expired: {
    both: ['Room expired due to inactivity.'],
  },
  Cancelled: {
    both: ['Room cancelled by creator.'],
  },
}

export default function RoomView({ wallet }) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [joinCodeInput, setJoinCodeInput] = useState(searchParams.get('joinCode') || searchParams.get('code') || '')
  const joinCode = joinCodeInput.trim().toUpperCase()

  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [countdown, setCountdown] = useState('')
  const [confirmCountdown, setConfirmCountdown] = useState(null)
  const [arbiterName, setArbiterName] = useState('BOND Arbiter')
  const [arbiterAddr, setArbiterAddr] = useState('')
  const [isActiveArbiter, setIsActiveArbiter] = useState(false)
  const [copied, setCopied] = useState(false)
  const [ownerAddr, setOwnerAddr] = useState('')

  const [creatorRep, setCreatorRep] = useState(null)
  const [counterpartyRep, setCounterpartyRep] = useState(null)

  const [evidence, setEvidence] = useState([])
  const [disputeReason, setDisputeReason] = useState('')
  const [showDisputeForm, setShowDisputeForm] = useState(false)
  const [mutualCancelStatus, setMutualCancelStatus] = useState({ creatorApproved: false, counterpartyApproved: false })
  const [txPending, setTxPending] = useState(false)
  const { addToast } = useToast()

  const account = wallet?.address?.toLowerCase()

  const [inviteLink, setInviteLink] = useState('')

  useEffect(() => {
    if (!id) return
    setInviteLink(window.location.href)
  }, [id])

  async function loadRoom() {
    try {
      if (!wallet) { setRoom(null); setLoading(false); return }
      // Use PUBLIC RPC for reads — wallet provider often lags behind latest block
      const rpcProvider = ARC_READ_PROVIDER
      const contract = getContract(rpcProvider)
      const data = parseRoom(await contract.rooms(id))
      setRoom({
        creator: data.creator,
        counterparty: data.counterparty,
        item: data.itemDescription,
        price: ethers.formatUnits(data.priceUSD, 6),
        collateralAmount: ethers.formatUnits(data.collateralAmount, 6),
        createdAt: Number(data.createdAt),
        joinedAt: Number(data.joinedAt),
        deliveredAt: Number(data.deliveredAt),
        disputedAt: Number(data.disputedAt),
        deliveryDeadline: Number(data.deliveryDeadline),
        confirmDeadline: Number(data.confirmDeadline),
        state: STATE_NAMES[Number(data.state)],
        value: ethers.formatUnits(data.fundedAmount, 6),
        collateralLocked: data.collateralAmount,
        creatorIsSeller: data.creatorIsSeller,
      })
      try { setArbiterName(await contract.arbiterName()) } catch {}
      try { setArbiterAddr(await contract.arbiter()) } catch {}
      try { setOwnerAddr(await contract.owner()) } catch {}
      try { setIsActiveArbiter(wallet?.address ? await contract.isArbiter(wallet.address) : false) } catch { setIsActiveArbiter(false) }
      try {
        const mc = await contract.getMutualCancelStatus(id)
        setMutualCancelStatus({ creatorApproved: mc[0], counterpartyApproved: mc[1] })
      } catch {}
      try {
        const [cRep, cpRep] = await Promise.all([
          fetchReputation(rpcProvider, data.creator),
          fetchReputation(rpcProvider, data.counterparty),
        ])
        setCreatorRep(cRep)
        setCounterpartyRep(cpRep)
      } catch {}
    } catch (err) {
      console.error(err)
      setRoom(null)
      setStatus({ type: 'err', msg: 'Room not found' })
    } finally { setLoading(false) }
  }

  async function loadEvidence() {
    try {
      if (!wallet || !id) return
      const provider = wallet.provider
      const contract = getContract(provider)
      const chainEvidence = await contract.getAllEvidence(id)
      const formatted = chainEvidence.map((e, i) => ({
        id: `chain-${i}`,
        submitter: e.submitter,
        evidenceType: e.evidenceType,
        description: e.description,
        evidenceRef: e.evidenceRef,
        timestamp: Number(e.timestamp) * 1000,
        source: 'chain',
      }))
      const res = await fetch(`${API_URL}/api/evidence/${id}`)
      const backendEvidence = res.ok ? await res.json() : []
      const backendFormatted = backendEvidence.map(e => ({
        ...e,
        id: `backend-${e.id}`,
        source: 'backend',
      }))
      const seen = new Set()
      const merged = [...formatted, ...backendFormatted].filter(e => {
        if (seen.has(e.evidenceRef)) return false
        seen.add(e.evidenceRef)
        return true
      })
      setEvidence(merged)
    } catch (err) {
      console.error('loadEvidence error:', err)
    }
  }

  function scheduleRoomRefresh() {
    ;[1200, 3000, 6000, 10000].forEach((delay) => {
      window.setTimeout(() => { loadRoom(); loadEvidence() }, delay)
    })
  }

  useEffect(() => { loadRoom(); loadEvidence() }, [id, wallet])

  const isTerminal = ['Released', 'Refunded', 'Expired', 'Cancelled'].includes(room?.state)
  useSmartPolling(
    async () => { await loadRoom(); await loadEvidence() },
    [id, wallet?.address],
    { interval: 4000, enabled: !!wallet && !isTerminal }
  )

  useEffect(() => {
    if (!room) return
    let target = 0
    let label = ''
    if (room.state === 'Created' && room.createdAt) { target = room.createdAt + 86400; label = 'Join deadline' }
    else if (room.state === 'Joined' && room.joinedAt) { target = room.joinedAt + 1800; label = 'Fund deadline' }
    else if (room.state === 'Funded' && room.deliveryDeadline) { target = room.deliveryDeadline; label = 'Deliver deadline' }
    else if (room.state === 'Delivered' && room.confirmDeadline) { target = room.confirmDeadline; label = 'Confirm window' }
    else if (room.state === 'Disputed' && room.disputedAt) { label = 'Pending arbiter'; setCountdown('Pending arbiter'); return }
    else { setCountdown(''); return }

    const tick = () => {
      const remaining = target - Math.floor(Date.now() / 1000)
      if (remaining <= 0) { setCountdown('Expired'); return }
      const h = Math.floor(remaining / 3600)
      const m = Math.floor((remaining % 3600) / 60)
      const s = remaining % 60
      const parts = []
      if (h > 0) parts.push(`${h}h`)
      if (m > 0 || h > 0) parts.push(`${m}m`)
      parts.push(`${s}s`)
      setCountdown(parts.join(' '))
    }
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [room?.state, room?.createdAt, room?.joinedAt, room?.deliveryDeadline, room?.confirmDeadline, room?.disputedAt])

  const isCreator = account === room?.creator?.toLowerCase()
  const isCounter = account === room?.counterparty?.toLowerCase()
  const isParticipant = isCreator || isCounter
  const isAdmin = account === ownerAddr?.toLowerCase() || isActiveArbiter

  async function doAction(fn, label, successMsg) {
    setTxPending(true)
    setStatus({ type: 'info', msg: label })
    addToast(label, 'info')

    try {
      const RETRIES = 2
      for (let attempt = 0; attempt <= RETRIES; attempt++) {
        try {
          const signer = await wallet.provider.getSigner()
          await ensureArcChain(signer)
          const addr = await signer.getAddress()
          // Query nonce from Arc RPC fallbacks to bypass wallet stale cache
          const nonce = await getLatestNonce(addr, wallet.provider)
          const gas = { ...ARC_GAS, nonce }
          const contract = getContract(signer)
          const tx = await fn(contract, gas)
            setStatus({ type: 'info', msg: `Wallet signed. Waiting for Arc confirmation: ${tx.hash.slice(0, 10)}\u2026` })
            addToast(`Pending on Arc · ${tx.hash.slice(0, 10)}…`, 'info')

            // Stuck-tx detection: if not on chain within 15s, warn user about wallet cache
            const stuckTimer = setTimeout(async () => {
              try {
                const rpc = ARC_READ_PROVIDER
                const found = await rpc.getTransaction(tx.hash)
                if (!found) {
                  addToast('TX not found on-chain — your wallet may have a stuck nonce. Try: MetaMask → Settings → Advanced → Clear Activity Tab Data, then retry.', 'err')
                  setStatus({ type: 'err', msg: 'TX stuck in wallet. Clear wallet activity and retry.' })
                }
              } catch { /* ignore */ }
            }, 15000)

            const receipt = await waitForTx(wallet.provider, tx.hash, 120000)
            clearTimeout(stuckTimer)
            if (receipt.status === 0) {
              setStatus({ type: 'err', msg: 'TX reverted on-chain' })
              addToast('Transaction reverted on-chain', 'err')
              return false
            }
            setStatus({ type: 'ok', msg: successMsg })
            addToast(successMsg, 'ok')
            scheduleRoomRefresh()
            return true
        } catch (err) {
          const msg = err.reason || err.message || String(err)
          // User rejection = don't retry
          if (msg.includes('denied') || msg.includes('User rejected') || msg.includes('revert') || msg.includes('execution reverted')) {
            setStatus({ type: '', msg: '' })
            if (!msg.includes('denied') && !msg.includes('User rejected')) {
              addToast(msg.slice(0, 120), 'err')
            }
            return false
          }
          // Network/RPC error = retry with backoff
          if (attempt < RETRIES) {
            const delay = 1000 * Math.pow(2, attempt)
            addToast(`Retrying in ${delay/1000}s\u2026 (${attempt + 1}/${RETRIES})`, 'info')
            await new Promise(r => setTimeout(r, delay))
            continue
          }
          console.error('TX failed:', err)
          setStatus({ type: 'err', msg: msg.slice(0, 100) })
          addToast(msg.slice(0, 120), 'err')
          return false
        }
      }
      return false
    } finally {
      setTxPending(false)
    }
  }

  const handleJoin = async () => {
    if (!joinCode) { setStatus({ type: 'err', msg: 'Invite link missing join code' }); return }
    setTxPending(true)
    try {
      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      // Query nonce from Arc RPC fallbacks
      const addr = await signer.getAddress()
      let nonce = await getLatestNonce(addr, wallet.provider)
      try {
        const contract = getContract(signer)
        // Pre-verify join code to avoid wasting gas
        const isValid = await contract.verifyJoinCode(id, ethers.toUtf8Bytes(joinCode))
        if (!isValid) { setStatus({ type: 'err', msg: 'Invalid invite code' }); return }
        if (!room.creatorIsSeller && room.collateralAmount && ethers.parseUnits(room.collateralAmount, 6) > 0n) {
          const collateralWei = ethers.parseUnits(room.collateralAmount, 6)
          const usdc = getUsdc(signer)
          const allowance = await usdc.allowance(wallet.address, CONTRACT_ADDRESS)
          if (allowance < collateralWei) {
            setStatus({ type: 'info', msg: 'Approving collateral\u2026' })
            const approveTx = await usdc.approve(CONTRACT_ADDRESS, collateralWei, { ...ARC_GAS_APPROVE, nonce: nonce++ })
            await waitForTx(wallet.provider, approveTx.hash, 180000)
          }
        }
        setStatus({ type: 'info', msg: 'Joining\u2026' })
        const tx = await contract.joinRoom(id, ethers.toUtf8Bytes(joinCode), { ...ARC_GAS, nonce: nonce++ })
        await waitForTx(wallet.provider, tx.hash, 180000)
        setStatus({ type: 'ok', msg: 'Joined!' })
        scheduleRoomRefresh()
      } catch (e) {
        setStatus({ type: 'err', msg: e.reason || e.message })
      }
    } finally {
      setTxPending(false)
    }
  }

  const handleFund = async () => {
    const priceWei = ethers.parseUnits(room.price, 6)
    setTxPending(true)
    try {
      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      // Query nonce from Arc RPC fallbacks
      const addr = await signer.getAddress()
      let nonce = await getLatestNonce(addr, wallet.provider)
      try {
        const contract = getContract(signer)
        // Fetch dynamic tax from contract — never hardcode
        const taxBps = await contract.FUND_TAX_BPS()
        const feeWei = (priceWei * taxBps) / 10000n
        const exactNeeded = priceWei + feeWei
        const usdc = getUsdc(signer)
        const bal = await usdc.balanceOf(wallet.address)
        if (bal < exactNeeded) { setStatus({ type: 'err', msg: `Insufficient USDC. Need ${ethers.formatUnits(exactNeeded, 6)} USDC (incl. ${Number(taxBps)/100}% fee)` }); return }
        setStatus({ type: 'info', msg: 'Approving USDC\u2026' })
        const approveTx = await usdc.approve(CONTRACT_ADDRESS, exactNeeded, { ...ARC_GAS_APPROVE, nonce: nonce++ })
        await waitForTx(wallet.provider, approveTx.hash, 180000)
        setStatus({ type: 'info', msg: 'Funding room\u2026' })
        const fundTx = await contract.fundRoom(id, { ...ARC_GAS, nonce: nonce++ })
        await waitForTx(wallet.provider, fundTx.hash, 180000)
        setStatus({ type: 'ok', msg: 'Funded!' })
        scheduleRoomRefresh()
      } catch (e) {
        setStatus({ type: 'err', msg: e.reason || e.message })
      }
    } finally {
      setTxPending(false)
    }
  }

  const handleDeliver = () => doAction((c, gas) => c.markDelivered(id, ethers.ZeroHash, gas), 'Confirming delivery\u2026', 'Delivered! Buyer can now release funds.')
  const handleRelease = () => doAction((c, gas) => c.releaseFunds(id, gas), 'Confirming receipt…', 'Released! Seller gets price + collateral.')
  const handleBuyerRefund = () => doAction((c, gas) => c.buyerRefund(id, gas), 'Requesting refund…', 'Refunded! You receive price + seller collateral.')

  const handleDispute = async () => {
    if (!disputeReason.trim()) { setStatus({ type: 'err', msg: 'Reason required' }); return }
    if (new TextEncoder().encode(disputeReason.trim()).length > MAX_REASON_BYTES) { setStatus({ type: 'err', msg: `Reason must stay under ${MAX_REASON_BYTES} bytes` }); return }
    const ok = await doAction(
      (c, gas) => c.openDispute(id, disputeReason.trim(), 'text', '', '', gas),
      'Opening dispute\u2026',
      'Disputed! Arbiter will review.'
    )
    if (!ok) return
    // Post evidence to backend after successful dispute TX
    try {
      const body = {
        submitter: wallet.address,
        evidenceType: 'text',
        description: disputeReason.trim(),
        evidenceRef: '',
        roomId: id,
        timestamp: Date.now(),
      }
      const res = await fetch(`${API_URL}/api/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      if (!res.ok) throw new Error('Failed to post evidence')
      loadEvidence()
    } catch (err) {
      console.error('Evidence post failed:', err)
    }
    // Register dispute for arbiter dashboard
    try {
      await fetch(`${API_URL}/api/disputes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          roomId: id,
          item: room?.item || '',
          price: room?.price || '',
          collateral: room?.collateralAmount || '0',
          creator: room?.creator || '',
          counterparty: room?.counterparty || '',
          disputedBy: wallet.address,
          reason: disputeReason.trim(),
          evidenceRef: '',
        }),
      })
    } catch (err) {
      console.error('Dispute register POST failed:', err)
    }
    setShowDisputeForm(false)
    setDisputeReason('')
  }

  const handleCancel = () => doAction((c, gas) => c.cancelRoom(id, gas), 'Preparing room cancellation…', 'Room cancelled. Collateral returned.')
  const handleLeave = () => doAction((c, gas) => c.leaveRoom(id, gas), 'Preparing room exit…', 'You left the room. Collateral returned.')
  const handleExpire = () => doAction((c, gas) => c.expireRoom(id, gas), 'Preparing room expiry…', 'Expired room closed. Collateral returned.')

  const handleRequestMutualCancel = () => doAction((c, gas) => c.requestMutualCancel(id, gas), 'Requesting mutual cancel…', 'You approved mutual cancel. Waiting for counterparty.')
  const handleRevokeMutualCancel = () => doAction((c, gas) => c.revokeMutualCancel(id, gas), 'Revoking mutual cancel…', 'You revoked your approval.')
  const handleExecuteMutualCancel = () => doAction((c, gas) => c.executeMutualCancel(id, gas), 'Executing mutual cancel…', 'Deal cancelled. All funds refunded.')
  const handleArbRelease = () => {
    const seller = room.creatorIsSeller ? room.creator : room.counterparty
    doAction((c, gas) => c.arbiterResolve(id, seller, gas), 'Resolving…', 'Released to seller (+ collateral)')
  }
  const handleArbRefund = () => {
    const buyer = room.creatorIsSeller ? room.counterparty : room.creator
    doAction((c, gas) => c.arbiterResolve(id, buyer, gas), 'Resolving…', 'Refunded to buyer (+ collateral)')
  }
  const handleArbSplit = () => doAction((c, gas) => c.arbiterSplit(id, gas), 'Splitting…', '50/50 split')
  const handleEscalate = () => doAction((c, gas) => c.escalateNoResponse(id, gas), 'Escalating…', 'Escalated! Arbiter will review delivery proof.')

  const copyInvite = () => {
    navigator.clipboard.writeText(inviteLink || window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const canExpire = room && (
    (room.state === 'Created' && (Date.now() / 1000 - room.createdAt) > 86400) ||
    (room.state === 'Joined' && (Date.now() / 1000 - room.joinedAt) > 1800)
  )
  const canBuyerRefund = room?.state === 'Funded' && room?.deliveryDeadline && (Date.now() / 1000) > room.deliveryDeadline
  const canEscalate = room?.state === 'Delivered' && room.confirmDeadline && (Date.now() / 1000) > room.confirmDeadline

  const canMutualCancel = isParticipant && ['Joined', 'Funded', 'Delivered'].includes(room?.state)
  const hasApprovedMutualCancel = isCreator ? mutualCancelStatus.creatorApproved : isCounter ? mutualCancelStatus.counterpartyApproved : false
  const counterpartyApprovedMutualCancel = isCreator ? mutualCancelStatus.counterpartyApproved : isCounter ? mutualCancelStatus.creatorApproved : false
  const mutualCancelReady = mutualCancelStatus.creatorApproved && mutualCancelStatus.counterpartyApproved

  const role = isCreator ? (room?.creatorIsSeller ? 'seller' : 'buyer') : isCounter ? (room?.creatorIsSeller ? 'buyer' : 'seller') : null
  const isSeller = role === 'seller'
  const isBuyer = role === 'buyer'
  const guide = room && STATE_GUIDES[room.state] ? (STATE_GUIDES[room.state][role || 'both'] || STATE_GUIDES[room.state].both || []) : []

  const priceUSDC = room?.price || '0'
  const taxUSDC = room ? (Number(room.price) * 0.01).toFixed(2) : '0.00'
  const totalUSDC = room ? (Number(room.price) * 1.01).toFixed(2) : '0.00'
  const hasCollateral = Number(room?.collateralAmount || 0) > 0
  const displayRole = role ? role[0].toUpperCase() + role.slice(1) : null

  if (loading) return <RoomLoadingState />
  if (!wallet || !room) return <RoomEmptyState wallet={wallet} status={status} />

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="pb-4">
        <main className="overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <button onClick={() => navigate(-1)} className="mb-4 font-mono text-[10px] uppercase tracking-[0.16em] text-[color:var(--a-faint)] transition hover:text-[var(--a-ink)]">← Back</button>
            <RoomHeader id={id} room={room} role={displayRole} />
            <div className="grid gap-5 xl:grid-cols-[1fr_420px]">
              <div className="grid gap-5">
                <RoomTermsPanel room={room} priceUSDC={priceUSDC} taxUSDC={taxUSDC} totalUSDC={totalUSDC} hasCollateral={hasCollateral} />
                <RoomPartiesPanel room={room} isCreator={isCreator} isCounter={isCounter} creatorRep={creatorRep} counterpartyRep={counterpartyRep} role={displayRole} />
                <RoomEvidencePanel room={room} evidence={evidence} />
                <RoomHistory roomId={id} provider={wallet.provider} />
              </div>
              <aside className="grid content-start gap-5">
                <RoomGuidePanel guide={guide} />
                <RoomCountdownPanel countdown={countdown} room={room} />
                <RoomJoinCodePanel joinCode={joinCode} room={room} isCreator={isCreator} isParticipant={isParticipant} joinCodeInput={joinCodeInput} setJoinCodeInput={setJoinCodeInput} />
                <ActionPanel
                  room={room} id={id} isCreator={isCreator} isSeller={isSeller} isBuyer={isBuyer} isAdmin={isAdmin} isParticipant={isParticipant}
                  arbiterName={arbiterName} totalUSDC={totalUSDC} joinCode={joinCode} copied={copied}
                  canExpire={canExpire} canEscalate={canEscalate} canBuyerRefund={canBuyerRefund}
                  handleJoin={handleJoin} handleFund={handleFund} handleDeliver={handleDeliver} handleRelease={handleRelease}
                  handleBuyerRefund={handleBuyerRefund} handleCancel={handleCancel} handleLeave={handleLeave} handleExpire={handleExpire}
                  handleEscalate={handleEscalate} handleArbRelease={handleArbRelease} handleArbRefund={handleArbRefund} handleArbSplit={handleArbSplit}
                  copyInvite={copyInvite}
                  showDisputeForm={showDisputeForm} setShowDisputeForm={setShowDisputeForm}
                  disputeReason={disputeReason} setDisputeReason={setDisputeReason}
                  handleDispute={handleDispute}
                  canMutualCancel={canMutualCancel}
                  mutualCancelStatus={mutualCancelStatus}
                  hasApprovedMutualCancel={hasApprovedMutualCancel}
                  counterpartyApprovedMutualCancel={counterpartyApprovedMutualCancel}
                  mutualCancelReady={mutualCancelReady}
                  handleRequestMutualCancel={handleRequestMutualCancel}
                  handleRevokeMutualCancel={handleRevokeMutualCancel}
                  handleExecuteMutualCancel={handleExecuteMutualCancel}
                  txPending={txPending}
                />
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
