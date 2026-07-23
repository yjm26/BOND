import { useState } from 'react'
import ProfileSetupConfirm from './profile-setup/ProfileSetupConfirm'
import ProfileSetupForm from './profile-setup/ProfileSetupForm'
import ProfileSetupIntro from './profile-setup/ProfileSetupIntro'
import { EMPTY_PROFILE_FORM, SETUP_STEPS } from './profile-setup/profileSetupData'

export default function ProfileSetup({ wallet, onComplete }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [form, setForm] = useState(EMPTY_PROFILE_FORM)
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
        <ProfileSetupIntro wallet={wallet} />
        <ProfileSetupForm
          steps={SETUP_STEPS}
          stepIndex={stepIndex}
          currentStep={currentStep}
          currentValue={currentValue}
          canContinue={canContinue}
          isLastStep={isLastStep}
          onBack={() => setStepIndex((current) => Math.max(0, current - 1))}
          onChange={updateField}
          onSubmit={submit}
        />
      </div>
      <ProfileSetupConfirm
        pendingProfile={pendingProfile}
        onCancel={() => setPendingProfile(null)}
        onConfirm={() => {
          if (pendingProfile) onComplete(pendingProfile)
        }}
      />
    </section>
  )
}
