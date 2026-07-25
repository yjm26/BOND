# BOND

BOND is an Arc-native settlement workspace for people who make deals with strangers on the internet.

It is built for the messy middle of online trade: digital goods, account transfers, private service work, NFT/allowlist spots, OTC arrangements, and small USDC deals where both sides want a cleaner option than trusting a Discord middleman.

BOND does not try to make trust disappear. It makes the deal state explicit, keeps funds in an auditable escrow contract, and gives both parties a clear path to finish, refund, or escalate when something goes wrong.

## What BOND does

- Creates private escrow rooms on Arc Testnet.
- Lets a buyer fund a room in USDC.
- Lets the seller mark delivery.
- Lets the buyer release funds or open a dispute.
- Lets a seller escalate if the buyer goes silent after delivery.
- Lets approved arbiters resolve disputes on-chain.
- Keeps marketplace listings visible for 30 days unless taken or removed.
- Shows human-readable profiles next to wallet addresses when users publish a BOND profile.

The product is intentionally quiet: clear room state, clear money movement, clear next action. No fake agent labels, no noisy crypto dashboard, no hidden signing.

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
| Contract | `0x57608180484B746F396851aE84f8f64F03Bb89dF` |

Contract source: `contract/contracts/BoundTestnet.sol`.

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
├── server.js                         # Production API + static frontend server
├── render.yaml                       # Render single-service deploy blueprint
├── frontend/                         # Vite/React app
│   ├── public/brand/                 # BOND logo assets
│   └── src/                          # Product UI, wallet, room, market code
└── contract/                         # Hardhat project
    ├── contracts/BoundTestnet.sol    # Bond escrow contract (Solidity: BoundTestnet)
    ├── scripts/deploy-bound-testnet.js
    └── test/BoundTestnet.test.js
```

Legacy prototype contracts, old deploy scripts, and old frontend-only deploy configs were intentionally removed so the repo reflects the current BOND product.

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
