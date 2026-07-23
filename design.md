# BOND Design Direction

BOND should feel like a calm Arc-native settlement product, not a generic crypto dashboard.

Use this file as the source of truth before changing UI, copy, colors, motion, or product framing.

## Product stance

BOND is:

> A private escrow room for safe USDC deals on Arc.

The product should make these things clear:

- who pays;
- who delivers;
- how much USDC is locked;
- what proof exists;
- when funds can move;
- where disputes/refunds go;
- that Arc is the settlement rail.

Do **not** frame the current product as agentic unless the feature is actually implemented in UI + backend/contract flow.

## Visual direction

Reference direction: ContentArchitecture-inspired editorial/system UI.

Core layout language:

- off-white editorial surfaces;
- warm almost-black architecture canvas;
- technical mono labels;
- clear settlement diagrams;
- restrained motion;
- product-system clarity.

The UI should feel:

- premium;
- calm;
- trustworthy;
- technical but readable;
- web2-friendly;
- Arc-native without crypto noise.

Avoid:

- blue/purple SaaS gradients;
- neon web3 colors;
- fake production badges;
- agentic copy that is not implemented;
- random node graphs that do not explain the escrow flow;
- crowded crypto dashboard cards;
- decorative status pills with no real product meaning.

## Palette

Use the **Editorial Monochrome** palette.

```text
Paper bg:       #EDE9DF
Ink text:       #171716
Canvas black:   #20201F
Deep black:     #050505
Muted text:     #6F6B62
Line/border:    rgba(23,23,22,0.14)
Canvas line:    rgba(237,233,223,0.28)
Accent warm:    #D8B15F
Success sage:   #B7C8A3
Warning clay:   #C98B4A
```

Current semantic usage:

```text
Buyer / neutral nodes:      #EDE9DF
Arc USDC / primary accent:  #D8B15F
Escrow / success lock:      #B7C8A3
Dispute / fallback:         #C98B4A
Canvas surface:             #20201F
Editorial panel:            #EDE9DF
Primary dark text:          #171716
```

Do not reintroduce blue/purple as the main brand accent.

## Typography

Fonts:

- primary sans: Inter;
- technical labels: JetBrains Mono.

Type direction:

- large editorial headline;
- tight letter spacing for hero/title text;
- small uppercase mono labels for system/flow metadata;
- body copy short, concrete, and product-specific.

Good copy:

```text
The deal room strangers don't have to trust.
Everything stays visible before value moves.
Buyer → Escrow → Seller, with Arbiter as fallback.
```

Bad copy:

```text
Production ready
Agent powered
AI settlement layer
RoomState
Revolutionary web3 marketplace
```

## Hero rules

The hero uses two sides:

1. Left editorial panel
   - off-white background;
   - large black headline;
   - short concrete paragraph;
   - clear CTA buttons;
   - meaningful role/flow facts only.

2. Right settlement canvas
   - warm almost-black background;
   - subtle grid;
   - visible directional flow lines;
   - hoverable nodes with real explanations;
   - no decorative fake controls.

Current approved flow direction:

```text
Buyer ── fund USDC ──> Escrow ── release ──> Seller
                         ↑
                      Arc USDC
                         ↓
                      Dispute
                         ↓
                      Arbiter
```

Hero canvas should explain the escrow product, not act as an abstract logo.

## Interaction and motion

Use motion only to clarify state or guide attention.

Allowed:

- smooth scroll;
- scroll reveal for lower sections, subtle translate/fade only;
- subtle hover transitions;
- low-opacity animated dashed settlement lines;
- small moving flow particles on the hero settlement rail when they clarify direction;
- gentle reveal animation;
- node hover explanation.

Avoid:

- heavy parallax;
- flashy glowing animations;
- infinite noisy movement;
- bouncing CTAs;
- cursor gimmicks;
- overanimated cards.

Respect `prefers-reduced-motion`.

## Component structure

Keep React/Tailwind code modular.

Hero files should stay split like:

```text
frontend/src/components/hero/
  BondHero.jsx
  HeroCopy.jsx
  HeroCtaGroup.jsx
  HeroFactStrip.jsx
  SettlementCanvas.jsx
  SettlementConditionCard.jsx
  SettlementNode.jsx
  SettlementPaths.jsx
  heroData.js
```

Avoid turning any landing component into a 1,000+ line prototype file.

Rules:

- data arrays live in `heroData.js` or focused data files;
- visual subparts get their own component;
- pages compose sections;
- sections should not hide contract/backend behavior behind fake copy.

## Product honesty

Only show features that exist or are clearly framed as future context.

Do not show:

- Agent nodes unless agent/task flow is implemented;
- CCTP funding UI unless the funding module exists;
- production-ready badges while still on testnet/demo;
- fake room IDs/statistics unless clearly illustrative and useful;
- security claims not backed by actual product behavior.

Arc Testnet should remain clear where relevant.

## Section guidance

For future sections below hero:

- keep the same editorial/system language;
- do not copy the hero layout everywhere;
- use diagrams only when they explain product behavior;
- make risk and transaction state visible;
- prefer concrete escrow lifecycle copy over vague marketing.

Useful section types:

- How BOND works;
- Why Arc settlement matters;
- Escrow lifecycle;
- Buyer/Seller/Arbiter responsibilities;
- Room state examples;
- Dispute path explanation;
- Future funding path, only when implemented.

## Definition of good

A BOND screen is good when:

- the next action is obvious;
- users can tell what action moves money;
- USDC lock/release/refund/dispute states are clear;
- the UI feels calm and premium;
- colors stay editorial and restrained;
- copy is short and honest;
- mobile layout still breathes.

If a change makes BOND look like a generic crypto dashboard, revert or redesign it.
