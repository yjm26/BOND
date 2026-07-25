import {
  CONTRACT_ADDRESS,
  USDC_ADDRESS,
  EXPLORER_URL,
  CHAIN_ID,
  ROOM_STATES,
  ROOM_FACTS,
  MARKET_FACTS,
  FEE_ROWS,
  SETTLEMENT_ROWS,
  DISPUTE_ROWS,
  SECURITY_FACTS,
  FAQ_ITEMS,
} from './docsData'
import { Section, H3, P, Code, Card, FactGrid, Table, Callout, SmallFact, Faq } from './DocsUi'

export function OverviewSection() {
  return (
    <Section
      eyebrow="Overview"
      title="How BOND works on Arc Testnet."
      intro="BOND locks USDC in a room between two wallets, tracks state on-chain, and settles by release, refund, cancel, or dispute. Market and profiles are off-chain helpers; they do not hold funds."
    >
      <FactGrid
        items={[
          ['Network', `Arc Testnet · chainId ${CHAIN_ID}. Gas accounting is USDC-native; escrow token is the Arc USDC precompile.`],
          ['Contract', 'Bond escrow — create, join, fund, deliver, release, refund, dispute, arbiter resolve.'],
          ['Roles', 'Buyer funds. Seller delivers. Owner or active arbiter only on Disputed rooms.'],
          ['Two layers', 'On-chain = money + state. API = listings, offers, profiles, room codes, case notes.'],
        ]}
      />

      <Card>
        <H3>Live deployment</H3>
        <div className="grid gap-3 text-[14px] text-[#525252]">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Contract</span>
            <br />
            <Code>{CONTRACT_ADDRESS}</Code>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">Explorer</span>
            <br />
            <a
              className="underline decoration-[#0a0a0a]/25 underline-offset-4 hover:decoration-[#0a0a0a]"
              href={EXPLORER_URL}
              target="_blank"
              rel="noreferrer"
            >
              ArcScan
            </a>
          </div>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[#737373]">USDC</span>
            <br />
            <Code>{USDC_ADDRESS}</Code>
            <span className="ml-2 text-[13px] text-[#737373]">6 decimals</span>
          </div>
        </div>
      </Card>

      <Callout title="Testnet" danger>
        Bond is on Arc Testnet only. Do not send production-value funds.
      </Callout>
    </Section>
  )
}

export function RoomsSection() {
  return (
    <Section
      eyebrow="Rooms"
      title="A room is the escrow unit."
      intro="Create sets terms and a join-code hash. Join binds the counterparty. Fund locks USDC. Delivery, release, refund, dispute, expire, and cancel are the rest of the path."
    >
      <FactGrid items={ROOM_FACTS} />

      <Card>
        <H3>States</H3>
        <Table
          headers={['State', 'Meaning']}
          rows={ROOM_STATES.map(([state, meaning]) => [
            <span key={state} className="font-mono text-[11px] uppercase tracking-[0.14em] text-[#0a0a0a]">
              {state}
            </span>,
            meaning,
          ])}
        />
      </Card>

      <Card>
        <H3>Create parameters</H3>
        <P>
          Creator sets item description, price, optional collateral, whether they are seller or buyer, delivery days
          (1–90), and a join code. The contract stores the hash of the code, not the plain text.
        </P>
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          <SmallFact label="Join window" value="1 day" />
          <SmallFact label="Fund window" value="30 min after join" />
          <SmallFact label="Delivery window" value="1–90 days" />
          <SmallFact label="Active rooms" value="max 3 / wallet" />
        </div>
      </Card>

      <Card>
        <H3>Who locks collateral</H3>
        <P>
          If the creator is the seller and collateral &gt; 0, collateral is locked at create. If the creator is the
          buyer, the joining seller locks collateral at join. Collateral can be zero.
        </P>
      </Card>
    </Section>
  )
}

export function MarketSection() {
  return (
    <Section
      eyebrow="Market"
      title="Market finds counterparties. Rooms hold money."
      intro="Listings and offers live in the API. When both sides agree, someone creates a Bond room. Until fundRoom succeeds, no escrow USDC is locked."
    >
      <FactGrid items={MARKET_FACTS} />

      <Card>
        <H3>Typical path</H3>
        <P>
          Post or browse a listing → offer / counter / accept → open create room with prefilled terms → on-chain
          createRoom → optional room-code share for the counterparty → join → fund.
        </P>
      </Card>

      <Card>
        <H3>Storage</H3>
        <P>
          Testnet API stores JSON under <Code>DATA_DIR</Code>. On Render, use a persistent disk (
          <Code>DATA_DIR=/data</Code>) or data will reset on redeploy. Production should use a database.
        </P>
      </Card>
    </Section>
  )
}

export function SettlementSection() {
  return (
    <Section
      eyebrow="Settlement"
      title="Who acts after money is locked."
      intro="After Funded, the seller delivers. After Delivered, the buyer releases or disputes. Silence after delivery is handled by a fixed 12h buffer, then seller escalate."
    >
      <Table headers={['Step', 'Who', 'Result']} rows={SETTLEMENT_ROWS} />

      <Callout title="RESPONSE_BUFFER">
        Fixed <Code>12 hours</Code> after <Code>markDelivered</Code>. Used only for seller escalate. Not a market listing
        timer and not a selectable “review days” preset.
      </Callout>

      <Card>
        <H3>Mutual cancel</H3>
        <P>
          Available in Joined, Funded, and Delivered. One side requests, the other approves, then either executes.
          Buyer receives funded amount + platform fee back; seller receives collateral.
        </P>
      </Card>
    </Section>
  )
}

export function DisputesSection() {
  return (
    <Section
      eyebrow="Disputes"
      title="Dispute freezes funds for arbiter paths."
      intro="Disputes desk UI is for owner and active arbiters only. The app reads those roles from the contract over public RPC."
    >
      <Table headers={['Path', 'Who', 'What happens']} rows={DISPUTE_ROWS} />

      <Card>
        <H3>Arbiter tools</H3>
        <P>
          Owner can add/remove arbiters. Resolve pays buyer or seller; split divides funded + collateral after the 5%
          arbiter fee. Fail-closed: if role reads fail, admin UI stays hidden.
        </P>
      </Card>

      <Callout title="Arbiter fee" danger>
        5% of (fundedAmount + collateral) on resolve/split only. Normal buyer release does not charge this fee.
      </Callout>
    </Section>
  )
}

export function FeesTimersSection() {
  return (
    <Section
      eyebrow="Fees & timers"
      title="Fees and clocks as enforced by the contract."
      intro="Buyer sees total to fund (price + 1%) before fundRoom. Timers are block timestamps, not UI-only countdowns."
    >
      <Table headers={['Item', 'Rule']} rows={FEE_ROWS} />
    </Section>
  )
}

export function SecuritySection() {
  return (
    <Section
      eyebrow="Security"
      title="What the system does and does not guarantee."
      intro="The contract enforces who can move locked USDC and when. It does not judge whether delivery quality is good. That is buyer release, dispute evidence, and arbiter judgment."
    >
      <FactGrid items={SECURITY_FACTS} />

      <Callout title="Ops" danger>
        JSON file storage is fine for testnet with a persistent disk. Concurrent writes and multi-instance deploys need a
        real database before any mainnet claim.
      </Callout>
    </Section>
  )
}

export function FaqSection() {
  return (
    <Section
      eyebrow="FAQ"
      title="Common questions."
      intro="Short answers tied to Bond behavior on Arc Testnet."
    >
      <div className="grid gap-3">
        {FAQ_ITEMS.map((item) => (
          <Faq key={item.q} q={item.q}>
            {item.a}
          </Faq>
        ))}
      </div>
    </Section>
  )
}
