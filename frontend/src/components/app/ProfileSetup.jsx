import { useState } from 'react'
import ConfirmModal from '../ConfirmModal'

export default function ProfileSetup({ wallet, onComplete }) {
  const [displayName, setDisplayName] = useState('')
  const [defaultRole, setDefaultRole] = useState('buyer')
  const [pendingProfile, setPendingProfile] = useState(null)

  const submit = (event) => {
    event.preventDefault()
    setPendingProfile({
      displayName: displayName.trim() || 'BOND member',
      defaultRole,
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <section className="min-h-screen bg-[#050505] px-6 pt-[96px] text-[#ede9df] sm:px-10 lg:px-14">
      <div className="grid min-h-[calc(100vh-96px)] gap-10 py-10 lg:grid-cols-[42%_1fr] lg:items-center">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">First workspace setup</div>
          <h1 className="mt-5 max-w-[640px] text-[clamp(48px,7vw,92px)] font-medium leading-[0.9] tracking-[-0.08em]">
            Set up your BOND profile before entering the app.
          </h1>
          <p className="mt-6 max-w-[500px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#b9b2a5]">
            This only saves local workspace preferences for now. Reputation and public profile data will stay empty until they are backed by real app data.
          </p>
          <div className="mt-8 border-l border-[#ede9df]/14 pl-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[#ede9df]/46">
            Wallet<br />
            <span className="text-[#ede9df]">{wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}</span>
          </div>
        </div>

        <form onSubmit={submit} className="border border-[#ede9df]/12 bg-[#20201f] p-5 sm:p-7 lg:max-w-[560px] lg:justify-self-end">
          <label className="block">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/44">Display name</span>
            <input
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="e.g. yjm26"
              className="mt-3 h-12 w-full border border-[#ede9df]/12 bg-[#050505] px-4 text-[15px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/70"
            />
          </label>

          <div className="mt-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/44">Default role</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {['buyer', 'seller'].map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setDefaultRole(role)}
                  className={`h-11 border font-mono text-[11px] uppercase tracking-[0.16em] transition ${
                    defaultRole === role
                      ? 'border-[#d8b15f] bg-[#d8b15f] text-[#20201f]'
                      : 'border-[#ede9df]/12 bg-transparent text-[#ede9df]/62 hover:border-[#ede9df]/32 hover:text-[#ede9df]'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <button className="mt-8 flex h-12 w-full items-center justify-center border border-[#ede9df] bg-[#ede9df] font-mono text-[12px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">
            Enter workspace
          </button>
        </form>
      </div>
      <ConfirmModal
        open={Boolean(pendingProfile)}
        tone="dark"
        eyebrow="Profile setup"
        title="Save this workspace profile?"
        description="BOND will use these local preferences to prepare your app workspace. You can adjust real profile settings later when profile storage is implemented."
        confirmLabel="Save profile"
        cancelLabel="Review"
        onCancel={() => setPendingProfile(null)}
        onConfirm={() => {
          if (pendingProfile) onComplete(pendingProfile)
        }}
      />
    </section>
  )
}
