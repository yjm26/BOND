import FlowStepList from './FlowStepList'
import FlowTextMap from './FlowTextMap'
import { FLOW_STEPS } from './flowData'

export default function SettlementFlowSection() {
  return (
    <section id="how" className="bg-[#20201f] text-[#ede9df]">
      <div className="grid min-h-screen lg:grid-cols-[48%_52%]">
        <div className="px-6 py-20 sm:px-10 lg:px-14 lg:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">How BOND works</div>
          <h2 className="mt-5 max-w-[620px] text-[clamp(44px,6vw,78px)] font-medium leading-[0.92] tracking-[-0.08em] text-[#ede9df]">
            The escrow flow stays readable from first message to final settlement.
          </h2>
          <p className="mt-6 max-w-[540px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#b9b2a5]">
            BOND turns a messy off-platform deal into a sequence of explicit states: create the room, fund USDC, attach proof, then release, refund, or arbitrate.
          </p>
          <FlowStepList steps={FLOW_STEPS} />
        </div>
        <FlowTextMap />
      </div>
    </section>
  )
}
