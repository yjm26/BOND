import { useEffect, useMemo, useState } from 'react'

/**
 * Countdown + capability flags derived from room timestamps (contract-aligned).
 */
export function useRoomTimers(room) {
  const [countdown, setCountdown] = useState('')

  useEffect(() => {
    if (!room) {
      setCountdown('')
      return undefined
    }

    let target = 0
    if (room.state === 'Created' && room.createdAt) target = room.createdAt + 86400
    else if (room.state === 'Joined' && room.joinedAt) target = room.joinedAt + 1800
    else if (room.state === 'Funded' && room.deliveryDeadline) target = room.deliveryDeadline
    else if (room.state === 'Delivered' && room.confirmDeadline) target = room.confirmDeadline
    else if (room.state === 'Disputed') {
      setCountdown('Pending arbiter')
      return undefined
    } else {
      setCountdown('')
      return undefined
    }

    const tick = () => {
      const remaining = target - Math.floor(Date.now() / 1000)
      if (remaining <= 0) {
        setCountdown('Expired')
        return
      }
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

  const flags = useMemo(() => {
    if (!room) {
      return { canExpire: false, canBuyerRefund: false, canEscalate: false }
    }
    const now = Date.now() / 1000
    const canExpire =
      (room.state === 'Created' && room.createdAt && now - room.createdAt > 86400) ||
      (room.state === 'Joined' && room.joinedAt && now - room.joinedAt > 1800)
    const canBuyerRefund = room.state === 'Funded' && room.deliveryDeadline && now > room.deliveryDeadline
    const canEscalate = room.state === 'Delivered' && room.confirmDeadline && now > room.confirmDeadline
    return { canExpire, canBuyerRefund, canEscalate }
  }, [room, countdown])

  return { countdown, ...flags }
}
