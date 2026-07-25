export default function ProfileSetupField({ step, value, onChange }) {
  return (
    <>
      <h2 className="mt-12 max-w-[380px] text-[42px] font-medium leading-[0.94] tracking-[-0.07em] text-[#fafafa]">
        {step.title}
      </h2>
      <p className="mt-4 max-w-[380px] text-[14px] leading-[1.65] text-[#a3a3a3]">
        {step.helper}
      </p>
      <label className="mt-10 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/44">{step.label}</span>
        {step.note && <span className="mt-2 block text-[12px] leading-[1.55] text-[#fafafa]/38">{step.note}</span>}
        <input
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={step.placeholder}
          className="mt-3 h-12 w-full border border-[#fafafa]/14 bg-[#111111] px-4 text-[15px] text-[#fafafa] outline-none transition placeholder:text-[#fafafa]/28 focus:border-[#a3a3a3]/70"
        />
      </label>
    </>
  )
}
