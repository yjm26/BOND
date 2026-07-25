import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { getContract } from '../../utils/contract'
import { formatAddress } from '../../utils/constants'

const EVENT_CONFIG = {
  RoomCreated: { label: 'Room created', tone: 'bg-[var(--a-muted,#a3a3a3)]' },
  RoomJoined: { label: 'Counterparty joined', tone: 'bg-[var(--a-muted,#a3a3a3)]' },
  RoomFunded: { label: 'Escrow funded', tone: 'bg-[#8f9a88]' },
  RoomDelivered: { label: 'Item delivered', tone: 'bg-[#8f9a88]' },
  RoomReleased: { label: 'Funds released', tone: 'bg-[#8f9a88]' },
  RoomDisputed: { label: 'Dispute opened', tone: 'bg-[#b87333]' },
  RoomRefunded: { label: 'Buyer refunded', tone: 'bg-[#b87333]' },
  RoomExpired: { label: 'Room expired', tone: 'bg-[var(--a-inverse-bg,#fafafa)]/36' },
  RoomCancelled: { label: 'Room cancelled', tone: 'bg-[var(--a-inverse-bg,#fafafa)]/36' },
  DisputeResolved: { label: 'Dispute resolved', tone: 'bg-[#b87333]' },
}

function formatTimestamp(ts) {
  const d = new Date(ts * 1000)
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function formatDate(ts) {
  const d = new Date(ts * 1000)
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function getEventDetail(name, args) {
  switch (name) {
    case 'RoomCreated':
      return `${formatAddress(args.creator)} — ${args.creatorIsSeller ? 'Seller' : 'Buyer'}`
    case 'RoomJoined':
      return formatAddress(args.who)
    case 'RoomFunded':
      return `${Number(ethers.formatUnits(args.amount, 6)).toFixed(2)} USDC`
    case 'RoomDelivered':
      return args.proof && args.proof !== ethers.ZeroHash ? `proof: ${args.proof.slice(0, 10)}…` : 'no proof'
    case 'RoomReleased':
      return `${Number(ethers.formatUnits(args.amount, 6)).toFixed(2)} USDC → seller`
    case 'RoomRefunded':
      return `${Number(ethers.formatUnits(args.amount, 6)).toFixed(2)} USDC → buyer`
    case 'RoomCancelled':
      return `by ${formatAddress(args.by)}`
    case 'DisputeResolved': {
      const amount = Number(ethers.formatUnits(args.amount, 6)).toFixed(2)
      const winner = formatAddress(args.winner)
      return args.winner === ethers.ZeroAddress ? `${amount} USDC → 50/50 split` : `${amount} USDC → ${winner}`
    }
    default:
      return ''
  }
}

export default function RoomHistory({ roomId, provider }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHistory()
  }, [roomId, provider])

  async function loadHistory() {
    try {
      const contract = getContract(provider)
      const eventNames = Object.keys(EVENT_CONFIG)
      const allEvents = []
      for (const name of eventNames) {
        try {
          const logs = await contract.queryFilter(contract.filters[name](Number(roomId)))
          for (const log of logs) {
            const block = await log.getBlock()
            allEvents.push({ name, args: log.args, blockNumber: log.blockNumber, timestamp: block.timestamp, txHash: log.transactionHash })
          }
        } catch { /* event might not have filter for roomId */ }
      }
      allEvents.sort((a, b) => a.blockNumber - b.blockNumber)
      setEvents(allEvents)
    } catch (err) {
      console.error('History load error:', err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5">
      <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink,#fafafa)]/40">History</div>
      <div className="text-[12px] text-[var(--a-muted,#a3a3a3)]">Loading…</div>
    </div>
  )

  if (events.length === 0) return null

  const grouped = {}
  for (const ev of events) {
    const dateKey = formatDate(ev.timestamp)
    if (!grouped[dateKey]) grouped[dateKey] = []
    grouped[dateKey].push(ev)
  }

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink,#fafafa)]/40">History</div>
      <div className="space-y-5">
        {Object.entries(grouped).map(([date, dayEvents]) => (
          <div key={date}>
            <div className="mb-3 font-mono text-[10px] uppercase tracking-[0.14em] text-[color:var(--a-faint)]">{date}</div>
            <div className="space-y-0">
              {dayEvents.map((ev, i) => {
                const config = EVENT_CONFIG[ev.name] || { label: ev.name, tone: 'bg-[var(--a-inverse-bg,#fafafa)]/36' }
                const detail = getEventDetail(ev.name, ev.args)
                return (
                  <div key={i} className="flex items-start gap-3 py-2">
                    <div className="mt-1 flex flex-col items-center">
                      <div className={`h-2 w-2 ${config.tone}`} />
                      {i < dayEvents.length - 1 && <div className="mt-1 h-5 w-px bg-[var(--a-inverse-bg,#fafafa)]/10" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="text-[13px] font-medium text-[var(--a-ink,#fafafa)]">{config.label}</span>
                        <span className="shrink-0 font-mono text-[10px] text-[color:var(--a-faint)]">{formatTimestamp(ev.timestamp)}</span>
                      </div>
                      {detail && <div className="mt-1 font-mono text-[11px] text-[var(--a-muted,#a3a3a3)]">{detail}</div>}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
