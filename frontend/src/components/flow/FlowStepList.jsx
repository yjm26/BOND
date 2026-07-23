export default function FlowStepList({ steps }) {
  return (
    <div className="mt-12 space-y-12 lg:mt-16">
      {steps.map((step) => (
        <article key={step.num} className="grid gap-4 border-t border-[#ede9df]/12 pt-5 sm:grid-cols-[88px_1fr]">
          <div className="font-mono text-[12px] uppercase tracking-[0.18em] text-[#d8b15f]">
            {step.num} / {step.label}
          </div>
          <div>
            <h3 className="max-w-[480px] text-[21px] font-medium leading-[1.08] tracking-[-0.045em] text-[#ede9df]">
              {step.title}
            </h3>
            <p className="mt-3 max-w-[500px] text-[14px] leading-[1.65] text-[#b9b2a5]">
              {step.body}
            </p>
          </div>
        </article>
      ))}
    </div>
  )
}
