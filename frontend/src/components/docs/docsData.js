export const CONTRACT_ADDRESS = '0x1A3ea0d24ff15a90417508F38ABD8E173921082A'
export const USDC_ADDRESS = '0x3600000000000000000000000000000000000000'
export const CHAIN_ID = 5042002
export const EXPLORER_URL = `https://testnet.arcscan.app/address/${CONTRACT_ADDRESS}`

export const DOC_SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'market', label: 'Market' },
  { id: 'settlement', label: 'Settlement' },
  { id: 'disputes', label: 'Disputes' },
  { id: 'fees-timers', label: 'Fees & timers' },
  { id: 'security', label: 'Security' },
  { id: 'faq', label: 'FAQ' },
]

/** On-chain room states (BoundTestnet). */
export const ROOM_STATES = [
  ['Created', 'Room exists with terms and join-code hash. Waiting for the counterparty.'],
  ['Joined', 'Both parties are set. Buyer can fund within 30 minutes.'],
  ['Funded', 'Price + 1% fee locked. Seller must deliver by the delivery deadline.'],
  ['Delivered', 'Seller marked delivery. Buyer can release or dispute. 12h buffer starts for seller escalate.'],
  ['Released', 'Seller paid. Room terminal.'],
  ['Disputed', 'Funds frozen for owner/active arbiter.'],
  ['Refunded', 'Buyer refunded after missed delivery (or related refund path).'],
  ['Expired', 'Join or fund window passed without completing that step.'],
  ['Cancelled', 'Creator cancel, leave before fund, or mutual cancel.'],
]

export const ROOM_FACTS = [
  ['Parties', 'Buyer, seller, and creator are wallet addresses stored on-chain.'],
  ['Amounts', 'Price and optional seller collateral use USDC 6-decimal units.'],
  ['Join code', 'Plain code is off-chain. The contract stores keccak256(code).'],
  ['Proof', 'Delivery proof hash and dispute fields attach to the room.'],
  ['Timers', 'Join 1 day · fund 30 min · delivery 1–90 days · response buffer 12h.'],
  ['Cap', 'Max 3 non-terminal rooms per wallet (MAX_ACTIVE).'],
]

export const MARKET_FACTS = [
  ['Role', 'Market is off-chain discovery. Escrow only starts when a room is created.'],
  ['Listings', 'Active listings expire after 30 days. Taken listings keep history.'],
  ['Offers', 'Accepting an offer can pre-fill create-room fields; money still moves on-chain.'],
  ['Auth', 'Writes (list, offer, profile) require a signed wallet message to the API.'],
]

export const FEE_ROWS = [
  ['Platform fee', '1% of price (FUND_TAX_BPS = 100). Buyer pays price + fee on fundRoom.'],
  ['Buyer release', 'Seller receives price; seller collateral returned; fee to treasury.'],
  ['Mutual cancel', 'Buyer gets funded amount + fee back; seller gets collateral back; no treasury take.'],
  ['Arbiter fee', '5% of (funded + collateral) only when owner/arbiter resolves a dispute.'],
  ['Join deadline', '1 day after create (JOIN_DL).'],
  ['Fund deadline', '30 minutes after join (FUND_DL).'],
  ['Delivery window', '1–90 days, set at create; becomes deliveryDeadline.'],
  ['Response buffer', '12 hours after markDelivered (RESPONSE_BUFFER). Seller escalate only after this.'],
  ['Listing expiry', '30 days for active market listings (API). Separate from escrow timers.'],
]

export const SETTLEMENT_ROWS = [
  ['Seller marks delivered', 'Seller', 'State → Delivered. confirmDeadline = now + 12h.'],
  ['Buyer releases', 'Buyer', 'Seller paid price; collateral returned; platform fee to treasury.'],
  ['Buyer disputes', 'Buyer', 'State → Disputed. Reason/evidence on-chain + optional API case notes.'],
  ['Seller escalates', 'Seller', 'Only after 12h with no release/dispute. State → Disputed.'],
  ['Buyer refunds', 'Buyer', 'If still Funded after deliveryDeadline: refund path (price + collateral rules).'],
  ['Mutual cancel', 'Both', 'Either requests, other approves, then execute. Fee returned to buyer.'],
]

export const DISPUTE_ROWS = [
  ['Buyer dispute', 'Buyer after Delivered', 'Room freezes. Reason required; evidence optional.'],
  ['Seller escalate', 'Seller after 12h silence', 'Room freezes because buyer neither released nor disputed.'],
  ['Evidence', 'Buyer or seller', 'Contract bounds evidence strings; API can store extra case notes.'],
  ['Resolve / split', 'Owner or active arbiter', 'Pay buyer, pay seller, or split. 5% arbiter fee on total.'],
]

export const SECURITY_FACTS = [
  ['Money path', 'USDC moves only via BoundTestnet functions. Market API cannot transfer funds.'],
  ['Keys', 'App never asks for a private key or seed. SIWE is for API writes only.'],
  ['SIWE scope', 'Listings, offers, profiles, room-index, evidence notes — not room fund/release.'],
  ['Arbiter power', 'Owner/active arbiter resolve disputed rooms only. Paths are fixed (buyer/seller/split).'],
  ['USDC decimals', '6 decimals on Arc Testnet precompile. Do not use float math.'],
  ['Testnet', 'Arc Testnet chainId 5042002. Not mainnet. No production-value funds.'],
]

export const FAQ_ITEMS = [
  {
    q: 'What is a room?',
    a: 'An on-chain escrow deal between two wallets: item, price, optional collateral, deadlines, parties, and settlement state.',
  },
  {
    q: 'Who locks USDC?',
    a: 'Buyer funds price + 1% on fundRoom. If collateral is set and the creator is seller, seller locks collateral at create; if creator is buyer, seller locks collateral at join.',
  },
  {
    q: 'When is the seller paid?',
    a: 'When the buyer calls release after Delivered (or when an arbiter resolves to the seller after Disputed).',
  },
  {
    q: 'What if the seller never delivers?',
    a: 'If the room is still Funded after deliveryDeadline, the buyer can refund under contract rules.',
  },
  {
    q: 'What if the buyer goes silent after delivery?',
    a: 'After markDelivered, a 12h RESPONSE_BUFFER runs. Then the seller can escalate to Disputed for arbiter review.',
  },
  {
    q: 'Is the market escrow?',
    a: 'No. Listings and offers are off-chain. Escrow starts only when createRoom succeeds on-chain.',
  },
  {
    q: 'Why sign a message?',
    a: 'API writes need proof of wallet ownership. Signing does not move USDC. Room money actions are separate transactions.',
  },
  {
    q: 'How many open rooms can I have?',
    a: 'At most 3 non-terminal rooms per wallet (Created through Disputed count; Released/Refunded/Expired/Cancelled do not).',
  },
  {
    q: 'Is this mainnet?',
    a: 'No. BoundTestnet on Arc Testnet only. Treat funds as test value.',
  },
]
