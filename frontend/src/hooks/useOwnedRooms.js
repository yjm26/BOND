import { useCallback, useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { getContract, STATE_NAMES, parseRoom, ARC_READ_PROVIDER } from '../utils/contract'
import { fetchMyRoomIds, backfillRoomIds } from '../lib/roomIndexApi'

const LEGACY_SCAN_CAP = 200

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
    role: isCreator ? (creatorIsSeller ? 'Seller' : 'Buyer') : (creatorIsSeller ? 'Buyer' : 'Seller'),
    counter: isCreator ? room.counterparty : room.creator,
  }
}

async function loadRoomsByIds(ids, addr) {
  const contract = getContract(ARC_READ_PROVIDER)
  const myRooms = []
  for (const i of ids) {
    try {
      const room = parseRoom(await contract.rooms(i))
      const shaped = shapeOwnedRoom(i, room, addr)
      if (shaped) myRooms.push(shaped)
    } catch {
      /* skip */
    }
  }
  return myRooms
}

async function legacyScan(addr) {
  const contract = getContract(ARC_READ_PROVIDER)
  const total = Number(await contract.roomCount())
  const myRooms = []
  const start = Math.max(1, total - LEGACY_SCAN_CAP + 1)
  for (let i = total; i >= start; i--) {
    try {
      const room = parseRoom(await contract.rooms(i))
      const shaped = shapeOwnedRoom(i, room, addr)
      if (shaped) myRooms.push(shaped)
    } catch {
      /* skip */
    }
  }
  return myRooms
}

export default function useOwnedRooms(wallet, { pollMs = 30000 } = {}) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(Boolean(wallet))
  const [isRefreshing, setIsRefreshing] = useState(false)
  const loadedOnce = useRef(false)

  const loadRooms = useCallback(async (background = false) => {
    if (!wallet?.address) {
      setRooms([])
      setLoading(false)
      setIsRefreshing(false)
      return
    }

    const initialLoad = !loadedOnce.current && !background
    if (initialLoad) setLoading(true)
    else setIsRefreshing(true)

    try {
      const addr = wallet.address.toLowerCase()
      let ids = []
      try {
        ids = await fetchMyRoomIds(wallet)
      } catch (error) {
        console.warn('room-index fetch failed, falling back to scan', error)
      }

      let myRooms
      if (ids.length > 0) {
        myRooms = await loadRoomsByIds(ids, addr)
      } else {
        myRooms = await legacyScan(addr)
        if (myRooms.length > 0) {
          try {
            await backfillRoomIds(wallet, myRooms.map((r) => r.id))
          } catch (error) {
            console.warn('room-index backfill failed', error)
          }
        }
      }

      setRooms(myRooms)
    } catch (error) {
      console.error('Load rooms error:', error)
    } finally {
      loadedOnce.current = true
      if (initialLoad) setLoading(false)
      setIsRefreshing(false)
    }
  }, [wallet])

  useEffect(() => {
    loadedOnce.current = false
    if (!wallet?.address) {
      setRooms([])
      setLoading(false)
      return undefined
    }

    loadRooms(false)
    if (!pollMs) return undefined
    const interval = setInterval(() => {
      loadRooms(true)
    }, pollMs)
    return () => clearInterval(interval)
  }, [wallet?.address, loadRooms, pollMs])

  return { rooms, loading, isRefreshing, reload: loadRooms }
}
