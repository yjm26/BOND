import { useState } from 'react'
import { ethers } from 'ethers'
import {
  ARC_GAS,
  ARC_GAS_APPROVE,
  ARC_READ_PROVIDER,
  CONTRACT_ADDRESS,
  ensureArcChain,
  getContract,
  getLatestNonce,
  getUsdc,
  waitForTx,
} from '../utils/contract'
import { deliveryProofHash } from '../utils/deliveryProof'
import { postEvidence } from '../lib/evidenceApi'
import { registerDispute } from '../lib/disputesApi'
import { trackRoomId } from '../lib/roomIndexApi'
import { useToast } from './useToast'

const MAX_REASON_BYTES = 500

export function useRoomActions({
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
}) {
  const [txPending, setTxPending] = useState(false)
  const [copied, setCopied] = useState(false)
  const { addToast } = useToast()

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
          const nonce = await getLatestNonce(addr, wallet.provider)
          const gas = { ...ARC_GAS, nonce }
          const contract = getContract(signer)
          const tx = await fn(contract, gas)
          setStatus({ type: 'info', msg: `Wallet signed. Waiting for Arc confirmation: ${tx.hash.slice(0, 10)}…` })
          addToast(`Pending on Arc · ${tx.hash.slice(0, 10)}…`, 'info')

          const stuckTimer = setTimeout(async () => {
            try {
              const found = await ARC_READ_PROVIDER.getTransaction(tx.hash)
              if (!found) {
                addToast('TX not found on-chain — clear wallet activity and retry.', 'err')
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
          if (msg.includes('denied') || msg.includes('User rejected') || msg.includes('revert') || msg.includes('execution reverted')) {
            setStatus({ type: '', msg: '' })
            if (!msg.includes('denied') && !msg.includes('User rejected')) {
              addToast(msg.slice(0, 120), 'err')
            }
            return false
          }
          if (attempt < RETRIES) {
            const delay = 1000 * Math.pow(2, attempt)
            addToast(`Retrying in ${delay / 1000}s… (${attempt + 1}/${RETRIES})`, 'info')
            await new Promise((r) => setTimeout(r, delay))
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
    if (!joinCode) {
      setStatus({ type: 'err', msg: 'Invite link missing join code' })
      return
    }
    setTxPending(true)
    try {
      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      const addr = await signer.getAddress()
      let nonce = await getLatestNonce(addr, wallet.provider)
      try {
        const contract = getContract(signer)
        const isValid = await contract.verifyJoinCode(id, ethers.toUtf8Bytes(joinCode))
        if (!isValid) {
          setStatus({ type: 'err', msg: 'Invalid invite code' })
          return
        }
        if (!room.creatorIsSeller && room.collateralAmount && ethers.parseUnits(room.collateralAmount, 6) > 0n) {
          const collateralWei = ethers.parseUnits(room.collateralAmount, 6)
          const usdc = getUsdc(signer)
          const allowance = await usdc.allowance(wallet.address, CONTRACT_ADDRESS)
          if (allowance < collateralWei) {
            setStatus({ type: 'info', msg: 'Approving collateral…' })
            const approveTx = await usdc.approve(CONTRACT_ADDRESS, collateralWei, { ...ARC_GAS_APPROVE, nonce: nonce++ })
            await waitForTx(wallet.provider, approveTx.hash, 180000)
          }
        }
        setStatus({ type: 'info', msg: 'Joining…' })
        const tx = await contract.joinRoom(id, ethers.toUtf8Bytes(joinCode), { ...ARC_GAS, nonce: nonce++ })
        await waitForTx(wallet.provider, tx.hash, 180000)
        try {
          await trackRoomId(wallet, id)
        } catch (e) {
          console.warn('room-index track failed', e)
        }
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
      const addr = await signer.getAddress()
      let nonce = await getLatestNonce(addr, wallet.provider)
      try {
        const contract = getContract(signer)
        const taxBps = await contract.FUND_TAX_BPS()
        const feeWei = (priceWei * taxBps) / 10000n
        const exactNeeded = priceWei + feeWei
        const usdc = getUsdc(signer)
        const bal = await usdc.balanceOf(wallet.address)
        if (bal < exactNeeded) {
          setStatus({
            type: 'err',
            msg: `Insufficient USDC. Need ${ethers.formatUnits(exactNeeded, 6)} USDC (incl. ${Number(taxBps) / 100}% fee)`,
          })
          return
        }
        setStatus({ type: 'info', msg: 'Approving USDC…' })
        const approveTx = await usdc.approve(CONTRACT_ADDRESS, exactNeeded, { ...ARC_GAS_APPROVE, nonce: nonce++ })
        await waitForTx(wallet.provider, approveTx.hash, 180000)
        setStatus({ type: 'info', msg: 'Funding room…' })
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

  const handleDeliver = () => {
    const proof = deliveryProofHash(id, deliveryProofText)
    return doAction(
      (c, gas) => c.markDelivered(id, proof, gas),
      'Confirming delivery…',
      'Delivered! Buyer can now release funds.',
    )
  }

  const handleRelease = () => doAction((c, gas) => c.releaseFunds(id, gas), 'Confirming receipt…', 'Released! Seller gets price + collateral.')
  const handleBuyerRefund = () => doAction((c, gas) => c.buyerRefund(id, gas), 'Requesting refund…', 'Refunded! You receive price + seller collateral.')

  const handleDispute = async () => {
    if (!disputeReason.trim()) {
      setStatus({ type: 'err', msg: 'Reason required' })
      return
    }
    if (new TextEncoder().encode(disputeReason.trim()).length > MAX_REASON_BYTES) {
      setStatus({ type: 'err', msg: `Reason must stay under ${MAX_REASON_BYTES} bytes` })
      return
    }
    const ok = await doAction(
      (c, gas) => c.openDispute(id, disputeReason.trim(), 'text', disputeReason.trim().slice(0, 200), '', gas),
      'Opening dispute…',
      'Disputed! Arbiter will review.',
    )
    if (!ok) return
    try {
      await postEvidence(wallet, {
        roomId: id,
        evidenceType: 'text',
        description: disputeReason.trim(),
        evidenceRef: '',
      })
      loadEvidence()
    } catch (err) {
      console.error('Evidence post failed:', err)
    }
    try {
      await registerDispute(wallet, {
        roomId: id,
        item: room?.item || '',
        price: room?.price || '',
        collateral: room?.collateralAmount || '0',
        creator: room?.creator || '',
        counterparty: room?.counterparty || '',
        reason: disputeReason.trim(),
        evidenceRef: '',
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
    return doAction((c, gas) => c.arbiterResolve(id, seller, gas), 'Resolving…', 'Released to seller (+ collateral)')
  }
  const handleArbRefund = () => {
    const buyer = room.creatorIsSeller ? room.counterparty : room.creator
    return doAction((c, gas) => c.arbiterResolve(id, buyer, gas), 'Resolving…', 'Refunded to buyer (+ collateral)')
  }
  const handleArbSplit = () => doAction((c, gas) => c.arbiterSplit(id, gas), 'Splitting…', '50/50 split')
  const handleEscalate = () => doAction((c, gas) => c.escalateNoResponse(id, gas), 'Escalating…', 'Escalated! Arbiter will review delivery proof.')

  const copyInvite = () => {
    navigator.clipboard.writeText(window.location.href)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return {
    txPending,
    copied,
    handleJoin,
    handleFund,
    handleDeliver,
    handleRelease,
    handleBuyerRefund,
    handleDispute,
    handleCancel,
    handleLeave,
    handleExpire,
    handleRequestMutualCancel,
    handleRevokeMutualCancel,
    handleExecuteMutualCancel,
    handleArbRelease,
    handleArbRefund,
    handleArbSplit,
    handleEscalate,
    copyInvite,
  }
}
