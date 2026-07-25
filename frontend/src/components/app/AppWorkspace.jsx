import { useEffect, useState } from 'react'
import AppGate from './AppGate'
import AppHome from './AppHome'
import ProfileSetup from './ProfileSetup'
import WorkspaceLoading from './WorkspaceLoading'
import { loadProfile, saveProfile } from './profile/profileStorage'

export default function AppWorkspace({ wallet, connecting, connectError, onConnect, onProfileStateChange }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
      if (!wallet?.address) {
        setLoading(false)
        setProfile(null)
        setNeedsSetup(false)
        onProfileStateChange?.(null)
        return
      }

      // Instant local profile — no fake 900ms spinner (felt like stuck Connecting)
      const storedProfile = loadProfile(wallet.address)
      if (storedProfile?.displayName) {
        setProfile(storedProfile)
        setNeedsSetup(false)
        onProfileStateChange?.(true)
      } else {
        setProfile(null)
        setNeedsSetup(true)
        onProfileStateChange?.(false)
      }
      setLoading(false)
    }, [wallet?.address, onProfileStateChange])

  const completeSetup = (nextProfile) => {
    if (!wallet?.address) return
    setLoading(true)
    saveProfile(wallet.address, nextProfile, wallet)
    window.setTimeout(() => {
      setProfile(nextProfile)
      setNeedsSetup(false)
      onProfileStateChange?.(true)
      setLoading(false)
    }, 850)
  }

  if (!wallet) {
    return <AppGate connecting={connecting} connectError={connectError} onConnect={onConnect} />
  }

  if (loading) {
    return <WorkspaceLoading />
  }

  if (needsSetup) {
    return <ProfileSetup wallet={wallet} onComplete={completeSetup} />
  }

  return <AppHome wallet={wallet} profile={profile} />
}
