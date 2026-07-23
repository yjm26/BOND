import AppGate from './AppGate'

export default function ProfileSettings({ wallet, connecting, connectError, onConnect }) {
  if (!wallet) {
    return <AppGate connecting={connecting} connectError={connectError} onConnect={onConnect} />
  }

  return (
    <section className="min-h-screen bg-[#ede9df] px-6 pt-[112px] text-[#171716] sm:px-10 lg:px-14">
      <div className="grid gap-12 lg:grid-cols-[36%_1fr]">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6b62]">Profile / Settings</div>
          <h1 className="mt-5 max-w-[520px] text-[clamp(44px,6vw,82px)] font-medium leading-[0.92] tracking-[-0.08em]">
            Workspace identity, without fake reputation.
          </h1>
          <p className="mt-6 max-w-[440px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#5f5a50]">
            This page starts with honest local workspace settings. Reputation, saved profile data, and notifications should only become editable once they are backed by real app data.
          </p>
        </div>

        <div className="grid gap-3">
          <div className="border border-[#171716]/14 bg-[#f4f0e7] p-5 sm:p-6">
            <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">Connected wallet</div>
            <div className="mt-5 break-all font-mono text-[13px] text-[#171716]">{wallet.address}</div>
          </div>
          {['Display name', 'Notification preference', 'Default room role'].map((label) => (
            <div key={label} className="flex items-center justify-between border border-[#171716]/14 bg-[#f4f0e7] p-5 sm:p-6">
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">{label}</div>
                <div className="mt-2 text-[14px] text-[#5f5a50]">Coming after profile storage is implemented.</div>
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[#171716]/35">Soon</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
