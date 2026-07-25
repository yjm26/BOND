# BOND Modular Foundation + Dispute Desk — Implementation Plan

> **For agentic workers:** Execute task-by-task inline (user chose no subagents). Use executing-plans + TDD. Steps use checkbox syntax.

**Goal:** Fix P0 API gaps, modularize RoomView, add room index for My Rooms, and ship Dispute Desk with real evidence + delivery proof — all modular, DESIGN.md mono, Emil motion craft.

**Architecture:** Thin `server.js` router over `server/` modules (storage, auth, route handlers). Frontend extracts room hooks; My Rooms reads `room_index` then targeted `rooms(id)`. Dispute Desk consumes disputes/evidence APIs; delivery uses keccak proof hash.

**Tech Stack:** Node http (existing), ethers v6, React 19, Vite, Hardhat tests, JSON file stores under `DATA_DIR`.

## Global Constraints

- No private keys in repo; no mainnet money logic changes beyond proof hash client-side  
- Keep BoundTestnet.sol immutable this plan (no Solidity deploy required)  
- DESIGN.md: paper/ink/panel mono only; square corners; no gold/cream  
- Emil: ease-out ≤300ms UI motion; button press scale ~0.97; never scale(0); no animation on high-frequency keyboard paths  
- Modular files; no new god-files  
- USDC amounts remain 6 decimals  
- Auth: existing SIWE-like headers  

---

### Task 1: Server storage + auth modules

**Objective:** Extract pure helpers so routes stay thin and testable.

**Files:**
- Create: `server/lib/storage.js`
- Create: `server/lib/sanitize.js`
- Create: `server/lib/cors.js`
- Create: `server/lib/auth.js`
- Create: `server/lib/paths.js`

**Steps:**

- [ ] **Step 1:** Create `server/lib/paths.js` exporting file paths from `STORAGE_DIR` env (`DATA_DIR` || `RENDER_DISK_MOUNT_PATH` || process.cwd()).

```js
const path = require('path')
const STORAGE_DIR = process.env.DATA_DIR || process.env.RENDER_DISK_MOUNT_PATH || process.cwd()
module.exports = {
  STORAGE_DIR,
  listingsFile: path.join(STORAGE_DIR, 'listings.json'),
  notificationsFile: path.join(STORAGE_DIR, 'notifications.json'),
  offersFile: path.join(STORAGE_DIR, 'offers.json'),
  roomCodesFile: path.join(STORAGE_DIR, 'room_codes.json'),
  profilesFile: path.join(STORAGE_DIR, 'profiles.json'),
  evidenceFile: path.join(STORAGE_DIR, 'evidence.json'),
  disputesFile: path.join(STORAGE_DIR, 'disputes.json'),
  roomIndexFile: path.join(STORAGE_DIR, 'room_index.json'),
}
```

- [ ] **Step 2:** Create `server/lib/storage.js` with write queue per file (Promise chain map), `readJSON`, `writeJSON`, `updateJSON(file, fn)`.

- [ ] **Step 3:** Move `sanitize`, `corsHeaders`/`ALLOWED_ORIGINS`, `getNonce`/`verifySignature`/`parseAuth` into modules; export from `auth.js` / `sanitize.js` / `cors.js`.

- [ ] **Step 4:** Commit `chore(server): extract storage auth cors modules`

---

### Task 2: Evidence + disputes store + routes

**Objective:** Implement missing APIs RoomView already calls.

**Files:**
- Create: `server/lib/evidenceStore.js`
- Create: `server/lib/disputesStore.js`
- Create: `server/routes/evidence.js`
- Create: `server/routes/disputes.js`
- Create: `server/router.js` (dispatch helper)
- Modify: `server.js` — require router modules

**API contracts:**

```text
GET  /api/evidence/:roomId
POST /api/evidence
  auth headers required
  body: { roomId, evidenceType, description, evidenceRef }
  → { id, roomId, submitter, evidenceType, description, evidenceRef, timestamp }

GET  /api/disputes?status=open
GET  /api/disputes/:roomId
POST /api/disputes
  auth
  body: { roomId, item, price, collateral, creator, counterparty, reason, evidenceRef }
  → dispute object status=open
```

**Steps:**

- [ ] **Step 1:** Implement stores (array/map JSON).

- [ ] **Step 2:** Implement route handlers returning `{ handled: true }` or false.

- [ ] **Step 3:** Wire in `server.js` before SPA fallback.

- [ ] **Step 4:** Smoke test with node script (mock verify or temporary bypass only in test harness — prefer calling store functions directly).

- [ ] **Step 5:** Commit `feat(api): evidence and disputes endpoints`

---

### Task 3: Fix listing taken authorization

**Objective:** Market counterparty can mark listing taken when opening a room.

**Files:**
- Modify: listings route (or `server.js` taken handler → `server/routes/listings.js`)

**Rules:**
- Auth required  
- If `listing.taken && listing.takenRoomId && listing.takenRoomId !== body.roomId` → 409  
- If `listing.taken && same roomId` → 200 idempotent  
- Allow if `verified === listing.creator.toLowerCase()` **OR** (`!listing.taken` and body.roomId present)  
- Set `takenBy` to verified, `takenRoomId` to body.roomId  

- [ ] **Step 1:** Implement + document in comment  
- [ ] **Step 2:** Commit `fix(api): allow counterparty to mark listing taken`

---

### Task 4: Room index API

**Objective:** Persist address→roomIds for fast My Rooms.

**Files:**
- Create: `server/lib/roomIndexStore.js`
- Create: `server/routes/roomIndex.js`

```text
GET  /api/room-index          auth → { roomIds: number[] } for verified
POST /api/room-index          auth body: { roomId: number|string }
     adds roomId to verified address list (unique)
POST /api/room-index/backfill auth body: { roomIds: number[] }  // optional bulk
```

- [ ] Implement store + routes  
- [ ] Commit `feat(api): room index for owned rooms`

---

### Task 5: Frontend API clients

**Files:**
- Create: `frontend/src/lib/evidenceApi.js`
- Create: `frontend/src/lib/disputesApi.js`
- Create: `frontend/src/lib/roomIndexApi.js`

Wrap `authFetch` / `apiGet` with clear function names used by hooks.

- [ ] Commit `feat(frontend): api clients for evidence disputes room-index`

---

### Task 6: Extract `useRoomData` + `useRoomTimers`

**Files:**
- Create: `frontend/src/hooks/useRoomData.js`
- Create: `frontend/src/hooks/useRoomTimers.js`
- Modify: `frontend/src/components/RoomView.jsx`

Move loadRoom, loadEvidence (use evidenceApi), reputation, mutual cancel, smart polling into `useRoomData`.  
Move countdown / canExpire / canEscalate / canBuyerRefund into `useRoomTimers`.

- [ ] Behavior-preserving extract  
- [ ] Commit `refactor(room): extract useRoomData and useRoomTimers`

---

### Task 7: Extract `useRoomActions`

**Files:**
- Create: `frontend/src/hooks/useRoomActions.js`
- Modify: `RoomView.jsx` to compose only

Include: doAction, join, fund, deliver (with proof), release, dispute (wire disputesApi + evidenceApi), cancel/leave/expire, mutual cancel, arbiter actions, escalate.

**Delivery proof change:**

```js
import { ethers } from 'ethers'
function deliveryProofHash(roomId, proofText) {
  const payload = (proofText && proofText.trim())
    ? proofText.trim()
    : `bond:delivered:${roomId}`
  return ethers.keccak256(ethers.toUtf8Bytes(payload))
}
```

Pass hash to `markDelivered`.

- [ ] Commit `refactor(room): extract useRoomActions + proof hash`

---

### Task 8: useOwnedRooms uses room index

**Files:**
- Modify: `frontend/src/hooks/useOwnedRooms.js`
- Modify: `CreateRoom.jsx` + join success in actions → `POST /api/room-index`

Flow:
1. `GET /api/room-index`  
2. If ids length > 0 → fetch those rooms only  
3. If empty → legacy descending scan capped (e.g. last 200) + `backfill`  

- [ ] Commit `feat(rooms): indexed owned rooms list`

---

### Task 9: Dispute Desk UI (Emil + DESIGN.md)

**Files:**
- Create: `frontend/src/components/dispute-desk/DisputeDesk.jsx`
- Create: `frontend/src/components/dispute-desk/DisputeQueue.jsx`
- Create: `frontend/src/components/dispute-desk/DisputeCasePanel.jsx`
- Create: `frontend/src/components/dispute-desk/DeliveryProofField.jsx` (used in room ActionPanel)
- Modify: `ArbiterDashboard.jsx` / `ArbiterPage.jsx` to render DisputeDesk  
- Modify: `ActionPanel.jsx` / deliver UX for proof field

**UI rules (Emil):**
- Panel enter: opacity + translateY(6px), 180ms `cubic-bezier(0.23, 1, 0.32, 1)`  
- Buttons: `active:scale-[0.97]` transition transform 140ms ease-out  
- Mono tokens only (`#0a0a0a`, `#fafafa`, `#111111`, `#a3a3a3`)  
- Queue list: 40ms stagger max 5 items  
- No scale(0); no ease-in; no gold

**Desk behavior:**
- Load `GET /api/disputes?status=open`  
- Select case → show reason, parties, `GET /api/evidence/:roomId`, on-chain actions if wallet is arbiter  
- Empty state: one quiet line “No open disputes.”

- [ ] Commit `feat(arbiter): dispute desk with evidence queue`

---

### Task 10: Docs + constants cleanup

**Files:**
- Modify: `frontend/src/utils/constants.js` — remove or align stale TIMERS with contract  
- Modify: `RoomView` guides — drop “deal type” copy  
- Modify: `README.md` — document new API files + DATA_DIR keys  
- Modify: `Docs.jsx` if needed (evidence API mention)

- [ ] Commit `docs: modular foundation and dispute desk`

---

### Task 11: Verification

- [ ] `npm run test:bound-testnet --prefix contract`  
- [ ] `npm install && npm run render-build` (or frontend build)  
- [ ] Manual checklist: health, evidence POST/GET, disputes POST/GET, room-index, listing taken  
- [ ] Fix failures  

---

## Execution order

1 → 2 → 3 → 4 → 5 → 6 → 7 → 8 → 9 → 10 → 11

## Out of scope

- Solidity changes / redeploy  
- Postgres  
- Push notifications for all chain events  
- Subagents  

