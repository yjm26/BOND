import { formatAddress } from '../../utils/constants'

export default function ArbiterDecisionPanel({ room, role, resolving, txStatus, onResolve, onSplit }) {
  const canAct = role === 'Owner' || role === 'Arbiter'
  return (
    <div className="border border-[#ede9df]/10 bg-[#20201f] p-5">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#d8b15f]">Decision</div>
      <h3 className="mt-4 text-[28px] font-medium leading-[1] tracking-[-0.06em] text-[#ede9df]">Move locked funds.</h3>
      <p className="mt-3 text-[13px] leading-[1.65] text-[#b9b2a5]">Resolve sends escrow to one side. Split sends the funded amount 50/50 and returns seller collateral to seller. Use only after reviewing proof.</p>
      <div className="mt-5 grid gap-3">
        <button disabled={!canAct || resolving} onClick={() => onResolve(room.buyer)} className="border border-[#b7c8a3]/35 bg-[#b7c8a3]/10 px-4 py-4 text-left transition hover:bg-[#b7c8a3]/15 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#b7c8a3]">Resolve to buyer</span>
          <span className="mt-2 block font-mono text-[12px] text-[#ede9df]">{formatAddress(room.buyer)}</span>
        </button>
        <button disabled={!canAct || resolving} onClick={() => onResolve(room.seller)} className="border border-[#d8b15f]/35 bg-[#d8b15f]/10 px-4 py-4 text-left transition hover:bg-[#d8b15f]/15 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#d8b15f]">Resolve to seller</span>
          <span className="mt-2 block font-mono text-[12px] text-[#ede9df]">{formatAddress(room.seller)}</span>
        </button>
        <button disabled={!canAct || resolving} onClick={onSplit} className="border border-[#ede9df]/14 px-4 py-4 text-left transition hover:border-[#ede9df]/34 disabled:cursor-not-allowed disabled:opacity-40">
          <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-[#ede9df]/64">Split escrow</span>
          <span className="mt-2 block text-[12px] text-[#b9b2a5]">50/50 funded amount, collateral back to seller.</span>
        </button>
      </div>
      {!canAct && <div className="mt-5 border border-[#c98b4a]/30 bg-[#c98b4a]/10 p-3 text-[12px] leading-[1.55] text-[#c98b4a]">Role {role || 'User'} can view room context only. Owner or active arbiter required for decisions.</div>}
      {txStatus && <div className={`mt-5 border px-4 py-3 text-[13px] leading-[1.55] ${txStatus.type === 'ok' ? 'border-[#b7c8a3]/28 bg-[#b7c8a3]/10 text-[#b7c8a3]' : txStatus.type === 'err' ? 'border-[#c98b4a]/35 bg-[#c98b4a]/10 text-[#c98b4a]' : 'border-[#d8b15f]/24 bg-[#d8b15f]/[0.07] text-[#d8b15f]'}`}>{txStatus.msg}</div>}
    </div>
  )
}
