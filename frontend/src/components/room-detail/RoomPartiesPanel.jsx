import { useEffect, useState } from 'react'
import PartyCard from './PartyCard'
import { fetchPublicProfile, loadProfile } from '../app/profile/profileStorage'

export default function RoomPartiesPanel({ room, isCreator, isCounter, creatorRep, counterpartyRep, role }) {
  const [publicProfiles, setPublicProfiles] = useState({})
  const creatorProfile = loadProfile(room.creator) || publicProfiles[room.creator?.toLowerCase()]
  const counterpartyProfile = loadProfile(room.counterparty) || publicProfiles[room.counterparty?.toLowerCase()]

  useEffect(() => {
    let stale = false
    const addresses = [room.creator, room.counterparty]
      .filter((address) => address && address !== '0x0000000000000000000000000000000000000000')
    ;(async () => {
      const entries = await Promise.all(addresses.map(async (address) => [address.toLowerCase(), await fetchPublicProfile(address).catch(() => null)]))
      if (stale) return
      setPublicProfiles(Object.fromEntries(entries.filter(([, profile]) => profile)))
    })()
    return () => { stale = true }
  }, [room.creator, room.counterparty])

  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink,#fafafa)]/40">Parties</div>
      <div className="grid gap-3">
        <PartyCard label="Creator" address={room.creator} role={room.creatorIsSeller ? 'Seller' : 'Buyer'} isYou={isCreator} reputation={creatorRep} profile={creatorProfile} />
        {room.counterparty !== '0x0000000000000000000000000000000000000000' ? (
          <PartyCard label="Counterparty" address={room.counterparty} role={room.creatorIsSeller ? 'Buyer' : 'Seller'} isYou={isCounter} reputation={counterpartyRep} profile={counterpartyProfile} />
        ) : (
          <div className="border border-dashed border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] p-4 text-[13px] text-[var(--a-muted,#a3a3a3)]">Waiting for counterparty to join…</div>
        )}
      </div>
      <div className="mt-4 border-t border-[var(--a-line)] pt-4 text-[13px] text-[var(--a-muted,#a3a3a3)]">Your role: <span className="text-[var(--a-ink,#fafafa)]">{role || 'Viewer'}</span></div>
    </div>
  )
}
