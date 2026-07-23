export default function ProfileSetupProgress({ steps, stepIndex }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">
        Step {stepIndex + 1} / {steps.length}
      </div>
      <div className="flex gap-1.5">
        {steps.map((step, index) => (
          <span key={step.key} className={`h-1.5 w-8 ${index <= stepIndex ? 'bg-[#d8b15f]' : 'bg-[#ede9df]/14'}`} />
        ))}
      </div>
    </div>
  )
}
