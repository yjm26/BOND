export default function CreateRoomField({ label, note, suffix, disabled, children }) {
  return (
    <label className="block">
      {label && <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#fafafa]/42">{label}</div>}
      <div className="relative">
        {children}
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/42">{suffix}</span>}
      </div>
      {note && <p className={`mt-2 text-[12px] leading-[1.55] ${disabled ? 'text-[#fafafa]/32' : 'text-[#a3a3a3]'}`}>{note}</p>}
    </label>
  )
}
