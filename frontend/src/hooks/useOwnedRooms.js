import { useCallback, useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { getContract, STATE_NAMES, parseRoom, ARC_READ_PROVIDER } from '../utils/contract'
import { trackRoomId, backfillRoomIds } from '../lib/roomIndexApi'
import { hasCachedApiAuth } from '../lib/api'

/** Soft cap for one-time chain discovery when no local index exists. */
const LEGACY_SCAN_CAP = 80
/** Parallel eth_call batch size — keeps RPC happy without serial waterfall. */
const READ_BATCH = 12
const INDEX_KEY = (addr) => `bond_room_ids_${String(addr).toLowerCase()}`

function readLocalIds(address) {
  if (!address || typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(INDEX_KEY(address))
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return [...new Set(parsed.map(Number).filter((n) => Number.isFinite(n) && n > 0))].sort((a, b) => b - a)
  } catch {
    return []
  }
}

function writeLocalIds(address, ids) {
  if (!address || typeof window === 'undefined') return
  const clean = [...new Set(ids.map(Number).filter((n) => Number.isFinite(n) && n > 0))].sort((a, b) => b - a)
  window.localStorage.setItem(INDEX_KEY(address), JSON.stringify(clean))
  return clean
}

function mergeLocalIds(address, extraIds) {
  const merged = writeLocalIds(address, [...readLocalIds(address), ...extraIds])
  return merged
}

function shapeOwnedRoom(i, room, addr) {
  const isCreator = room.creator.toLowerCase() === addr
  const isCounter = room.counterparty.toLowerCase() === addr
  if (!isCreator && !isCounter) return null
  const creatorIsSeller = room.creatorIsSeller
  return {
    id: i,
    creator: room.creator,
    counterparty: room.counterparty,
    item: room.itemDescription,
    price: ethers.formatUnits(room.priceUSD, 6),
    collateral: ethers.formatUnits(room.collateralAmount, 6),
    state: STATE_NAMES[Number(room.state)],
    collateralAmount: ethers.formatUnits(room.collateralAmount, 6),
    createdAt: Number(room.createdAt),
    joinedAt: Number(room.joinedAt),
    isCreator,
    role: isCreator ? (creatorIsSeller ? 'Seller' : 'Buyer') : creatorIsSeller ? 'Buyer' : 'Seller',
    counter: isCreator ? room.counterparty : room.creator,
  }
}

async function mapPool(items, concurrency, worker) {
  const results = new Array(items.length)
  let next = 0
  async function run() {
    while (next < items.length) {
      const idx = next++
      results[idx] = await worker(items[idx], idx)
    }
  }
  const runners = Array.from({ length: Math.min(concurrency, items.length) }, () => run())
  await Promise.all(runners)
  return results
}

async function loadRoomsByIds(ids, addr) {
  if (!ids.length) return []
  const contract = getContract(ARC_READ_PROVIDER)
  const shaped = await mapPool(ids, READ_BATCH, async (i) => {
    try {
      const room = parseRoom(await contract.rooms(i))
      return shapeOwnedRoom(i, room, addr)
    } catch {
      return null
    }
  })
  return shaped.filter(Boolean)
}

async function legacyScan(addr) {
  const contract = getContract(ARC_READ_PROVIDER)
  const total = Number(await contract.roomCount())
  if (!Number.isFinite(total) || total <= 0) return []
  const start = Math.max(1, total - LEGACY_SCAN_CAP + 1)
  const ids = []
  for (let i = total; i >= start; i--) ids.push(i)
  return loadRoomsByIds(ids, addr)
}

/**
 * Owned rooms with local-first index.
 * Never prompts wallet signature on read path (home / my rooms).
 * Server room-index is write-through only after create/join (optional).
 */
export default function useOwnedRooms(wallet, { pollMs = 60000 } = {}) {
  const address = wallet?.address || null
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(Boolean(address))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const loadedFor = useRef(null)
  const inflight = useRef(null)
  const walletRef = useRef(wallet)
  walletRef.current = wallet

  const loadRooms = useCallback(async (background = false) => {
    const w = walletRef.current
    const addr = w?.address?.toLowerCase()
    if (!addr) {
      setRooms([])
      setLoading(false)
      setIsRefreshing(false)
      loadedFor.current = null
      return
    }

    // Coalesce concurrent loads (StrictMode double-mount, poll overlap)
    if (inflight.current) return inflight.current

    const isFirstForAddr = loadedFor.current !== addr
    if (isFirstForAddr && !background) setLoading(true)
    else setIsRefreshing(true)
    setError(null)

    const job = (async () => {
      try {
        let ids = readLocalIds(addr)
        let myRooms

        if (ids.length > 0) {
          myRooms = await loadRoomsByIds(ids, addr)
        } else {
          // One-time discovery — parallel, capped. No wallet popup.
          myRooms = await legacyScan(addr)
          if (myRooms.length > 0) {
                      ids = writeLocalIds(addr, myRooms.map((r) => r.id))
                      // Never prompt sign from a background room scan
                      const liveWallet = walletRef.current
                      if (liveWallet?.address && hasCachedApiAuth(liveWallet.address)) {
                        backfillRoomIds(liveWallet, ids).catch(() => {})
                      }
                    }
        }

        setRooms(myRooms)
        loadedFor.current = addr
      } catch (err) {
        console.error('Load rooms error:', err)
        setError(err.message || 'Failed to load rooms')
        // Keep previous rooms on refresh failure — avoids empty flash
        if (isFirstForAddr) setRooms([])
      } finally {
        setLoading(false)
        setIsRefreshing(false)
        inflight.current = null
      }
    })()

    inflight.current = job
    return job
  }, [])

  useEffect(() => {
    if (!address) {
      setRooms([])
      setLoading(false)
      setIsRefreshing(false)
      loadedFor.current = null
      return undefined
    }

    // Warm from local ids instantly if we already shaped nothing yet
    loadRooms(false)

    if (!pollMs) return undefined
    const interval = setInterval(() => {
      loadRooms(true)
    }, pollMs)
    return () => clearInterval(interval)
  }, [address, loadRooms, pollMs])

  return { rooms, loading, isRefreshing, error, reload: loadRooms }
}

/** Call after createRoom / joinRoom success — local first; server only if already signed-in. */
export function rememberOwnedRoom(address, roomId, wallet) {
  if (!address || !roomId) return
  mergeLocalIds(address, [Number(roomId)])
  // Never open a wallet popup from this helper — landing/browse must stay quiet
  if (wallet?.address && hasCachedApiAuth(wallet.address)) {
    trackRoomId(wallet, roomId).catch(() => {})
  }
}

export { readLocalIds, writeLocalIds, mergeLocalIds }
