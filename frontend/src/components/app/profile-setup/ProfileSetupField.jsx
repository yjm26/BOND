export default function ProfileSetupField({ step, value, onChange }) {
  return (
    <>
      <h2 className="mt-12 max-w-[380px] text-[42px] font-medium leading-[0.94] tracking-[-0.07em] text-[#ede9df]">
        {step.title}
      </h2>
      <p className="mt-4 max-w-[380px] text-[14px] leading-[1.65] text-[#b9b2a5]">
        {step.helper}
      </p>
      <label className="mt-10 block">
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/44">{step.label}</span>
        {step.note && <span className="mt-2 block text-[12px] leading-[1.55] text-[#ede9df]/38">{step.note}</span>}
        <input
          autoFocus
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={step.placeholder}
          className="mt-3 h-12 w-full border border-[#ede9df]/14 bg-[#20201f] px-4 text-[15px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/70"
        />
      </label>
    </>
  )
}
