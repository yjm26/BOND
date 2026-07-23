import { Link } from 'react-router-dom'

export default function ArbiterGate({ role, loadingRole, error }) {
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-8 text-center sm:p-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center border border-[#ede9df]/12 bg-[#111110] font-mono text-[13px] text-[#d8b15f]">!</div>
      <div className="mt-6 font-mono text-[10px] uppercase tracking-[0.24em] text-[#d8b15f]">Dispute desk</div>
      <h1 className="mt-4 text-[clamp(34px,5vw,60px)] font-medium leading-[0.94] tracking-[-0.08em] text-[#ede9df]">
        {loadingRole ? 'Checking access.' : 'Arbiter access required.'}
      </h1>
      <p className="mx-auto mt-4 max-w-[560px] text-[14px] leading-[1.7] text-[#b9b2a5]">
        {loadingRole ? 'Reading owner and arbiter status from the verified BoundTestnet contract.' : 'Only wallets with Role Owner or Role Arbiter can review disputed rooms and send resolution transactions.'}
      </p>
      {error && <div className="mx-auto mt-5 max-w-[560px] border border-[#c98b4a]/35 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{error}</div>}
      {!loadingRole && (
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link to="/profile" className="h-11 border border-[#ede9df] bg-[#ede9df] px-5 py-3 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#20201f] transition hover:bg-transparent hover:text-[#ede9df]">Open profile</Link>
          <Link to="/rooms" className="h-11 border border-[#ede9df]/14 px-5 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64 transition hover:border-[#ede9df]/34 hover:text-[#ede9df]">My rooms</Link>
        </div>
      )}
      {!loadingRole && role && <div className="mt-5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/36">Current role: <span className="text-[#ede9df]">{role}</span></div>}
    </div>
  )
}
