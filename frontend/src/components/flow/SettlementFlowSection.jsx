import FlowStepList from './FlowStepList'
import FlowTextMap from './FlowTextMap'
import { FLOW_STEPS } from './flowData'

export default function SettlementFlowSection() {
  return (
    <section id="how" className="relative overflow-hidden bg-[#20201f] text-[#ede9df]">
      <div className="absolute inset-0 z-0 hidden lg:block [&>div]:h-full [&>div]:min-h-screen">
        <FlowTextMap />
      </div>
      <div className="pointer-events-none absolute inset-0 z-10 bg-[radial-gradient(circle_at_72%_48%,rgba(216,177,95,0.10),transparent_34rem),linear-gradient(90deg,#20201f_0%,#20201f_27%,rgba(32,32,31,0.96)_39%,rgba(32,32,31,0.72)_52%,rgba(32,32,31,0.24)_70%,transparent_100%)]" />
      <div className="relative z-20 lg:min-h-screen">
        <div className="max-w-[680px] px-6 py-16 sm:px-10 lg:px-14 lg:py-24">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">How BOND works</div>
          <h2 className="mt-5 max-w-[560px] text-[clamp(38px,5vw,66px)] font-medium leading-[0.94] tracking-[-0.075em] text-[#ede9df]">
            The escrow flow stays readable from first message to final settlement.
          </h2>
          <p className="mt-6 max-w-[520px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#b9b2a5]">
            BOND turns a messy off-platform deal into a sequence of explicit states: create the room, fund USDC, attach proof, then release, refund, or arbitrate.
          </p>
          <FlowStepList steps={FLOW_STEPS} />
        </div>
      </div>
    </section>
  )
}
