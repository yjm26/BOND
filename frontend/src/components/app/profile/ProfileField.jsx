export default function ProfileField({ label, note, value, onChange, placeholder, required }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/42">{label}{required ? ' *' : ''}</span>
      {note && <span className="mt-1 block text-[12px] leading-[1.55] text-[#ede9df]/38">{note}</span>}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-3 h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/24 focus:border-[#d8b15f]/60" />
    </label>
  )
}
