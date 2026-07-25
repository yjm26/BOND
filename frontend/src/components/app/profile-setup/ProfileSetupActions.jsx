export default function ProfileSetupActions({ canContinue, isFirstStep, isLastStep, onBack }) {
  return (
    <div className="mt-8 grid grid-cols-[0.8fr_1.2fr] gap-2">
      <button type="button" onClick={onBack} disabled={isFirstStep} className="h-12 border border-[var(--a-line)] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--a-ink,#fafafa)]/64 transition hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)] disabled:cursor-not-allowed disabled:opacity-30">
        Back
      </button>
      <button disabled={!canContinue} className="h-12 border border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[var(--a-ink,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40">
        {isLastStep ? 'Review profile' : 'Continue'}
      </button>
    </div>
  )
}
