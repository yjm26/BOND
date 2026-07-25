# BOND Modular Foundation + Dispute Desk — Design

**Date:** 2026-07-25  
**Status:** approved for implementation (user: plan Superpowers + Emil, execute inline, no subagents)  
**Repo:** `yjm26/BOND` @ `C:\Users\rival\src\BOND`

## Goal

Ship four modular workstreams that unlock safe product growth without big-bang rewrite:

1. **P0 API correctness** — evidence + disputes routes exist; listing `taken` auth matches market room-open flow  
2. **RoomView modularization** — fat orchestrator → hooks + presentational panels  
3. **Room index** — My Rooms no longer O(n) full `rooms(i)` scan  
4. **Dispute Desk** — real evidence/dispute queue + delivery proof hash (not `ZeroHash`) with Emil craft + DESIGN.md mono

## Non-goals (YAGNI)

- Mainnet deploy / contract rewrite  
- Postgres migration (keep JSON files under `DATA_DIR`, modular writers)  
- Subgraph / The Graph  
- Multi-arbiter voting, bonds, appeals  
- Changing on-chain fee constants or state machine

## Architecture principles

- **Money truth stays on-chain.** API never moves USDC.  
- **Modules over god-files.** New server code in `server/` packages; RoomView logic in hooks.  
- **Same-origin API** remains (`server.js` entry serves `/api` + static).  
- **DESIGN.md stark mono** for all new UI. Emil: ease-out, ≤300ms, no scale(0), press feedback, no keyboard animation spam.  
- **TDD where money/auth paths change** (contract tests stay; API logic unit-tested via small pure helpers + manual route checks).

## Module map (target)

```text
server.js                         # thin HTTP router + static
server/
  lib/
    storage.js                    # readJSON/writeJSON atomic-ish
    auth.js                       # nonce + verifySignature
    sanitize.js
    cors.js
    roomIndex.js                  # address → roomIds index
    disputesStore.js
    evidenceStore.js
  routes/
    auth.js
    profiles.js
    listings.js                   # taken auth fix here
    offers.js
    notifications.js
    roomCodes.js
    roomIndex.js
    evidence.js                   # NEW
    disputes.js                   # NEW
    health.js

frontend/src/
  hooks/
    useRoomData.js                # load room, evidence, mutual cancel, polling
    useRoomActions.js             # all tx handlers
    useRoomTimers.js              # countdown strings
    useOwnedRooms.js              # uses index API then targeted reads
  lib/
    roomIndexApi.js
    disputesApi.js
    evidenceApi.js
  components/
    RoomView.jsx                  # composition only
    dispute-desk/                 # Emil mono desk UI
      DisputeDesk.jsx
      DisputeQueue.jsx
      DisputeCasePanel.jsx
      DeliveryProofField.jsx
```

## Workstream designs

### 1) P0 API

**Evidence**

- `GET /api/evidence/:roomId` → array  
- `POST /api/evidence` (auth) body: `{ roomId, evidenceType, description, evidenceRef }`  
- Store: `evidence.json` keyed by roomId  
- Sanitize strings; bind submitter to verified wallet

**Disputes**

- `GET /api/disputes` — optional `?status=open`  
- `GET /api/disputes/:roomId`  
- `POST /api/disputes` (auth) register case after on-chain dispute  
- Store: `disputes.json`  
- Fields: roomId, item, price, collateral, creator, counterparty, disputedBy, reason, evidenceRef, status (`open|resolved`), createdAt, updatedAt

**Listing taken**

Allow mark taken when:

- `verified === listing.creator`, **or**  
- listing not taken and `verified` is any authenticated wallet providing `roomId` (market counterparty open)

Still reject if already taken by different roomId (idempotent same roomId OK).

### 2) RoomView modularization

Extract without behavior change first, then wire proof + dispute API helpers.

- `useRoomData(id, wallet)` → room, evidence, reps, arbiter meta, mutualCancel, loaders  
- `useRoomActions({ id, room, wallet, joinCode, ... })` → handlers + txPending/status  
- `useRoomTimers(room)` → countdown, confirmCountdown, canExpire, canEscalate, canBuyerRefund  
- `RoomView.jsx` wires panels only

### 3) Room index

**Write path (client after success):**

- After `createRoom` / `joinRoom` success → `POST /api/room-index` `{ roomId }` auth  
- Server stores `room_index.json`: `{ [addressLower]: number[] }` unique sorted desc

**Read path:**

- `GET /api/room-index` auth → `{ roomIds: number[] }`  
- `useOwnedRooms` fetches ids, then `readMany`/`rooms(id)` only for those ids  
- Fallback: if index empty, one-time legacy scan + backfill POST (dev safety)

Optional later: server-side chain poller — not in this slice.

### 4) Dispute Desk + delivery proof

**Delivery proof**

- UI field (optional text/url) before Mark delivered  
- `proofHash = keccak256(toUtf8Bytes(proofText || roomId + deliveredAt client note))`  
- Never silent ZeroHash if user entered text; if empty, hash a structured placeholder `bond:delivered:${roomId}` so not zero (auditable intent)

**Dispute Desk UI** (`/arbiter` enhancement)

- Queue from `GET /api/disputes?status=open` merged with on-chain Disputed scan (prefer API, fallback chain)  
- Case panel: parties, reason, evidence list, on-chain actions (existing resolve/split)  
- Emil: mono panels, square, 150–200ms ease-out panel enter, button `:active` scale 0.97, no gold, no pill chrome

## Data files (`DATA_DIR`)

| File | Purpose |
| --- | --- |
| `listings.json` | market (existing) |
| `offers.json` | offers (existing) |
| `notifications.json` | notifs (existing) |
| `room_codes.json` | invite codes (existing) |
| `profiles.json` | profiles (existing) |
| `evidence.json` | **new** |
| `disputes.json` | **new** |
| `room_index.json` | **new** |

## Testing / verification

- Contract suite still green: `npm run test:bound-testnet --prefix contract`  
- API: node smoke script or curl against local server for evidence/disputes/taken/index  
- Frontend build: `npm run build --prefix frontend`  
- Manual: create room → index hit; deliver with proof; dispute → desk shows case

## Risks

| Risk | Mitigation |
| --- | --- |
| JSON concurrent write | serialize writes per file via in-process queue in `storage.js` |
| Index incomplete | fallback scan + backfill once |
| Auth nonce memory | unchanged this slice; document |
| Arbiter trust | unchanged; desk is UX not new trust model |

## Success criteria

- [ ] No frontend calls to missing `/api/evidence` or `/api/disputes`  
- [ ] Market open-room can mark listing taken without 403  
- [ ] RoomView split into hooks; file < ~200 LOC composition  
- [ ] My Rooms uses index path by default  
- [ ] Deliver stores non-zero proof hash when proof text set  
- [ ] Arbiter desk shows open disputes from API  
- [ ] DESIGN.md mono respected on new UI  
