const STEPS = [
  {
    num: '01',
    title: 'Open a private room',
    desc: 'Set the asset, service, or agent task. Share a private join code so only the counterparty can enter.',
  },
  {
    num: '02',
    title: 'Lock USDC on Arc',
    desc: 'Buyer funds escrow through the USDC ERC-20 interface. Seller collateral can be required for higher-risk deals.',
  },
  {
    num: '03',
    title: 'Submit delivery proof',
    desc: 'Seller or agent marks the room delivered. Evidence, links, hashes, and dispute context stay attached to the room.',
  },
  {
    num: '04',
    title: 'Release, refund, or arbitrate',
    desc: 'Buyer confirms release. If something breaks, funds stay frozen until refund, mutual cancel, or arbiter resolution.',
  },
]

const CAPABILITIES = [
  { label: 'Human deals', desc: 'Freelance work, digital delivery, bounties, and marketplace trades.' },
  { label: 'Agent tasks', desc: 'Task rooms for autonomous services with delivery proof and evaluator-style review.' },
  { label: 'Crosschain ready', desc: 'Designed for CCTP/App Kit onboarding so users can bring USDC into Arc before funding.' },
]

const ARC_FACTS = [
  { label: 'Gas token', value: 'USDC', desc: 'No separate volatile gas asset.' },
  { label: 'Finality', value: '<1s', desc: 'Fast, deterministic settlement.' },
  { label: 'Escrow fee', value: '1%', desc: 'Only when a room is funded.' },
]

export default function HowItWorks() {
  return (
    <section id="how" className="border-t border-white/[0.08] px-4 py-20 sm:px-6 lg:py-28">
      <div className="mx-auto max-w-[1120px]">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div>
            <div className="section-kicker">How BOND works</div>
            <h2 className="mt-4 max-w-[440px] text-[36px] font-medium leading-[1.02] tracking-[-0.055em] text-bond-text sm:text-[48px]">
              A deal room with settlement logic built in.
            </h2>
            <p className="mt-5 max-w-[460px] text-[15px] leading-[1.75] text-bond-muted">
              BOND keeps the familiar web2 pattern — create a deal, invite a counterparty, submit work — but moves the money and resolution path onto Arc.
            </p>
          </div>

          <div className="card-3d overflow-hidden rounded-2xl">
            {STEPS.map((step, index) => (
              <div key={step.num} className={`grid gap-4 p-5 sm:grid-cols-[64px_1fr] sm:p-6 ${index > 0 ? 'border-t border-white/[0.08]' : ''}`}>
                <div className="font-mono text-[12px] text-bond-faint">{step.num}</div>
                <div>
                  <h3 className="text-[17px] font-medium tracking-[-0.02em] text-bond-text">{step.title}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-bond-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 grid gap-4 md:grid-cols-3">
          {CAPABILITIES.map((item) => (
            <div key={item.label} className="card-3d rounded-2xl p-6">
              <div className="mb-5 h-9 w-9 rounded-lg border border-white/[0.08] bg-white/[0.035]" />
              <h3 className="text-[18px] font-medium tracking-[-0.025em] text-bond-text">{item.label}</h3>
              <p className="mt-3 text-[14px] leading-[1.65] text-bond-muted">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-20 rounded-[28px] border border-white/[0.08] bg-white/[0.025] p-6 sm:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.15fr] lg:items-end">
            <div>
              <div className="section-kicker">Why Arc</div>
              <h2 className="mt-4 text-[32px] font-medium leading-[1.05] tracking-[-0.055em] text-bond-text sm:text-[44px]">
                Stablecoin infrastructure without web3 payment noise.
              </h2>
            </div>
            <p className="text-[15px] leading-[1.75] text-bond-muted">
              Arc gives BOND a practical settlement layer: USDC for gas, USDC for escrow, fast finality, EVM tooling, and a path to crosschain liquidity through Circle infrastructure.
            </p>
          </div>

          <div className="mt-10 grid gap-3 md:grid-cols-3">
            {ARC_FACTS.map((fact) => (
              <div key={fact.label} className="rounded-2xl border border-white/[0.08] bg-black/20 p-5">
                <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-bond-faint">{fact.label}</div>
                <div className="mt-3 text-[34px] font-medium leading-none tracking-[-0.055em] text-bond-text">{fact.value}</div>
                <div className="mt-3 text-[13px] text-bond-muted">{fact.desc}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-20 border-t border-white/[0.08] pt-14">
          <div className="section-kicker">Product stance</div>
          <div className="mt-5 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
            <h2 className="text-[30px] font-medium leading-[1.06] tracking-[-0.05em] text-bond-text sm:text-[40px]">
              Not another crypto market. A settlement workspace.
            </h2>
            <div className="space-y-5 text-[14px] leading-[1.75] text-bond-muted">
              <p>
                The UI should make risk visible: who pays, who delivers, how much is locked, when deadlines expire, and what happens if either side disappears.
              </p>
              <p>
                Agentic and CCTP features should extend the room model, not replace it. The core remains simple: lock value, verify delivery, settle safely.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
