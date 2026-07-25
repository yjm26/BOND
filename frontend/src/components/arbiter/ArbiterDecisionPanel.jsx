import { formatAddress } from '../../utils/constants'

export default function ArbiterDecisionPanel({ room, role, resolving, txStatus, onResolve, onSplit }) {
  const canAct = role === 'Owner' || role === 'Arbiter'
  return (
    <div className="border border-[#fafafa]/10 bg-[#111111] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#a3a3a3]">Decision</div>
      <h3 className="mt-4 text-[28px] font-medium leading-[1] tracking-[-0.06em] text-[#fafafa]">Move locked funds.</h3>
      <p className="mt-3 text-[13px] leading-[1.65] text-[#a3a3a3]">Resolve sends escrow to one side. Split sends the funded amount 50/50 and returns seller collateral to seller. Use only after reviewing proof.</p>
      <div className="mt-5 grid gap-3">
        <button disabled={!canAct || resolving} onClick={() => onResolve(room.buyer)} className="border border-[#8f9a88]/35 bg-[#8f9a88]/10 px-4 py-4 text-left transition hover:bg-[#8f9a88]/15 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#8f9a88]">Resolve to buyer</span>
          <span className="mt-2 block font-mono text-[12px] text-[#fafafa]">{formatAddress(room.buyer)}</span>
        </button>
        <button disabled={!canAct || resolving} onClick={() => onResolve(room.seller)} className="border border-[#a3a3a3]/35 bg-[#a3a3a3]/10 px-4 py-4 text-left transition hover:bg-[#a3a3a3]/15 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#a3a3a3]">Resolve to seller</span>
          <span className="mt-2 block font-mono text-[12px] text-[#fafafa]">{formatAddress(room.seller)}</span>
        </button>
        <button disabled={!canAct || resolving} onClick={onSplit} className="border border-[#fafafa]/14 px-4 py-4 text-left transition hover:border-[#fafafa]/34 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#fafafa]/64">Split escrow</span>
          <span className="mt-2 block text-[12px] text-[#a3a3a3]">50/50 funded amount, collateral back to seller.</span>
        </button>
      </div>
      {!canAct && <div className="mt-5 border border-[#b87333]/30 bg-[#b87333]/10 p-3 text-[12px] leading-[1.55] text-[#b87333]">Role {role || 'User'} can view room context only. Owner or active arbiter required for decisions.</div>}
      {txStatus && <div className={`mt-5 border px-4 py-3 text-[13px] leading-[1.55] ${txStatus.type === 'ok' ? 'border-[#8f9a88]/28 bg-[#8f9a88]/10 text-[#8f9a88]' : txStatus.type === 'err' ? 'border-[#b87333]/35 bg-[#b87333]/10 text-[#b87333]' : 'border-[#a3a3a3]/24 bg-[#a3a3a3]/[0.07] text-[#a3a3a3]'}`}>{txStatus.msg}</div>}
    </div>
  )
}
