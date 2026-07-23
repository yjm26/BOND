import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToast } from '../../../hooks/useToast'
import { authFetch } from '../../../lib/api'

export function useJoinListingRoom({ listing, wallet, API_URL, onClose }) {
  const navigate = useNavigate()
  const { addToast } = useToast()
  const [joinLoading, setJoinLoading] = useState(false)

  const joinRoom = async () => {
    setJoinLoading(true)
    try {
      const response = await fetch(`${API_URL}/api/listings`)
      const allListings = await response.json()
      const freshListing = allListings.find((item) => item.id === listing.id)
      const roomId = freshListing?.takenRoomId || listing.takenRoomId
      if (!roomId) {
        addToast('Buyer has not created a room yet. Please wait a moment and try again.', 'err')
        return
      }

      let joinCode = null
      try {
        const data = await authFetch(`/api/room-codes?roomId=${roomId}`, { method: 'GET' }, wallet)
        joinCode = data?.[0]?.joinCode
      } catch (error) { console.error('room-codes by roomId failed:', error) }

      if (!joinCode && freshListing?.creator) {
        try {
          const fallbackData = await authFetch('/api/room-codes', { method: 'GET' }, wallet)
          const match = fallbackData.find((roomCode) => String(roomCode.roomId) === String(roomId))
          joinCode = match?.joinCode
        } catch (error) { console.error('room-codes fallback failed:', error) }
      }

      if (joinCode) {
        navigate(`/room/${roomId}?joinCode=${encodeURIComponent(joinCode)}`)
      } else {
        addToast('Join code not found. Please ask the buyer for the invite link, or check My Rooms.', 'err')
      }
      onClose()
    } catch (error) {
      console.error('Failed to fetch join code:', error)
      addToast('Failed to load room. Please try My Rooms instead.', 'err')
    } finally {
      setJoinLoading(false)
    }
  }

  return { joinLoading, joinRoom }
}
