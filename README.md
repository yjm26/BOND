# BOND

Escrow rooms for USDC deals on Arc.

Two strangers agree on a trade. The buyer locks USDC in a contract, the seller delivers, then the buyer releases the funds or opens a dispute. Nobody hands money to a middleman, and the state of the deal is on-chain instead of in a Discord thread.

Live at [usebond.xyz](https://usebond.xyz). Arc Testnet only.

## How a room works

```
Created → Joined → Funded → Delivered → Released
                                     ↘ Disputed → arbiter resolves or splits
```

- The buyer's USDC sits in the contract from **Funded** until the room closes.
- Money only moves on an explicit action: release, refund, mutual cancel, or an arbiter decision.
- Delivery deadline counts from **funding**, not from room creation.
- If the buyer goes quiet for 12 hours after delivery, the seller can escalate to an arbiter.

Nothing here removes the need to pick a decent counterparty. What it removes is having to trust them with the money while the deal is in flight.

## Contract

| | |
| --- | --- |
| Address | [`0xb25433c4fA845Ff88883ea07543Fc2b561f56fbB`](https://testnet.arcscan.app/address/0xb25433c4fA845Ff88883ea07543Fc2b561f56fbB) |
| Chain | Arc Testnet (`5042002`) |
| USDC | `0x3600000000000000000000000000000000000000` |
| Source | [`contract/contracts/BOND.sol`](contract/contracts/BOND.sol) |

Fees: 1% funding fee to the treasury, 5% arbiter fee on disputed rooms only.

**Access control**

- `owner` can set the treasury and add/remove arbiters. It **cannot** resolve disputes or move room funds.
- Only an active arbiter can resolve or split a disputed room.
- The arbiter address is deliberately separate from the treasury, so the address that earns fees isn't the one judging disputes.
- Ownership transfer is two-step (`transferOwnership` → `acceptOwnership`), so a typo can't brick the contract.

Arbiters are still trusted humans. On a disputed room they decide where the money goes — that's an operational trust assumption, not something the code removes.

## Stack

```
server.js       HTTP entry: /api/* routes + serves frontend/dist
server/         auth, cors, storage, sanitize + route modules
frontend/       Vite + React app (wallet, rooms, market, docs)
contract/       Hardhat project: BOND.sol, tests, deploy + verify scripts
scripts/        smoke-e2e-room.js, check-smoke-balances.js
```

On-chain holds the money and the room state. The API holds everything that isn't money: listings, offers, profiles, notifications, evidence, and the address → room index.

## Running it

```bash
npm install
npm run render-build
PORT=4100 npm start          # http://localhost:4100
```

Frontend only:

```bash
npm install --prefix frontend
npm run dev --prefix frontend
```

Contract:

```bash
npm install --prefix contract
npm run compile --prefix contract
npm test --prefix contract   # 21 tests
```

Deploy and verify read `local/deploy/deploy.env` (gitignored — `PRIVATE_KEY`, `TREASURY_ADDRESS`, `ARBITER_ADDRESS`, `ARBITER_NAME`):

```bash
npm run deploy --prefix contract
npm run verify --prefix contract
```

End-to-end against a real deployment, using throwaway keys in `local/smoke/`:

```bash
node scripts/smoke-e2e-room.js --addresses   # print wallets to fund
node scripts/smoke-e2e-room.js               # create → join → fund → deliver → release
```

## Storage

The API writes JSON files to `DATA_DIR` (`listings.json`, `offers.json`, `profiles.json`, `disputes.json`, `evidence.json`, `notifications.json`, `room_codes.json`, `room_index.json`).

On Render, attach a persistent disk and set `DATA_DIR=/data`. Without one, listings and profiles disappear on restart. Escrow rooms survive regardless — those live on-chain.

For anything longer-lived, move this to Postgres.

## Deploy

One Render Web Service from the repo root:

```
Build:  npm install && npm run render-build
Start:  npm start
Health: /api/health
```

`server.js` serves the API and the built frontend together, which keeps requests same-origin and avoids separate CORS setup.

## Status

Testnet software. The money paths have tests and a smoke run, but this hasn't been audited and it isn't a mainnet product yet.

Never commit `.env` files or private keys. Read-only views never ask for a signature; signatures are only for authenticated writes.

## License

MIT
