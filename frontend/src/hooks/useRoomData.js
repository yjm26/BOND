import { useCallback, useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import {
  ARC_READ_PROVIDER,
  getContract,
  parseRoom,
  STATE_NAMES,
} from '../utils/contract'
import { fetchReputation } from '../utils/reputation'
import { fetchRoomEvidence } from '../lib/evidenceApi'
import { useSmartPolling } from './useSmartPolling'

function mapRoom(data) {
  return {
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
    deliveryProofHash: data.deliveryProofHash,
  }
}

export function useRoomData(id, wallet) {
  const address = wallet?.address || null
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [status, setStatus] = useState(null)
  const [arbiterName, setArbiterName] = useState('BOND Arbiter')
  const [arbiterAddr, setArbiterAddr] = useState('')
  const [isActiveArbiter, setIsActiveArbiter] = useState(false)
  const [ownerAddr, setOwnerAddr] = useState('')
  const [creatorRep, setCreatorRep] = useState(null)
  const [counterpartyRep, setCounterpartyRep] = useState(null)
  const [evidence, setEvidence] = useState([])
  const [mutualCancelStatus, setMutualCancelStatus] = useState({
    creatorApproved: false,
    counterpartyApproved: false,
  })

  const walletRef = useRef(wallet)
  walletRef.current = wallet
  const requestGen = useRef(0)

  const loadRoom = useCallback(async () => {
    const gen = ++requestGen.current
    const w = walletRef.current
    try {
      if (!w || !id) {
        if (gen === requestGen.current) {
          setRoom(null)
          setLoading(false)
        }
        return
      }
      const contract = getContract(ARC_READ_PROVIDER)
      const data = parseRoom(await contract.rooms(id))
      if (gen !== requestGen.current) return

      setRoom(mapRoom(data))
      await Promise.all([
        contract.arbiterName().then((v) => gen === requestGen.current && setArbiterName(v)).catch(() => {}),
        contract.arbiter().then((v) => gen === requestGen.current && setArbiterAddr(v)).catch(() => {}),
        contract.owner().then((v) => gen === requestGen.current && setOwnerAddr(v)).catch(() => {}),
        w.address
          ? contract.isArbiter(w.address).then((v) => gen === requestGen.current && setIsActiveArbiter(v)).catch(() => {
            if (gen === requestGen.current) setIsActiveArbiter(false)
          })
          : Promise.resolve(),
        contract
          .getMutualCancelStatus(id)
          .then((mc) => {
            if (gen === requestGen.current) {
              setMutualCancelStatus({ creatorApproved: mc[0], counterpartyApproved: mc[1] })
            }
          })
          .catch(() => {}),
        Promise.all([
          fetchReputation(ARC_READ_PROVIDER, data.creator),
          fetchReputation(ARC_READ_PROVIDER, data.counterparty),
        ])
          .then(([cRep, cpRep]) => {
            if (gen === requestGen.current) {
              setCreatorRep(cRep)
              setCounterpartyRep(cpRep)
            }
          })
          .catch(() => {}),
      ])
    } catch (err) {
      console.error(err)
      if (gen === requestGen.current) {
        setRoom(null)
        setStatus({ type: 'err', msg: 'Room not found' })
      }
    } finally {
      if (gen === requestGen.current) setLoading(false)
    }
  }, [id])

  const loadEvidence = useCallback(async () => {
    try {
      if (!id) return
      const contract = getContract(ARC_READ_PROVIDER)
      let chainFormatted = []
      try {
        const chainEvidence = await contract.getAllEvidence(id)
        chainFormatted = chainEvidence.map((e, i) => ({
          id: `chain-${i}`,
          submitter: e.submitter,
          evidenceType: e.evidenceType,
          description: e.description,
          evidenceRef: e.evidenceRef,
          timestamp: Number(e.timestamp) * 1000,
          source: 'chain',
        }))
      } catch { /* ignore */ }

      let backendFormatted = []
      try {
        const backendEvidence = await fetchRoomEvidence(id)
        backendFormatted = (Array.isArray(backendEvidence) ? backendEvidence : []).map((e) => ({
          ...e,
          id: `backend-${e.id}`,
          source: 'backend',
        }))
      } catch { /* ignore */ }

      const seen = new Set()
      const merged = [...chainFormatted, ...backendFormatted].filter((e) => {
        const key = `${e.evidenceRef || ''}|${e.description || ''}|${e.submitter || ''}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
      setEvidence(merged)
    } catch (err) {
      console.error('loadEvidence error:', err)
    }
  }, [id])

  const refresh = useCallback(async () => {
    await loadRoom()
    await loadEvidence()
  }, [loadRoom, loadEvidence])

  const scheduleRoomRefresh = useCallback(() => {
    ;[1200, 3000, 6000].forEach((delay) => {
      window.setTimeout(() => {
        loadRoom()
        loadEvidence()
      }, delay)
    })
  }, [loadRoom, loadEvidence])

  useEffect(() => {
    setLoading(true)
    setRoom(null)
    setEvidence([])
    loadRoom()
    loadEvidence()
  }, [id, address, loadRoom, loadEvidence])

  const isTerminal = ['Released', 'Refunded', 'Expired', 'Cancelled'].includes(room?.state)
  useSmartPolling(refresh, [id, address], {
    interval: 10000,
    enabled: Boolean(address && id && !isTerminal && !loading),
  })

  return {
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
    loadRoom,
    loadEvidence,
    refresh,
    scheduleRoomRefresh,
  }
}
