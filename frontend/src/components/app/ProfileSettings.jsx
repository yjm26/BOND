import { useEffect, useMemo, useState } from 'react'
import AppGate from './AppGate'
import ArbiterManagePanel from './profile/ArbiterManagePanel'
import ProfileEditForm from './profile/ProfileEditForm'
import ProfileHeader from './profile/ProfileHeader'
import ProfileIdentityCard from './profile/ProfileIdentityCard'
import ProfileSaveConfirm from './profile/ProfileSaveConfirm'
import ProfileSidebar from './profile/ProfileSidebar'
import ProfileTrustNotes from './profile/ProfileTrustNotes'
import { emptyProfile, loadProfile, saveProfile } from './profile/profileStorage'

export default function ProfileSettings({ wallet, connecting, connectError, onConnect }) {
  const [profile, setProfile] = useState(emptyProfile())
  const [form, setForm] = useState(emptyProfile())
  const [pendingProfile, setPendingProfile] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!wallet?.address) return
    const stored = loadProfile(wallet.address) || emptyProfile()
    setProfile(stored)
    setForm(stored)
  }, [wallet?.address])

  const canSave = useMemo(() => form.displayName.trim().length > 0, [form.displayName])

  const updateField = (key, value) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    if (!canSave) return
    setPendingProfile({
      ...profile,
      displayName: form.displayName.trim(),
      xProfile: form.xProfile.trim(),
      discord: form.discord.trim(),
      updatedAt: new Date().toISOString(),
      createdAt: profile.createdAt || new Date().toISOString(),
    })
  }

  const confirmSave = () => {
    if (!wallet?.address || !pendingProfile) return
    setSaving(true)
    saveProfile(wallet.address, pendingProfile, wallet)
    window.setTimeout(() => {
      setProfile(pendingProfile)
      setForm(pendingProfile)
      setPendingProfile(null)
      setSaving(false)
    }, 500)
  }

  if (!wallet) {
    return <AppGate connecting={connecting} connectError={connectError} onConnect={onConnect} />
  }

  return (
    <section className="min-h-screen bg-[#000000] px-4 pt-[88px] text-[#fafafa] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <ProfileSidebar wallet={wallet} />
        <main className="overflow-hidden border border-[#fafafa]/10 bg-[#0a0a0a]">
          <div className="p-4 sm:p-5 lg:p-6">
            <ProfileHeader profile={profile} />
            <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
              <div className="grid gap-5">
                <ProfileIdentityCard wallet={wallet} profile={profile} />
                <ProfileTrustNotes />
              </div>
              <div className="grid gap-5">
                <ProfileEditForm form={form} saving={saving} canSave={canSave} onChange={updateField} onSubmit={submit} />
                <ArbiterManagePanel wallet={wallet} />
              </div>
            </div>
          </div>
        </main>
      </div>
      <ProfileSaveConfirm pendingProfile={pendingProfile} onCancel={() => setPendingProfile(null)} onConfirm={confirmSave} />
    </section>
  )
}
