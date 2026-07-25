export default function AppHomeProfilePanel({ profile, name }) {
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/42">Profile</div>
      <div className="mt-6 text-[28px] font-medium tracking-[-0.05em] text-[#ede9df]">{name}</div>
      <div className="mt-3 space-y-1 font-mono text-[10px] uppercase tracking-[0.14em] text-[#ede9df]/46">
        <div>X: {profile?.xProfile || 'Not added'}</div>
        <div>Discord: {profile?.discord || 'Not added'}</div>
      </div>
    </div>
  )
}
