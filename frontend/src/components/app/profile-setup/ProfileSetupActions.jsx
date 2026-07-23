export default function ProfileSetupActions({ canContinue, isFirstStep, isLastStep, onBack }) {
  return (
    <div className="mt-8 grid grid-cols-[0.8fr_1.2fr] gap-2">
      <button type="button" onClick={onBack} disabled={isFirstStep} className="h-12 border border-[#ede9df]/14 font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-30">
        Back
      </button>
      <button disabled={!canContinue} className="h-12 border border-[#ede9df] bg-[#ede9df] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df] disabled:cursor-not-allowed disabled:opacity-40">
        {isLastStep ? 'Review profile' : 'Continue'}
      </button>
    </div>
  )
}
