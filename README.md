# BOND

Escrow rooms for USDC deals on Arc.

BOND is a settlement app for online trades between people who don't know each other: digital goods, account transfers, freelance work, NFT/allowlist spots, and small OTC swaps. Instead of trusting a Discord middleman, both sides open a room, the buyer locks USDC in an escrow contract, and the funds only move on an explicit action — release, refund, or dispute.

It doesn't remove the need for trust. It makes the state of the deal and the location of the money verifiable on-chain, and gives each side a defined next step when things stall.

## What it does

- Opens private escrow rooms on Arc Testnet.
- Buyer funds a room in USDC; funds sit in the contract until settled.
- Seller marks delivery; buyer releases or disputes.
- Seller can escalate if the buyer goes silent after delivery (12h response buffer).
- Approved arbiters resolve disputes on-chain.
- Marketplace listings stay visible for 30 days unless taken or removed.
- Optional public profiles map a display name/socials to a wallet address.

Read-only views never request a signature. Signatures are only for authenticated writes (posting a listing, room actions).

## Current network

BOND currently runs on Arc Testnet.

| Item | Value |
| --- | --- |
| Chain | Arc Testnet |
| Chain ID | `5042002` |
| Primary RPC | `https://rpc.blockdaemon.testnet.arc.network` |
| Backup RPC | `https://rpc.drpc.testnet.arc.network` |
| Explorer | `https://testnet.arcscan.app` |
| USDC token | `0x3600000000000000000000000000000000000000` |
| Contract | `0xb25433c4fA845Ff88883ea07543Fc2b561f56fbB` (Phase A: deadline from fund) |

Contract source: `contract/contracts/BOND.sol`.

**Delivery clock:** `deliveryDeadline = fundedAt + deliveryDays` (not from create).

**Smoke E2E (local keys only):**

```bash
node scripts/smoke-e2e-room.js --addresses   # print fund targets
node scripts/smoke-e2e-room.js               # create→join→fund→deliver→release (0.1 USDC)
```

Keys live in `local/smoke/` (gitignored). Never commit private keys.

**Disputed rooms:** owner/active arbiter can resolve or split. Treat those keys as high-trust ops, not pure code trust.

## Product flow

A room moves through a small set of states:

1. **Created** — a room exists, waiting for the counterparty.
2. **Joined** — both parties are in, waiting for funding.
3. **Funded** — buyer funds are locked in escrow.
4. **Delivered** — seller marks the item or work as delivered.
5. **Released / Refunded / Disputed / Cancelled** — the room closes or moves to arbiter review.

The current contract keeps the buyer response buffer internal and fixed:

```text
RESPONSE_BUFFER = 12 hours
```

That means the UI does not ask users to choose confusing deal types or arbitrary review-day presets. Buyer settlement stays simple: if the buyer confirms, the deal settles.

## Repository layout

```text
.
├── server.js              # HTTP entry: API routes + serves frontend/dist
├── server/                # Backend modules
│   ├── lib/               # auth, cors, storage, sanitize, http helpers
│   └── routes/            # listings, offers, disputes, evidence, room index
├── frontend/              # Vite + React app
│   ├── public/brand/      # Logo + OG assets
│   ├── scripts/           # generate-og.mjs (regenerate the link preview)
│   └── src/               # UI, wallet, room, and market code
├── contract/              # Hardhat project
│   ├── contracts/BOND.sol
│   ├── scripts/deploy-bound-testnet.js
│   └── test/BOND.test.js
├── scripts/               # smoke-e2e-room.js, check-smoke-balances.js
├── render.yaml            # Render single-service blueprint
└── nixpacks.toml
```

## Local development

Prerequisites:

- Node.js 20+
- npm
- A wallet that can connect to Arc Testnet
- Test USDC for Arc Testnet

Install and run the frontend/API together:

```bash
npm install
npm run render-build
PORT=4100 npm start
```

Open:

```text
http://localhost:4100
```

For frontend-only development:

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

## Contracts

Install contract dependencies:

```bash
npm install --prefix contract
```

Compile:

```bash
npm run compile --prefix contract
```

Run targeted tests:

```bash
npm run test:bound-testnet --prefix contract
```

Deploying requires a local `.env` inside `contract/` or an exported environment. Never commit private keys.

Expected environment values:

```text
PRIVATE_KEY=...
USDC_ADDRESS=0x3600000000000000000000000000000000000000
TREASURY_ADDRESS=...
ARBITER_ADDRESS=...
ARBITER_NAME=BOND Arbiter
```

Deploy:

```bash
npm run deploy:bound-testnet --prefix contract
```

## API storage

The backend stores MVP data as JSON files under:

```text
DATA_DIR
```

If `DATA_DIR` is not set, it falls back to the repo directory. For production on Render, attach a persistent disk and set:

```text
DATA_DIR=/data
```

Files:

| File | Purpose |
| --- | --- |
| `listings.json` | marketplace listings |
| `offers.json` | offers / counters |
| `notifications.json` | in-app notifications |
| `room_codes.json` | invite codes for market handoff |
| `profiles.json` | public display profiles |
| `evidence.json` | off-chain evidence by room |
| `disputes.json` | dispute desk case register |
| `room_index.json` | address → roomIds for My Rooms |

Server code is modular under `server/lib/*` and `server/routes/*`; `server.js` is the thin HTTP entry.

Without persistent storage, marketplace listings, offers, notifications, room codes, profiles, evidence, disputes, and room index can disappear when the service restarts or gets redeployed.

For a longer-lived production setup, move this storage to Postgres, Supabase, or Neon.

## Deploy on Render

Current Render app:

```text
https://bond-4us7.onrender.com/
```

This repo is designed for one Render Web Service from the repo root.

Render settings:

```text
Runtime: Node
Build Command: npm install && npm run render-build
Start Command: npm start
Health Check Path: /api/health
```

`server.js` serves both:

- `/api/*` backend routes
- `frontend/dist` static app

That keeps API calls same-origin and avoids separate CORS/deployment plumbing.

## Security notes

- Never commit `.env` files or private keys.
- Wallet signatures are only requested for actions that need wallet-authenticated writes.
- Read-only views should not request signatures.
- Changing wallets resets the current BOND session and requires a clean reconnect.
- Arbiters are owner-managed in the current testnet contract.

## Status

BOND is testnet software. It is useful for demos, product validation, and Arc-native escrow testing, but it is not a mainnet funds product yet.

## License

MIT
