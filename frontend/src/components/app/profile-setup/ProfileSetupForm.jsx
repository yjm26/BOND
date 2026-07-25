import ProfileSetupActions from './ProfileSetupActions'
import ProfileSetupField from './ProfileSetupField'
import ProfileSetupProgress from './ProfileSetupProgress'

export default function ProfileSetupForm({ steps, stepIndex, currentStep, currentValue, canContinue, isLastStep, onBack, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="border border-[#fafafa]/14 bg-[#0a0a0a] p-5 sm:p-7 lg:max-w-[540px] lg:justify-self-end">
      <ProfileSetupProgress steps={steps} stepIndex={stepIndex} />
      <ProfileSetupField step={currentStep} value={currentValue} onChange={onChange} />
      <ProfileSetupActions canContinue={canContinue} isFirstStep={stepIndex === 0} isLastStep={isLastStep} onBack={onBack} />
    </form>
  )
}
