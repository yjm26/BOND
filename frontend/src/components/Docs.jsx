import { useParams, Link } from 'react-router-dom'

const CONTRACT_ADDRESS = '0x1A3ea0d24ff15a90417508F38ABD8E173921082A'
const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'market', label: 'Market' },
  { id: 'settlement', label: 'Settlement' },
  { id: 'disputes', label: 'Disputes' },
  { id: 'fees-timers', label: 'Fees & timers' },
  { id: 'security', label: 'Security' },
  { id: 'faq', label: 'FAQ' },
]

const STATES = [
  ['Created', 'Room exists. Waiting for the counterparty to join with the invite code.'],
  ['Joined', 'Counterparty joined. Buyer can fund the room.'],
  ['Funded', 'USDC is locked. Seller must deliver before the selected delivery deadline.'],
  ['Delivered', 'Seller marked delivery and attached proof. Buyer can release or dispute immediately.'],
  ['Released', 'Seller was paid. Room is final.'],
  ['Disputed', 'Funds are frozen for owner/arbiter review.'],
  ['Refunded', 'Buyer was refunded because seller missed delivery.'],
  ['Expired', 'Join or funding window passed before value moved.'],
  ['Cancelled', 'Room was closed by creator, counterparty leave, or mutual cancel.'],
]

const ROOM_FACTS = [
  ['People', 'Buyer, seller, creator, and counterparty are visible wallet addresses.'],
  ['Value', 'Room price and optional seller collateral are stored in exact USDC units.'],
  ['Proof', 'Delivery proof and dispute evidence stay attached to the room.'],
  ['Time', 'Join, fund, delivery, and 12h response windows are explicit.'],
  ['Exit', 'Every room resolves through release, refund, dispute, expire, or cancel.'],
  ['Limit', 'Each wallet can hold up to 3 active rooms at once.'],
]

const MARKET_FACTS = [
  ['Listing life', 'Active listings expire after 30 days. Taken listings are preserved.'],
  ['Buyer or seller', 'Either side can post intent. The room still makes the buyer/seller roles explicit.'],
  ['Offers', 'A counteroffer can become a pre-filled room when accepted.'],
  ['Profiles', 'Display name and socials are published with signed wallet auth, so other devices can read them.'],
]

export default function Docs() {
  const { section } = useParams()
  const active = section || 'overview'
  const ActiveSection = {
    overview: Overview,
    rooms: Rooms,
    market: Market,
    settlement: Settlement,
    disputes: Disputes,
    'fees-timers': FeesTimers,
    security: Security,
    faq: FAQ,
  }[active] || Overview

  return (
    <section className="min-h-screen bg-[#ede9df] px-4 pb-24 pt-[92px] text-[#171716] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="border-b border-[#171716]/14 pb-8 sm:pb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#6f6b62]">BOND docs</div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <h1 className="max-w-[780px] text-[clamp(48px,8vw,104px)] font-medium leading-[0.86] tracking-[-0.09em]">
              The current room system, without the old ceremony.
            </h1>
            <p className="max-w-[380px] text-[15px] leading-[1.7] tracking-[-0.01em] text-[#5f5a50] lg:justify-self-end">
              BOND changed. These docs describe the live BoundTestnet flow: no deal types, no review presets, fast buyer settlement, and a fixed arbiter fallback when someone goes silent.
            </p>
          </div>
        </header>

        <div className="sticky top-[60px] z-20 -mx-4 border-b border-[#171716]/12 bg-[#ede9df]/94 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {SECTIONS.map((item) => <NavPill key={item.id} item={item} active={active === item.id} />)}
          </div>
        </div>

        <div className="grid gap-10 pt-8 md:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden md:block">
            <nav className="sticky top-[96px] border-l border-[#171716]/14 pl-4">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#6f6b62]">Sections</div>
              <div className="grid gap-1">
                {SECTIONS.map((item) => <SideLink key={item.id} item={item} active={active === item.id} />)}
              </div>
            </nav>
          </aside>

          <main className="min-w-0">
            <ActiveSection />
          </main>
        </div>
      </div>
    </section>
  )
}

function NavPill({ item, active }) {
  return (
    <Link
      to={`/docs/${item.id}`}
      className={`shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${active ? 'border-[#171716] bg-[#171716] text-[#ede9df]' : 'border-[#171716]/14 text-[#5f5a50] hover:border-[#171716]/38'}`}
    >
      {item.label}
    </Link>
  )
}

function SideLink({ item, active }) {
  return (
    <Link
      to={`/docs/${item.id}`}
      className={`block px-3 py-2 text-[14px] tracking-[-0.01em] transition ${active ? 'bg-[#171716] text-[#ede9df]' : 'text-[#5f5a50] hover:bg-[#171716]/[0.04] hover:text-[#171716]'}`}
    >
      {item.label}
    </Link>
  )
}

function Section({ eyebrow, title, intro, children }) {
  return (
    <article className="animate-page-enter">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#d8b15f]">{eyebrow}</div>
      <h2 className="mt-4 max-w-[760px] text-[clamp(36px,5vw,68px)] font-medium leading-[0.92] tracking-[-0.075em]">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-[680px] text-[16px] leading-[1.72] tracking-[-0.01em] text-[#5f5a50]">{intro}</p>}
      <div className="mt-8 space-y-8">{children}</div>
    </article>
  )
}

function H3({ children }) {
  return <h3 className="mb-3 text-[24px] font-medium leading-[1] tracking-[-0.055em] text-[#171716] sm:text-[30px]">{children}</h3>
}

function P({ children }) {
  return <p className="max-w-[700px] text-[14px] leading-[1.72] tracking-[-0.01em] text-[#5f5a50] sm:text-[15px]">{children}</p>
}

function Code({ children }) {
  return <code className="border border-[#171716]/14 bg-[#f4f0e7] px-1.5 py-0.5 font-mono text-[12px] text-[#171716]">{children}</code>
}

function Card({ children, tone = 'paper' }) {
  const style = tone === 'dark'
    ? 'border-[#ede9df]/12 bg-[#20201f] text-[#ede9df]'
    : 'border-[#171716]/14 bg-[#f4f0e7] text-[#171716]'
  return <div className={`border p-5 sm:p-6 ${style}`}>{children}</div>
}

function FactGrid({ items }) {
  return (
    <div className="grid border border-[#171716]/14 md:grid-cols-2">
      {items.map(([label, body], index) => (
        <div key={label} className={`bg-[#f4f0e7] p-5 sm:p-6 ${index > 0 ? 'border-t border-[#171716]/14 md:border-t-0' : ''} ${index % 2 ? 'md:border-l md:border-[#171716]/14' : ''} ${index > 1 ? 'md:border-t md:border-[#171716]/14' : ''}`}>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">{label}</div>
          <p className="mt-4 text-[14px] leading-[1.65] tracking-[-0.01em] text-[#4f4a42]">{body}</p>
        </div>
      ))}
    </div>
  )
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-hidden border border-[#171716]/14 bg-[#f4f0e7]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#171716]/14 bg-[#171716]/[0.04]">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6b62]">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[#171716]/10 first:border-t-0">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top text-[#312f2a]">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Callout({ title, children, danger = false }) {
  return (
    <div className={`border px-4 py-3 ${danger ? 'border-[#c98b4a]/35 bg-[#c98b4a]/10 text-[#6b3f17]' : 'border-[#d8b15f]/30 bg-[#d8b15f]/[0.09] text-[#5e4b21]'}`}>
      <div className="font-mono text-[10px] uppercase tracking-[0.2em]">{title}</div>
      <div className="mt-2 text-[13px] leading-[1.65] tracking-[-0.01em]">{children}</div>
    </div>
  )
}

function Overview() {
  return (
    <Section
      eyebrow="Overview"
      title="BOND is a room for money, proof, and the awkward middle of a deal."
      intro="It is not a marketplace template with crypto words on top. A BOND room exists so two wallets can agree on one thing, lock USDC on Arc, and resolve the outcome without relying on a private chat as the source of truth."
    >
      <FactGrid items={[
        ['Network', 'Arc Testnet. Native gas accounting uses USDC, and the escrow token interface is the Arc USDC address.'],
        ['Contract', 'BoundTestnet is verified and currently wired into the app.'],
        ['Roles', 'Buyer funds. Seller delivers. Owner/active arbiter handles disputes only when needed.'],
        ['Session', 'Changing wallets clears the app session and forces a clean connect/sign again.'],
      ]} />

      <Card>
        <H3>Live deployment</H3>
        <div className="grid gap-3 text-[14px] text-[#4f4a42]">
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6b62]">Contract</span><br /><Code>{CONTRACT_ADDRESS}</Code></div>
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6b62]">Explorer</span><br /><a className="underline decoration-[#171716]/25 underline-offset-4 hover:decoration-[#171716]" href={`https://testnet.arcscan.app/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">ArcScan verified code</a></div>
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6b62]">USDC</span><br /><Code>{USDC_ADDRESS}</Code></div>
        </div>
      </Card>

      <Callout title="Testnet only" danger>
        BOND is live on Arc Testnet. Do not treat it as a mainnet product or move production-value funds through it.
      </Callout>
    </Section>
  )
}

function Rooms() {
  return (
    <Section
      eyebrow="Rooms"
      title="A room makes the deal concrete before value moves."
      intro="The current product has no user-facing deal type, no review-day presets, and no fake complexity. The room stores who is involved, what is being delivered, the USDC amount, optional collateral, delivery proof, and the fallback path."
    >
      <FactGrid items={ROOM_FACTS} />

      <Card>
        <H3>Room lifecycle</H3>
        <Table
          headers={['State', 'Meaning']}
          rows={STATES.map(([state, meaning]) => [<span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#171716]">{state}</span>, meaning])}
        />
      </Card>

      <Card>
        <H3>Creating a room</H3>
        <P>The creator writes the item, price, optional collateral, role direction, join code hash, and delivery window. Delivery can be 1–90 days. The app hides unnecessary contract knobs from users.</P>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SmallFact label="Join window" value="1 day" />
          <SmallFact label="Fund window" value="30 minutes after join" />
          <SmallFact label="Delivery window" value="1–90 days" />
          <SmallFact label="Active rooms" value="max 3 per wallet" />
        </div>
      </Card>
    </Section>
  )
}

function Market() {
  return (
    <Section
      eyebrow="Market"
      title="Listings are invitations into rooms, not a separate escrow system."
      intro="The market helps buyers and sellers find each other. Once a listing becomes a deal, the important part moves into a BOND room with explicit roles and settlement states."
    >
      <FactGrid items={MARKET_FACTS} />

      <Card>
        <H3>Persistence note</H3>
        <P>Active listings now get an expiry timestamp and default to 30 days. That does not replace real production storage. On Render, the service should use a persistent disk with <Code>DATA_DIR=/data</Code> or move to a database before mainnet-grade use.</P>
      </Card>

      <Card>
        <H3>What a listing should include</H3>
        <P>Title, price, delivery days, listing side, and enough contact/profile context for the other person to decide whether to open a room. Keep it concrete. Do not rely on vague trust badges.</P>
      </Card>
    </Section>
  )
}

function Settlement() {
  return (
    <Section
      eyebrow="Settlement"
      title="After delivery, the buyer can settle immediately."
      intro="This is the major product change. BOND no longer asks users to choose Instant/Event/Service or review windows. The seller delivers, then the buyer releases or disputes. If the buyer disappears, the seller waits through the fixed 12h buffer and escalates."
    >
      <Table
        headers={['Moment', 'Who acts', 'Result']}
        rows={[
          ['Seller delivers', 'Seller', 'Room moves to Delivered and the 12h response buffer starts.'],
          ['Everything is correct', 'Buyer', 'Buyer calls release. Seller receives price plus seller collateral back.'],
          ['Something is wrong', 'Buyer', 'Buyer opens a dispute and submits a reason/evidence. Funds freeze.'],
          ['Buyer is silent', 'Seller', 'After 12h, seller can escalate no-response to dispute review.'],
          ['Seller misses delivery', 'Buyer', 'After the delivery deadline, buyer can refund price plus seller collateral.'],
        ]}
      />

      <Callout title="No review presets">
        The contract uses <Code>RESPONSE_BUFFER = 12 hours</Code>. It is not a listing expiry and not a user-selected review timer.
      </Callout>

      <Card>
        <H3>Mutual cancel</H3>
        <P>Joined, Funded, and Delivered rooms can be mutually cancelled. Either participant requests, the other approves, then anyone executes. The buyer gets funded amount plus platform fee back; the seller gets collateral back.</P>
      </Card>
    </Section>
  )
}

function Disputes() {
  return (
    <Section
      eyebrow="Disputes"
      title="Disputes are gated, boring, and intentionally narrow."
      intro="Regular users should not see arbiter workspaces. The app reads owner and active arbiter status from the contract and hides Disputes/Admin UI unless the wallet has access."
    >
      <Table
        headers={['Path', 'Who can start', 'What happens']}
        rows={[
          ['Buyer dispute', 'Buyer after delivery', 'Room freezes. Buyer submits reason and first evidence.'],
          ['Seller escalation', 'Seller after 12h silence', 'Room freezes for arbiter review because buyer did not release or dispute.'],
          ['Evidence', 'Buyer or seller', 'Up to 20 evidence items can be attached to a disputed room.'],
          ['Resolution', 'Owner or active arbiter', 'Resolve to buyer, resolve to seller, or split.'],
        ]}
      />

      <Card>
        <H3>Arbiter management</H3>
        <P>The owner can add and remove arbiters. The app treats arbiter access fail-closed: if the contract read fails, admin panels stay hidden.</P>
      </Card>

      <Callout title="Arbiter fee" danger>
        Dispute resolution uses a 5% arbiter fee on the resolved total. Normal buyer release does not use this fee.
      </Callout>
    </Section>
  )
}

function FeesTimers() {
  return (
    <Section
      eyebrow="Fees & timers"
      title="Charge once at funding. Keep the timing obvious."
      intro="BOND should not surprise users about money or time. The buyer sees the funded total. The seller sees what they receive. Timing is contract-enforced."
    >
      <Table
        headers={['Item', 'Value']}
        rows={[
          ['Platform fee', '1% of room price, paid by buyer on funding.'],
          ['Seller payout on buyer release', 'Full room price plus seller collateral returned.'],
          ['Mutual cancel', 'Buyer receives funded amount plus platform fee back; seller receives collateral back.'],
          ['Arbiter fee', '5% of total only when owner/arbiter resolves a dispute.'],
          ['Join deadline', '1 day after room creation.'],
          ['Funding deadline', '30 minutes after counterparty joins.'],
          ['Delivery deadline', '1–90 days from room creation, selected when creating room.'],
          ['Buyer response buffer', 'Fixed 12 hours after delivery, only for seller escalation.'],
          ['Market listing expiry', '30 days for active listings. Separate from escrow timers.'],
        ]}
      />
    </Section>
  )
}

function Security() {
  return (
    <Section
      eyebrow="Security"
      title="BOND reduces trust. It does not remove judgment."
      intro="The contract protects the payment path. It cannot prove whether a design was good, whether an account is valuable, or whether screenshots tell the full story. Those are product and arbiter judgment problems."
    >
      <FactGrid items={[
        ['Wallet auth', 'Profiles and listings use signed wallet auth. Raw signatures and secrets should not be logged.'],
        ['Wallet switch', 'Changing wallet inside the app clears session state and forces connect/sign again.'],
        ['No private keys', 'BOND never needs a private key or seed phrase from a user.'],
        ['Bounded admin', 'Owner/arbiter cannot send funds to arbitrary third parties; resolution paths are predefined.'],
        ['Exact units', 'USDC amounts use 6-decimal token units. Token math must not use floats.'],
        ['Verified deployment', 'BoundTestnet source is verified on ArcScan for the current testnet address.'],
      ]} />

      <Callout title="Operational risk" danger>
        File-based listing storage is acceptable for testnet only if Render persistence is configured. A production version should use durable storage and a clearer incident path.
      </Callout>
    </Section>
  )
}

function FAQ() {
  return (
    <Section eyebrow="FAQ" title="Small answers for the current build.">
      <div className="grid gap-3">
        <Faq q="Why did the old docs mention deal types?">
          They were stale. The current app does not expose Instant/Event/Service or review-day choices.
        </Faq>
        <Faq q="Can the buyer release right after delivery?">
          Yes. Buyer release is immediate once the room is Delivered.
        </Faq>
        <Faq q="What if the buyer does nothing after delivery?">
          The seller can escalate after the fixed 12 hour response buffer. That creates a disputed room for owner/arbiter review.
        </Faq>
        <Faq q="Why do profiles show across devices now?">
          Profile saves publish a public profile to the backend with signed wallet auth. Room party labels can fetch that profile by address.
        </Faq>
        <Faq q="Why do I get kicked to the gate after switching wallets?">
          That is intentional. A wallet change is an identity change, so BOND clears the app session and requires a clean connect/sign again.
        </Faq>
        <Faq q="Is BOND mainnet safe?">
          No. This is Arc Testnet. Treat it as a product and contract test environment.
        </Faq>
      </div>
    </Section>
  )
}

function SmallFact({ label, value }) {
  return (
    <div className="border border-[#171716]/12 bg-[#ede9df] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#6f6b62]">{label}</div>
      <div className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-[#171716]">{value}</div>
    </div>
  )
}

function Faq({ q, children }) {
  return (
    <details className="group border border-[#171716]/14 bg-[#f4f0e7] p-4 open:bg-[#f1ecdf]">
      <summary className="cursor-pointer list-none text-[16px] font-medium tracking-[-0.035em] text-[#171716]">
        {q}
        <span className="float-right font-mono text-[11px] text-[#6f6b62] transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-[14px] leading-[1.7] tracking-[-0.01em] text-[#5f5a50]">{children}</div>
    </details>
  )
}
