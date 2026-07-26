import { useEffect, useMemo, useState } from 'react'
import { TIMERS } from '../utils/constants'

/**
 * Countdown + capability flags — Phase A contract:
 * deliveryDeadline is set at fund (fundedAt + deliveryDays), not at create.
 */
export function useRoomTimers(room) {
  const [countdown, setCountdown] = useState('')
  const [countdownLabel, setCountdownLabel] = useState('')

  useEffect(() => {
    if (!room) {
      setCountdown('')
      setCountdownLabel('')
      return undefined
    }

    let target = 0
    let label = ''
    if (room.state === 'Created' && room.createdAt) {
      target = room.createdAt + TIMERS.joinDeadline
      label = 'Join window'
    } else if (room.state === 'Joined' && room.joinedAt) {
      target = room.joinedAt + TIMERS.fundDeadline
      label = 'Fund window'
    } else if (room.state === 'Funded' && room.deliveryDeadline) {
      target = room.deliveryDeadline
      label = 'Delivery deadline'
    } else if (room.state === 'Delivered' && room.confirmDeadline) {
      target = room.confirmDeadline
      label = 'Response buffer'
    } else if (room.state === 'Disputed') {
      setCountdown('Pending arbiter')
      setCountdownLabel('Dispute')
      return undefined
    } else {
      setCountdown('')
      setCountdownLabel('')
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

    setCountdownLabel(label)
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [
    room?.state,
    room?.createdAt,
    room?.joinedAt,
    room?.fundedAt,
    room?.deliveryDeadline,
    room?.confirmDeadline,
    room?.disputedAt,
  ])

  const flags = useMemo(() => {
    if (!room) {
      return { canExpire: false, canBuyerRefund: false, canEscalate: false }
    }
    const now = Date.now() / 1000
    const canExpire =
      (room.state === 'Created' && room.createdAt && now - room.createdAt > TIMERS.joinDeadline) ||
      (room.state === 'Joined' && room.joinedAt && now - room.joinedAt > TIMERS.fundDeadline)
    // Phase A: refund only after on-chain deliveryDeadline (set at fund)
    const canBuyerRefund =
      room.state === 'Funded' && room.deliveryDeadline > 0 && now > room.deliveryDeadline
    const canEscalate =
      room.state === 'Delivered' && room.confirmDeadline > 0 && now > room.confirmDeadline
    return { canExpire, canBuyerRefund, canEscalate }
  }, [room, countdown])

  return { countdown, countdownLabel, ...flags }
}
