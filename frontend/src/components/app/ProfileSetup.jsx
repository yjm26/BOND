import { useState } from 'react'
import ConfirmModal from '../ConfirmModal'

const SETUP_STEPS = [
  {
    key: 'displayName',
    label: 'Display name',
    title: 'What should BOND call you?',
    placeholder: 'e.g. yjm26',
    helper: 'Shown inside your local workspace. Keep it short and recognizable.',
    required: true,
  },
  {
    key: 'xProfile',
    label: 'X profile',
    title: 'Add your X profile.',
    placeholder: 'e.g. @yjm26',
    helper: 'Optional for now. Useful later when counterparties need off-chain context.',
  },
  {
    key: 'discord',
    label: 'Discord',
    title: 'Add your Discord handle.',
    placeholder: 'e.g. yjm26',
    helper: 'Optional for now. This stays local until real profile storage exists.',
  },
]

export default function ProfileSetup({ wallet, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState({ displayName: '', xProfile: '', discord: '' })
  const [pendingProfile, setPendingProfile] = useState(null)

  const currentStep = SETUP_STEPS[stepIndex]
  const isLastStep = stepIndex === SETUP_STEPS.length - 1
  const currentValue = form[currentStep.key]
  const canContinue = !currentStep.required || currentValue.trim().length > 0

  const updateField = (value) => {
    setForm((current) => ({ ...current, [currentStep.key]: value }))
  }

  const submit = (event) => {
    event.preventDefault()
    if (!canContinue) return

    if (!isLastStep) {
      setStepIndex((current) => current + 1)
      return
    }

    setPendingProfile({
      displayName: form.displayName.trim(),
      xProfile: form.xProfile.trim(),
      discord: form.discord.trim(),
      createdAt: new Date().toISOString(),
    })
  }

  return (
    <section className="min-h-screen bg-[#20201f] px-6 pt-[96px] text-[#ede9df] sm:px-10 lg:px-14">
      <div className="grid min-h-[calc(100vh-96px)] gap-10 py-10 lg:grid-cols-[44%_1fr] lg:items-center">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">First workspace setup</div>
          <h1 className="mt-5 max-w-[660px] text-[clamp(48px,7vw,92px)] font-medium leading-[0.9] tracking-[-0.08em]">
            Set up your BOND profile before entering the app.
          </h1>
          <p className="mt-6 max-w-[500px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#c8c1b4]">
            Just enough identity for a cleaner workspace. Public reputation stays empty until it is backed by real app activity.
          </p>
          <div className="mt-8 border-l border-[#ede9df]/14 pl-4 font-mono text-[10px] uppercase leading-[1.9] tracking-[0.16em] text-[#ede9df]/46">
            Wallet<br />
            <span className="text-[#ede9df]">{wallet.address.slice(0, 8)}…{wallet.address.slice(-6)}</span>
          </div>
        </div>

        <form onSubmit={submit} className="border border-[#ede9df]/14 bg-[#171716] p-5 sm:p-7 lg:max-w-[540px] lg:justify-self-end">
          <div className="flex items-center justify-between gap-4">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">
              Step {stepIndex + 1} / {SETUP_STEPS.length}
            </div>
            <div className="flex gap-1.5">
              {SETUP_STEPS.map((step, index) => (
                <span
                  key={step.key}
                  className={`h-1.5 w-8 ${index <= stepIndex ? 'bg-[#d8b15f]' : 'bg-[#ede9df]/14'}`}
                />
              ))}
            </div>
          </div>

          <h2 className="mt-12 max-w-[380px] text-[42px] font-medium leading-[0.94] tracking-[-0.07em] text-[#ede9df]">
            {currentStep.title}
          </h2>
          <p className="mt-4 max-w-[380px] text-[14px] leading-[1.65] text-[#b9b2a5]">
            {currentStep.helper}
          </p>

          <label className="mt-10 block">
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/44">{currentStep.label}</span>
            <input
              autoFocus
              value={currentValue}
              onChange={(event) => updateField(event.target.value)}
              placeholder={currentStep.placeholder}
              className="mt-3 h-12 w-full border border-[#ede9df]/14 bg-[#20201f] px-4 text-[15px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/70"
            />
          </label>

          <div className="mt-8 grid grid-cols-[0.8fr_1.2fr] gap-2">
            <button
              type="button"
              onClick={() => setStepIndex((current) => Math.max(0, current - 1))}
              disabled={stepIndex === 0}
              className="h-12 border border-[#ede9df]/14 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-30"
            >
              Back
            </button>
            <button
              disabled={!canContinue}
              className="h-12 border border-[#ede9df] bg-[#ede9df] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {isLastStep ? 'Review profile' : 'Continue'}
            </button>
          </div>
        </form>
      </div>
      <ConfirmModal
        open={Boolean(pendingProfile)}
        tone="dark"
        eyebrow="Profile setup"
        title="Save this workspace profile?"
        description="BOND will save your display name, X profile, and Discord handle as local workspace preferences for this wallet."
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
