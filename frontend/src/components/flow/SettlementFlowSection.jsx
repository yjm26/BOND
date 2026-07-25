import FlowStepList from './FlowStepList'
import { FLOW_STEPS } from './flowData'

export default function SettlementFlowSection() {
  return (
    <section id="how" className="relative overflow-hidden bg-[#111111] px-6 py-16 text-[#fafafa] sm:px-10 sm:py-24 lg:px-14 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[38%_1fr] lg:items-start">
        <div className="lg:sticky lg:top-28">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">Room states</div>
          <h2 className="mt-5 max-w-[560px] text-[clamp(42px,5vw,76px)] font-medium leading-[0.9] tracking-[-0.085em] text-[#fafafa]">
            A deal should not have a vague ending.
          </h2>
          <p className="mt-6 max-w-[460px] text-[15px] leading-[1.72] tracking-[-0.01em] text-[#a3a3a3]">
            BOND is not trying to make trade feel flashy. It makes the boring parts hard to misread: who acts next, where the money is, and what happens if someone stops replying.
          </p>
        </div>

        <div className="border border-[#fafafa]/12 bg-[#0a0a0a] p-4 sm:p-6 lg:p-8">
          <div className="mb-8 flex flex-col gap-3 border-b border-[#fafafa]/10 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#fafafa]/36">Possible endings</div>
              <p className="mt-2 max-w-[500px] text-[14px] leading-[1.6] text-[#fafafa]/60">Release when delivered. Refund when terms fail. Dispute when proof needs review.</p>
            </div>
            <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#a3a3a3]">Arc Testnet</div>
          </div>
          <FlowStepList steps={FLOW_STEPS} />
        </div>
      </div>
    </section>
  )
}
