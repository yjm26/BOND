import ProfileField from './ProfileField'

export default function ProfileEditForm({ form, saving, canSave, onChange, onSubmit }) {
  return (
    <form onSubmit={onSubmit} className="border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-5 sm:p-6">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-ink,#fafafa)]/40">Edit profile</div>
          <p className="mt-2 text-[13px] leading-[1.6] text-[var(--a-muted,#a3a3a3)]">Keep this lightweight. Buyer/seller role is decided per room, not in profile.</p>
        </div>
        <span className="border border-[var(--a-muted,#a3a3a3)]/24 bg-[var(--a-muted,#a3a3a3)]/[0.07] px-2.5 py-1 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--a-muted,#a3a3a3)]">Manual</span>
      </div>
      <div className="grid gap-4">
        <ProfileField label="Display name" required value={form.displayName} onChange={(value) => onChange('displayName', value)} placeholder="e.g. yjm" />
        <ProfileField label="X profile" note="For now this is self-reported. Verified X connection will replace manual handles later." value={form.xProfile} onChange={(value) => onChange('xProfile', value)} placeholder="e.g. @yjm26" />
        <ProfileField label="Discord" note="Optional and self-reported for prototype contact context." value={form.discord} onChange={(value) => onChange('discord', value)} placeholder="e.g. yjm#0001" />
      </div>
      <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-end">
        <button type="submit" disabled={!canSave || saving} className="h-11 border border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[var(--a-ink,#fafafa)] disabled:cursor-not-allowed disabled:opacity-40">{saving ? 'Saving…' : 'Save profile'}</button>
      </div>
    </form>
  )
}
