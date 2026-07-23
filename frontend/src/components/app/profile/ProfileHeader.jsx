export default function ProfileHeader({ profile }) {
  return (
    <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">My profile</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-[clamp(40px,6vw,72px)] font-medium leading-[0.92] tracking-[-0.08em] text-[#ede9df]">{profile.displayName || 'Unnamed workspace'}</h1>
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.7] text-[#b9b2a5]">Your BOND identity is local workspace context for now. Social handles are self-reported until verified connections are implemented.</p>
        </div>
        <div className="border border-[#ede9df]/10 bg-[#111110] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#ede9df]/40">
          Profile state<br />
          <span className="text-[#d8b15f]">Local prototype</span>
        </div>
      </div>
    </div>
  )
}
