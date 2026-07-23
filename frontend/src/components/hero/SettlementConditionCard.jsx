export default function SettlementConditionCard() {
  return (
    <div className="absolute bottom-4 left-0 max-w-[420px] border-t border-[#ede9df]/15 pt-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#ede9df]/38">Trust boundary</div>
      <p className="mt-2 max-w-[360px] text-[15px] leading-[1.45] tracking-[-0.02em] text-[#ede9df]/66">
        Everything stays visible before value moves: buyer, seller, locked USDC, proof, and the fallback path.
      </p>
    </div>
  )
}
