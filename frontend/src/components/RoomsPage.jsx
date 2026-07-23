import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ethers } from 'ethers'
import { getContract, getUsdc, STATE_NAMES, CONTRACT_ADDRESS, ARC_GAS, ARC_GAS_APPROVE, ensureArcChain, waitForTx, parseRoom } from '../utils/contract'
import { authFetch, API_URL } from '../lib/api'
import PendingRoomsPanel from './rooms/PendingRoomsPanel'
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
  const [pendingRooms, setPendingRooms] = useState([])
  const [joinError, setJoinError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    if (!wallet) { setLoading(false); return }
    loadRooms(false)
    fetchPendingRooms()
    const interval = setInterval(() => { loadRooms(true); fetchPendingRooms() }, 30000)
    return () => clearInterval(interval)
  }, [wallet])

  const filteredRooms = useMemo(() => filterRoomsByState(rooms, filter), [rooms, filter])

  async function fetchPendingRooms() {
    if (!wallet) return
    try {
      const data = await authFetch('/api/room-codes', { method: 'GET' }, wallet)
      const day = 24 * 60 * 60 * 1000
      const cutoff = Date.now() - day
      const contract = getContract(wallet.provider)
      const stillPending = []

      for (const roomCode of data) {
        if (roomCode.createdAt && roomCode.createdAt < cutoff) continue
        try {
          const room = parseRoom(await contract.rooms(roomCode.roomId))
          if (room.counterparty.toLowerCase() === '0x0000000000000000000000000000000000000000') {
            stillPending.push(roomCode)
          }
        } catch {
          stillPending.push(roomCode)
        }
      }

      setPendingRooms(stillPending)
    } catch (error) {
      console.error('Fetch pending rooms:', error)
    }
  }

  async function handleJoinRoom(roomCode) {
    setJoinError('')
    if (!roomCode?.roomId || !roomCode?.joinCode) {
      setJoinError('Invalid room code data')
      return
    }

    try {
      const response = await fetch(`${API_URL}/api/room-codes?roomId=${roomCode.roomId}`)
      const freshCodes = await response.json()
      const fresh = freshCodes?.[0]
      if (!fresh || !fresh.joinCode) {
        setJoinError('Room code expired or invalid. Please refresh.')
        return
      }

      const signer = await wallet.provider.getSigner()
      await ensureArcChain(signer)
      const addr = await signer.getAddress()
      const rpcProvider = new ethers.JsonRpcProvider('https://rpc.testnet.arc.network', 5042002)
      let nonce = await rpcProvider.getTransactionCount(addr, 'latest')
      const contract = getContract(signer)
      const room = parseRoom(await contract.rooms(fresh.roomId))
      const collateralWei = room.collateralAmount
      const creatorIsSeller = room.creatorIsSeller
      const isCounterpartySeller = !creatorIsSeller

      if (isCounterpartySeller && collateralWei > 0n) {
        const usdc = getUsdc(signer)
        const allowance = await usdc.allowance(wallet.address, CONTRACT_ADDRESS)
        if (allowance < collateralWei) {
          const approveTx = await usdc.approve(CONTRACT_ADDRESS, collateralWei, { ...ARC_GAS_APPROVE, nonce: nonce++ })
          await waitForTx(wallet.provider, approveTx.hash, 180000)
        }
      }

      const codeBytes = ethers.toUtf8Bytes(fresh.joinCode)
      const tx = await contract.joinRoom(fresh.roomId, codeBytes, { ...ARC_GAS, nonce: nonce++ })
      await waitForTx(wallet.provider, tx.hash, 180000)
      loadRooms(false)
      fetchPendingRooms()
      navigate(`/room/${fresh.roomId}?code=${fresh.joinCode}`)
    } catch (error) {
      console.error('Join room failed:', error)
      setJoinError('Failed to join: ' + (error.reason || error.message))
    }
  }

  async function loadRooms(background = false) {
    if (!wallet) return
    if (!background) setLoading(true)
    else setIsRefreshing(true)

    try {
      const rpcProvider = new ethers.JsonRpcProvider('https://rpc.testnet.arc.network', 5042002)
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
      if (!background) setLoading(false)
      setIsRefreshing(false)
    }
  }

  if (loading) return <RoomsLoadingState />

  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <RoomsSidebar wallet={wallet} />
        <main className="overflow-hidden border border-[#ede9df]/10 bg-[#111110]">
          <div className="p-4 sm:p-5 lg:p-6">
            <RoomsToolbar wallet={wallet} isRefreshing={isRefreshing} />
            <PendingRoomsPanel pendingRooms={pendingRooms} joinError={joinError} onJoinRoom={handleJoinRoom} />
            <RoomsFilters filter={filter} onFilterChange={setFilter} hasRooms={rooms.length > 0} />
            <RoomList rooms={filteredRooms} wallet={wallet} />
          </div>
        </main>
      </div>
    </section>
  )
}
