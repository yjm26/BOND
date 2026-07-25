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
    <section className="min-h-screen bg-[#fafafa] px-4 pb-24 pt-[92px] text-[#0a0a0a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="border-b border-[#0a0a0a]/14 pb-8 sm:pb-10">
          <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">BOND docs</div>
          <div className="mt-5 grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
            <h1 className="max-w-[780px] text-[clamp(48px,8vw,104px)] font-medium leading-[0.86] tracking-[-0.09em]">
              The current room system, without the old ceremony.
            </h1>
            <p className="max-w-[380px] text-[15px] leading-[1.7] tracking-[-0.01em] text-[#525252] lg:justify-self-end">
              BOND changed. These docs describe the live BoundTestnet flow: no deal types, no review presets, fast buyer settlement, and a fixed arbiter fallback when someone goes silent.
            </p>
          </div>
        </header>

        <div className="sticky top-[60px] z-20 -mx-4 border-b border-[#0a0a0a]/12 bg-[#fafafa]/94 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex gap-2 overflow-x-auto">
            {SECTIONS.map((item) => <NavPill key={item.id} item={item} active={active === item.id} />)}
          </div>
        </div>

        <div className="grid gap-10 pt-8 md:grid-cols-[220px_1fr] lg:gap-14">
          <aside className="hidden md:block">
            <nav className="sticky top-[96px] border-l border-[#0a0a0a]/14 pl-4">
              <div className="mb-4 font-mono text-[10px] uppercase tracking-[0.24em] text-[#737373]">Sections</div>
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
      className={`shrink-0 border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.14em] transition ${active ? 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]' : 'border-[#0a0a0a]/14 text-[#525252] hover:border-[#0a0a0a]/38'}`}
    >
      {item.label}
    </Link>
  )
}

function SideLink({ item, active }) {
  return (
    <Link
      to={`/docs/${item.id}`}
      className={`block px-3 py-2 text-[14px] tracking-[-0.01em] transition ${active ? 'bg-[#0a0a0a] text-[#fafafa]' : 'text-[#525252] hover:bg-[#0a0a0a]/[0.04] hover:text-[#0a0a0a]'}`}
    >
      {item.label}
    </Link>
  )
}

function Section({ eyebrow, title, intro, children }) {
  return (
    <article className="animate-page-enter">
      <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#a3a3a3]">{eyebrow}</div>
      <h2 className="mt-4 max-w-[760px] text-[clamp(36px,5vw,68px)] font-medium leading-[0.92] tracking-[-0.075em]">
        {title}
      </h2>
      {intro && <p className="mt-5 max-w-[680px] text-[16px] leading-[1.72] tracking-[-0.01em] text-[#525252]">{intro}</p>}
      <div className="mt-8 space-y-8">{children}</div>
    </article>
  )
}

function H3({ children }) {
  return <h3 className="mb-3 text-[24px] font-medium leading-[1] tracking-[-0.055em] text-[#0a0a0a] sm:text-[30px]">{children}</h3>
}

function P({ children }) {
  return <p className="max-w-[700px] text-[14px] leading-[1.72] tracking-[-0.01em] text-[#525252] sm:text-[15px]">{children}</p>
}

function Code({ children }) {
  return <code className="border border-[#0a0a0a]/14 bg-[#f5f5f5] px-1.5 py-0.5 font-mono text-[12px] text-[#0a0a0a]">{children}</code>
}

function Card({ children, tone = 'paper' }) {
  const style = tone === 'dark'
    ? 'border-[#fafafa]/12 bg-[#111111] text-[#fafafa]'
    : 'border-[#0a0a0a]/14 bg-[#f5f5f5] text-[#0a0a0a]'
  return <div className={`border p-5 sm:p-6 ${style}`}>{children}</div>
}

function FactGrid({ items }) {
  return (
    <div className="grid border border-[#0a0a0a]/14 md:grid-cols-2">
      {items.map(([label, body], index) => (
        <div key={label} className={`bg-[#f5f5f5] p-5 sm:p-6 ${index > 0 ? 'border-t border-[#0a0a0a]/14 md:border-t-0' : ''} ${index % 2 ? 'md:border-l md:border-[#0a0a0a]/14' : ''} ${index > 1 ? 'md:border-t md:border-[#0a0a0a]/14' : ''}`}>
          <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#737373]">{label}</div>
          <p className="mt-4 text-[14px] leading-[1.65] tracking-[-0.01em] text-[#525252]">{body}</p>
        </div>
      ))}
    </div>
  )
}

function Table({ headers, rows }) {
  return (
    <div className="overflow-hidden border border-[#0a0a0a]/14 bg-[#f5f5f5]">
      <table className="w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-[#0a0a0a]/14 bg-[#0a0a0a]/[0.04]">
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">{header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-t border-[#0a0a0a]/10 first:border-t-0">
              {row.map((cell, cellIndex) => <td key={cellIndex} className="px-4 py-3 align-top text-[#262626]">{cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Callout({ title, children, danger = false }) {
  return (
    <div className={`border px-4 py-3 ${danger ? 'border-[#b87333]/35 bg-[#b87333]/10 text-[#44403c]' : 'border-[#a3a3a3]/30 bg-[#a3a3a3]/[0.09] text-[#404040]'}`}>
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
        <div className="grid gap-3 text-[14px] text-[#525252]">
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Contract</span><br /><Code>{CONTRACT_ADDRESS}</Code></div>
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Explorer</span><br /><a className="underline decoration-[#0a0a0a]/25 underline-offset-4 hover:decoration-[#0a0a0a]" href={`https://testnet.arcscan.app/address/${CONTRACT_ADDRESS}`} target="_blank" rel="noreferrer">ArcScan verified code</a></div>
          <div><span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">USDC</span><br /><Code>{USDC_ADDRESS}</Code></div>
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
          rows={STATES.map(([state, meaning]) => [<span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0a0a0a]">{state}</span>, meaning])}
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
    <Section
      eyebrow="FAQ"
      title="The questions people ask before they put money in a room."
      intro="Short answers for buyers, sellers, and arbiters using the current BOND testnet flow."
    >
      <div className="grid gap-3">
        <Faq q="What is a BOND room?">
          A room is a private deal workspace between two wallets. It records the buyer, seller, item, USDC price, optional seller collateral, deadlines, delivery proof, and the final settlement state.
        </Faq>
        <Faq q="Who pays into the room?">
          The buyer funds the room with the price plus the 1% platform fee. If seller collateral is used, the seller locks that collateral when their role requires it.
        </Faq>
        <Faq q="When does the seller get paid?">
          After the seller marks delivery, the buyer can release immediately. On release, the seller receives the room price and gets their collateral back.
        </Faq>
        <Faq q="What happens if the seller does not deliver?">
          If the delivery deadline passes while the room is still funded, the buyer can request a refund. The buyer receives the funded price plus seller collateral when collateral exists.
        </Faq>
        <Faq q="What if the buyer receives the work but does not respond?">
          Once delivery is marked, a fixed 12 hour response buffer starts. If the buyer does not release or dispute during that buffer, the seller can escalate the room to dispute review.
        </Faq>
        <Faq q="When should the buyer open a dispute?">
          The buyer should dispute after delivery if the delivered work does not match the deal, proof is missing, or the seller delivered something materially wrong. A reason and evidence should be attached.
        </Faq>
        <Faq q="Who can resolve a dispute?">
          Only the contract owner or an active arbiter can resolve disputed rooms. Regular users do not see arbiter tools in the app.
        </Faq>
        <Faq q="Can both sides cancel a room?">
          Yes. Joined, funded, and delivered rooms can be mutually cancelled if both participants approve. Before a counterparty joins, the creator can cancel. Before funding, the joined counterparty can leave.
        </Faq>
        <Faq q="How long do market listings stay visible?">
          Active listings expire after 30 days. Accepted or taken listings are kept as history. Listing expiry is separate from room delivery and dispute timing.
        </Faq>
        <Faq q="Why does BOND ask me to sign messages?">
          Signing proves wallet ownership for off-chain actions like profiles and listings. It is not a transaction and does not move funds. Mutating room actions still require wallet transactions.
        </Faq>
        <Faq q="Why do I have to reconnect after switching wallets?">
          A wallet change is an identity change. BOND clears the old session and sends you back to the gate so the new wallet can connect and sign cleanly.
        </Faq>
        <Faq q="Is this production mainnet escrow?">
          No. BOND is currently on Arc Testnet. Use it to test the product flow and contract behavior, not for production-value funds.
        </Faq>
      </div>
    </Section>
  )
}

function SmallFact({ label, value }) {
  return (
    <div className="border border-[#0a0a0a]/12 bg-[#fafafa] p-4">
      <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">{label}</div>
      <div className="mt-2 text-[18px] font-medium tracking-[-0.04em] text-[#0a0a0a]">{value}</div>
    </div>
  )
}

function Faq({ q, children }) {
  return (
    <details className="group border border-[#0a0a0a]/14 bg-[#f5f5f5] p-4 open:bg-[#f5f5f5]">
      <summary className="cursor-pointer list-none text-[16px] font-medium tracking-[-0.035em] text-[#0a0a0a]">
        {q}
        <span className="float-right font-mono text-[11px] text-[#737373] transition group-open:rotate-45">+</span>
      </summary>
      <div className="mt-3 text-[14px] leading-[1.7] tracking-[-0.01em] text-[#525252]">{children}</div>
    </details>
  )
}
