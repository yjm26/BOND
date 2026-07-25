export default function AppHomeProfilePanel({ profile, name }) {
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/42">Profile</div>
      <div className="mt-6 text-[28px] font-medium tracking-[-0.05em] text-[#fafafa]">{name}</div>
      <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#fafafa]/46">
        <div>X: {profile?.xProfile || 'Not added'}</div>
        <div>Discord: {profile?.discord || 'Not added'}</div>
      </div>
    </div>
  )
}
