import { useEffect, useMemo, useRef, useState } from 'react'
import { ethers } from 'ethers'
import { getContract, STATE_NAMES, parseRoom, ARC_READ_PROVIDER } from '../utils/contract'
import RoomList from './rooms/RoomList'
import RoomsFilters from './rooms/RoomsFilters'
import RoomsLoadingState from './rooms/RoomsLoadingState'
import RoomsSidebar from './rooms/RoomsSidebar'
import RoomsToolbar from './rooms/RoomsToolbar'
import { filterRoomsByState } from './rooms/roomsUtils'

export default function RoomsPage({ wallet }) {
  const [rooms, setRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [filter, setFilter] = useState('active')
  const loadedOnce = useRef(false)

  useEffect(() => {
    loadedOnce.current = false
    if (!wallet) { setRooms([]); setLoading(false); return }
    loadRooms(false)
    const interval = setInterval(() => { loadRooms(true) }, 30000)
    return () => clearInterval(interval)
  }, [wallet?.address])

  const filteredRooms = useMemo(() => filterRoomsByState(rooms, filter), [rooms, filter])

  async function loadRooms(background = false) {
    if (!wallet) return
    const initialLoad = !loadedOnce.current && !background
    if (initialLoad) setLoading(true)
    else setIsRefreshing(true)

    try {
      const rpcProvider = ARC_READ_PROVIDER
      const contract = getContract(rpcProvider)
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
        } catch {}
      }

      setRooms(myRooms)
    } catch (error) {
      console.error('Load rooms error:', error)
    } finally {
      loadedOnce.current = true
      if (initialLoad) setLoading(false)
      setIsRefreshing(false)
    }
  }

  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <RoomsSidebar wallet={wallet} />
        <main className="overflow-hidden border border-[#ede9df]/10 bg-[#111110]">
          <div className="p-4 sm:p-5 lg:p-6">
            <RoomsToolbar wallet={wallet} isRefreshing={isRefreshing && !loading} />
            {!loading && <RoomsFilters filter={filter} onFilterChange={setFilter} hasRooms={rooms.length > 0} />}
            {loading ? <RoomsLoadingState /> : <RoomList rooms={filteredRooms} wallet={wallet} />}
          </div>
        </main>
      </div>
    </section>
  )
}
