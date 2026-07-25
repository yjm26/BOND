export default function ProfileHeader({ profile }) {
  return (
    <div className="mb-5 border border-[#fafafa]/10 bg-[#111111] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">My profile</div>
      <div className="mt-5 grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
        <div>
          <h1 className="text-[clamp(40px,6vw,72px)] font-medium leading-[0.92] tracking-[-0.08em] text-[#fafafa]">{profile.displayName || 'Unnamed workspace'}</h1>
          <p className="mt-4 max-w-[520px] text-[14px] leading-[1.7] text-[#a3a3a3]">Your BOND identity is local workspace context for now. Social handles are self-reported until verified connections are implemented.</p>
        </div>
        <div className="border border-[#fafafa]/10 bg-[#0a0a0a] px-4 py-3 font-mono text-[10px] uppercase leading-[1.8] tracking-[0.14em] text-[#fafafa]/40">
          Profile state<br />
          <span className="text-[#a3a3a3]">Local prototype</span>
        </div>
      </div>
    </div>
  )
}
