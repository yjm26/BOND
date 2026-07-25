export default function AppHomeProfilePanel({ profile, name }) {
  return (
    <div className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[color:var(--a-faint)]">Profile</div>
      <div className="mt-6 text-[28px] font-medium tracking-[-0.05em] text-[var(--a-ink,#fafafa)]">{name}</div>
      <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--a-ink,#fafafa)]/46">
        <div>X: {profile?.xProfile || 'Not added'}</div>
        <div>Discord: {profile?.discord || 'Not added'}</div>
      </div>
    </div>
  )
}
