export default function CreateRoomField({ label, note, suffix, disabled, children }) {
  return (
    <label className="block">
      {label && <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[#ede9df]/42">{label}</div>}
      <div className="relative">
        {children}
        {suffix && <span className="absolute right-4 top-1/2 -translate-y-1/2 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/42">{suffix}</span>}
      </div>
      {note && <p className={`mt-2 text-[12px] leading-[1.55] ${disabled ? 'text-[#ede9df]/32' : 'text-[#b9b2a5]'}`}>{note}</p>}
    </label>
  )
}
