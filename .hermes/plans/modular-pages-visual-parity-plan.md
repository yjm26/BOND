# Modular Pages Refactor Plan — Visual Parity Required

## Rule
Every pushed UI change must be modular, but modularization must preserve the exact user-facing layout, spacing, colors, copy, route behavior, and interactions unless the user explicitly asks for visual changes.

## Current Status
Already modular / acceptable:
- Landing sections: `Hero`, `HowItWorks`, `flow/*`, `room-clarity/*`, `use-cases/*`, `Footer`.
- App onboarding/workspace: `components/app/*`.
- Navbar/header: `components/navbar/*`.
- Market: now split into `components/market/*` with `Market.jsx` as composer/logic wrapper.
- New `src/pages/*` wrappers were added so `App.jsx` routes call pages instead of inline component trees. This should not change visuals.

Still too monolithic / needs modular pass:
1. `CreateRoom.jsx` — 521 lines
2. `RoomView.jsx` — 919 lines
3. `RoomsPage.jsx` — 300 lines
4. `ArbiterDashboard.jsx` — 399 lines
5. `Docs.jsx` — 1105 lines
6. `Offers.jsx` / `OffersPanel.jsx` — 145 lines each, moderate but can be split when touched
7. `OfferModal.jsx` — 128 lines, acceptable but can be split if it grows
8. `market/ListingDetailModal.jsx` — 229 lines, acceptable temporarily but should be split later into modal header/body/actions
9. `room/ActionPanel.jsx` — 227 lines, already under `room/` but still large
10. `room/RoomHistory.jsx` — 144 lines, moderate

## Refactor Method
For each page/component:
1. Take baseline screenshots for target route before edits.
2. Extract constants/helpers first.
3. Extract presentational pieces one by one.
4. Keep original classNames/copy/DOM structure as much as possible.
5. Do not redesign during modular refactor.
6. Build after each major page.
7. Capture after screenshots and compare visually.
8. Only push if build passes and screenshots match intended current UI.

## Proposed Page Targets

### Phase 1 — Page wrappers only (already started)
Goal: `App.jsx` routes should import page wrappers and call them.
Files:
- `src/pages/LandingPage.jsx`
- `src/pages/AppPage.jsx`
- `src/pages/MarketPage.jsx`
- `src/pages/CreateRoomPage.jsx`
- `src/pages/RoomsIndexPage.jsx`
- `src/pages/RoomDetailPage.jsx`
- `src/pages/OffersPage.jsx`
- `src/pages/ProfilePage.jsx`
- `src/pages/DocsPage.jsx`
- `src/pages/ArbiterPage.jsx`
Visual impact: none expected.
Verification: build + screenshots `/`, `/app`, `/market`.

### Phase 2 — CreateRoom modularization
Goal: `CreateRoom.jsx` becomes composer only.
Target folder: `components/create-room/`
Candidate components:
- `CreateRoomGate.jsx`
- `CreateRoomForm.jsx`
- `DealTermsFields.jsx`
- `CounterpartyFields.jsx`
- `RoomPricingFields.jsx`
- `DeliveryFields.jsx`
- `CreateRoomSummary.jsx`
- `CreateRoomActions.jsx`
- `createRoomConstants.js`
- `createRoomUtils.js`
Visual impact: none.
Verification: `/create` disconnected + connected-sim limitations documented.

### Phase 3 — RoomView modularization
Goal: split room detail into layout, header, status, participants, evidence/actions/history.
Target folder: `components/room-view/`
Candidate components:
- `RoomViewShell.jsx`
- `RoomHeader.jsx`
- `RoomStatusPanel.jsx`
- `RoomParticipants.jsx`
- `RoomTerms.jsx`
- `RoomEvidencePanel.jsx`
- `RoomActionSection.jsx`
- `RoomErrorState.jsx`
- `roomViewUtils.js`
Visual impact: none.
Verification: `/room/:id` available sample or graceful error state.

### Phase 4 — RoomsPage modularization
Target folder: `components/rooms/`
Candidate components:
- `RoomsPageShell.jsx`
- `RoomsToolbar.jsx`
- `RoomList.jsx`
- `RoomListItem.jsx`
- `RoomsEmptyState.jsx`
- `roomsUtils.js`
Visual impact: none.

### Phase 5 — ArbiterDashboard modularization
Target folder: `components/arbiter/`
Candidate components:
- `ArbiterShell.jsx`
- `DisputeQueue.jsx`
- `DisputeCard.jsx`
- `DisputeDetailModal.jsx`
- `ArbiterStats.jsx`
Visual impact: none.

### Phase 6 — Docs modularization
Docs is huge but less urgent for app UX. Split into docs sections later.
Target folder: `components/docs/`
Candidate components:
- `DocsLayout.jsx`
- `DocsSidebar.jsx`
- section components per docs topic
- diagrams extracted separately
Visual impact: none.

## Acceptance Criteria Before Push
- Page wrappers/components are modular.
- `npm run build` passes.
- Browser console has 0 JS errors on touched routes.
- Screenshots show no unintended visual drift.
- Final summary lists exact files changed and verification output.
