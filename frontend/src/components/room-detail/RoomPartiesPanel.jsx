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
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
      <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/40">Parties</div>
      <div className="grid gap-3">
        <PartyCard label="Creator" address={room.creator} role={room.creatorIsSeller ? 'Seller' : 'Buyer'} isYou={isCreator} reputation={creatorRep} profile={creatorProfile} />
        {room.counterparty !== '0x0000000000000000000000000000000000000000' ? (
          <PartyCard label="Counterparty" address={room.counterparty} role={room.creatorIsSeller ? 'Buyer' : 'Seller'} isYou={isCounter} reputation={counterpartyRep} profile={counterpartyProfile} />
        ) : (
          <div className="border border-dashed border-[#ede9df]/14 bg-[#111110] p-4 text-[13px] text-[#b9b2a5]">Waiting for counterparty to join…</div>
        )}
      </div>
      <div className="mt-4 border-t border-[#ede9df]/10 pt-4 text-[13px] text-[#b9b2a5]">Your role: <span className="text-[#ede9df]">{role || 'Viewer'}</span></div>
    </div>
  )
}
