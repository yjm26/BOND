import { useEffect, useState } from 'react'
import AppGate from './AppGate'
import AppHome from './AppHome'
import ProfileSetup from './ProfileSetup'
import WorkspaceLoading from './WorkspaceLoading'
import { saveProfile } from './profile/profileStorage'

const profileKey = (address) => `bond_profile_${address.toLowerCase()}`

export default function AppWorkspace({ wallet, connecting, connectError, onConnect }) {
  const [loading, setLoading] = useState(false)
  const [profile, setProfile] = useState(null)
  const [needsSetup, setNeedsSetup] = useState(false)

  useEffect(() => {
    if (!wallet?.address) {
      setLoading(false)
      setProfile(null)
      setNeedsSetup(false)
      return
    }

    setLoading(true)
    const timer = window.setTimeout(() => {
      const stored = window.localStorage.getItem(profileKey(wallet.address))
      if (stored) {
        try {
          setProfile(JSON.parse(stored))
          setNeedsSetup(false)
        } catch {
          setProfile(null)
          setNeedsSetup(true)
        }
      } else {
        setProfile(null)
        setNeedsSetup(true)
      }
      setLoading(false)
    }, 900)

    return () => window.clearTimeout(timer)
  }, [wallet?.address])

  const completeSetup = (nextProfile) => {
    if (!wallet?.address) return
    setLoading(true)
    saveProfile(wallet.address, nextProfile, wallet)
    window.setTimeout(() => {
      setProfile(nextProfile)
      setNeedsSetup(false)
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
