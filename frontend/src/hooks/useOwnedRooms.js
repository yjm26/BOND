import { useCallback, useEffect, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { getContract, STATE_NAMES, parseRoom, ARC_READ_PROVIDER } from '../utils/contract'

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
      const contract = getContract(ARC_READ_PROVIDER)
      const addr = wallet.address.toLowerCase()
      const total = await contract.roomCount()
      const myRooms = []

      for (let i = Number(total) - 1; i >= 0; i--) {
        try {
          const room = parseRoom(await contract.rooms(i))
          const isCreator = room.creator.toLowerCase() === addr
          const isCounter = room.counterparty.toLowerCase() === addr

          if (isCreator || isCounter) {
            const creatorIsSeller = room.creatorIsSeller
            myRooms.push({
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
            })
          }
        } catch {
          /* skip unreadable room */
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
  }, [wallet?.address])

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
