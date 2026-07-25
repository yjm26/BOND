export default function ProfileField({ label, note, value, onChange, placeholder, required }) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[color:var(--a-faint)]">{label}{required ? ' *' : ''}</span>
      {note && <span className="mt-1 block text-[12px] leading-[1.55] text-[color:var(--a-faint)]">{note}</span>}
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="mt-3 h-12 w-full border border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] px-4 text-[14px] text-[var(--a-ink,#fafafa)] outline-none transition placeholder:text-[var(--a-ink,#fafafa)]/24 focus:border-[var(--a-muted,#a3a3a3)]/60" />
    </label>
  )
}
