# Arc Escrow Agent

Trustless USDC escrow on Arc Network — automate Discord middleman services with smart contracts.

## Why?

Discord middleman services exist everywhere: gaming, crypto P2P, digital goods. But they rely on **trusting a human** who takes 5-10% fees and can scam you.

This replaces that with a **$0.01 smart contract** that can't scam anyone.

## How It Works

```
Client → create deal + deposit USDC to contract
                ↓
Freelancer → does the work
                ↓
Client → approve → USDC releases to freelancer
                ↓
(or) Client → refund → USDC returns to client
```

No middleman. No trust needed.

## Stack

- **Solidity** — Escrow smart contract
- **Arc Testnet** — EVM L1, USDC native gas ($0.01/tx)
- **ethers.js** — Frontend wallet integration
- **HTML/JS** — Simple UI (no framework needed)

## Quick Start

### Prerequisites

- Node.js v22+
- MetaMask or compatible wallet
- Testnet USDC from [Circle Faucet](https://faucet.circle.com)

### Setup

```bash
# Install dependencies
npm install

# Copy env file
cp .env.example .env
# Edit .env — add your PRIVATE_KEY

# Compile contracts
npx hardhat compile

# Deploy to Arc Testnet
npx hardhat run scripts/deploy.js --network arcTestnet
```

### Update Frontend

After deploying, update `ESCROW_ADDRESS` in `frontend/index.html` with your deployed contract address.

### Test

```bash
# Run local tests
npx hardhat test
```

## Deploy on Render

This repo is configured for a **single Render Web Service**:

- `server.js` serves the API under `/api/*`.
- The same server serves the built Vite frontend from `frontend/dist`.
- Frontend API calls default to same-origin, so no separate backend URL is needed.

### Render settings

You can use the included `render.yaml` blueprint, or create a Web Service manually:

```text
Runtime: Node
Build Command: npm install && npm run render-build
Start Command: npm start
Health Check Path: /api/health
```

Local production check:

```bash
npm install
npm run render-build
PORT=4100 npm start
curl http://localhost:4100/api/health
```

Then open `http://localhost:4100`.

If Render shows `Frontend build not found. Run npm run render-build first.`, the backend started but `frontend/dist` was not created during the build step. Check that the Render service uses the repo root and this build command:

```text
npm install && npm run render-build
```

`npm run build` is also aliased to the same command for Render setups that expect a standard build script.

### Backend placement

For the current MVP, the cleanest deployment is **one Render Web Service** from the repo root. Keep `server.js` as the production backend and let it serve both API and frontend. This avoids CORS and `VITE_API_URL` setup.

The old `backend/` folder is legacy/simple backend code. Prefer the root `server.js` because it has wallet-signature auth, sanitization, and the current API routes used by the frontend.

## Contract

### Flow

1. **Create Deal** — Client calls `createDeal(freelancer, amount, description)`
2. **Fund Deal** — Client approves USDC spend, then calls `fundDeal(dealId)`
3. **Approve** — Client calls `approveDeal(dealId)` → USDC releases to freelancer
4. **Refund** — Client calls `refundDeal(dealId)` → USDC returns (before approval)

### Events

All state changes emit events for easy indexing:
- `DealCreated` — new escrow created
- `DealFunded` — USDC deposited
- `DealCompleted` — USDC released to freelancer
- `DealRefunded` — USDC returned to client

## Network

| Property | Value |
|----------|-------|
| Network | Arc Testnet |
| Chain ID | 9001 |
| RPC | https://rpc.testnet.arc.network |
| Explorer | https://testnet.arcscan.app |
| Faucet | https://faucet.circle.com |

## License

MIT
