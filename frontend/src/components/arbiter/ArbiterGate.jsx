import { Link } from 'react-router-dom'

export default function ArbiterGate({ role, loadingRole, error }) {
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-8 text-center sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#fafafa]/12 bg-[#0a0a0a] font-mono text-[13px] text-[#a3a3a3]">!</div>
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-[#a3a3a3]">Dispute desk</div>
      <h1 className="mt-4 text-[clamp(34px,5vw,60px)] font-medium leading-[0.94] tracking-[-0.08em] text-[#fafafa]">
        {loadingRole ? 'Checking access.' : 'Arbiter access required.'}
      </h1>
      <p className="mx-auto mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[#a3a3a3]">
        {loadingRole ? 'Reading owner and arbiter status from the verified BoundTestnet contract.' : 'Only wallets with Role Owner or Role Arbiter can review disputed rooms and send resolution transactions.'}
      </p>
      {error && <div className="mx-auto mt-5 max-w-[560px] border border-[#b87333]/35 bg-[#b87333]/10 px-4 py-3 text-[13px] text-[#b87333]">{error}</div>}
      {!loadingRole && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/profile" className="h-11 border border-[#fafafa] bg-[#fafafa] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#111111] transition hover:bg-transparent hover:text-[#fafafa]">Open profile</Link>
          <Link to="/rooms" className="h-11 border border-[#fafafa]/14 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64 transition hover:border-[#fafafa]/34 hover:text-[#fafafa]">My rooms</Link>
        </div>
      )}
      {!loadingRole && role && <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/36">Current role: <span className="text-[#fafafa]">{role}</span></div>}
    </div>
  )
}
