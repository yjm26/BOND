export default function FlowStepList({ steps }) {
  return (
    <div className="space-y-0">
      {steps.map((step) => (
        <article key={step.num} className="grid gap-4 border-t border-[#ede9df]/10 py-6 first:border-t-0 first:pt-0 last:pb-0 sm:grid-cols-[92px_1fr]">
          <div className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#d8b15f]">
            {step.num}<span className="block pt-2 text-[#ede9df]/36">{step.label}</span>
          </div>
          <div>
            <h3 className="max-w-[620px] text-[24px] font-medium leading-[1.02] tracking-[-0.055em] text-[#ede9df] sm:text-[30px]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[560px] text-[14px] leading-[1.65] text-[#b9b2a5]">
              {step.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
