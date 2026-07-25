---
version: alpha
name: BOND Stark
description: Stark mono palette for BOND escrow — layout stays editorial/square; colors are black, white, and neutral gray only.
colors:
  paper: "#fafafa"
  ink: "#0a0a0a"
  black: "#000000"
  panel: "#111111"
  surface: "#0a0a0a"
  text-on-dark: "#fafafa"
  muted: "#a3a3a3"
  faint: "#737373"
  body: "#525252"
  line-on-dark: "rgba(250, 250, 250, 0.10)"
  line-on-light: "rgba(10, 10, 10, 0.12)"
  accent: "#a3a3a3"
  success-soft: "#8f9a88"
  danger-soft: "#b87333"
typography:
  h1:
    fontFamily: Inter
    fontSize: 3rem
    fontWeight: 500
    lineHeight: 0.92
    letterSpacing: "-0.07em"
  body-md:
    fontFamily: Inter
    fontSize: 0.9375rem
    fontWeight: 400
    lineHeight: 1.65
  label-mono:
    fontFamily: "JetBrains Mono"
    fontSize: 0.625rem
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: "0.22em"
rounded:
  none: 0px
spacing:
  sm: 8px
  md: 16px
  lg: 24px
components:
  button-primary-dark:
    backgroundColor: "{colors.paper}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: 12px
  button-primary-dark-hover:
    backgroundColor: "transparent"
    textColor: "{colors.paper}"
  button-secondary-dark:
    backgroundColor: "transparent"
    textColor: "{colors.text-on-dark}"
    rounded: "{rounded.none}"
  modal-dark:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-on-dark}"
  toast-dark:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.text-on-dark}"
---

## Overview

BOND uses a **stark mono** visual system. Product structure stays the same (editorial landing, dark app shell, square controls, mono labels). Only the palette changed from warm paper/gold.

Agents must **not** reintroduce gold (`#d8b15f`), cream paper (`#ede9df`), clay fills on modals, blue SaaS chips, or pill CTAs unless the user explicitly redesigns.

## Colors

Core surfaces:

| Token | Hex | Use |
| --- | --- | --- |
| paper | `#fafafa` | Landing background, primary CTA on dark, light text |
| ink | `#0a0a0a` | Landing text, dark CTA on light |
| black | `#000000` | App page canvas |
| surface | `#0a0a0a` | App main panels |
| panel | `#111111` | Cards, sidebars, modals, toasts, menus |
| muted | `#a3a3a3` | Eyebrows, secondary labels, accents |
| faint | `#737373` | Quiet meta text on light |
| body | `#525252` | Body copy on light |

Semantic tints (state only — not brand chrome):

| Token | Hex | Use |
| --- | --- | --- |
| success-soft | `#8f9a88` | Funded/released badges, success dots if needed |
| danger-soft | `#b87333` | Dispute/refund **state labels in room/market lists only** |

**Do not use `danger-soft` / clay / gold for confirm modals, toast chrome, or notification panels.** Those overlays stay mono:

- modal panel = `panel` + paper/ink buttons
- toast = `panel` + paper/muted text + thin paper border
- notification drawer = same as dark menu/panel

## Typography

- **UI/body:** Inter
- **Labels:** JetBrains Mono, 10px, uppercase, wide tracking
- Headings stay tight tracking / medium weight — do not restyle type when only palette work is requested

## Layout

Layout is locked unless the user asks for redesign:

- square corners (`rounded: 0`)
- thin 1px borders
- landing: giant wordmark + negative space
- app: dark shell + left sidebar on desktop

Palette swaps must not change spacing, radius, grid, or component structure.

## Elevation & Depth

Minimal. Prefer border + solid panel over colored glow. No warm gold radial washes on `body`.

## Shapes

Square only for product controls. No Coinbase-style pills.

## Components

### Confirm modal

- Backdrop: black ~70% + light blur
- Panel: `#111111`, border `fafafa/14`
- Eyebrow: muted gray (even for disconnect/danger)
- Primary/confirm button: solid `#fafafa` on dark (not clay/gold)
- Cancel: outline `fafafa/14`
- Press: `scale(0.97)`, ease-out ~160ms

### Toasts

- Dark panel `#111111`
- Border paper low opacity
- Text paper/muted — **no gold/clay/blue type colors**
- Enter ~200ms ease-out from slightly below; respect reduced motion

### Notifications

- Match app header tone (dark in app)
- Panel `#111111`, mono header
- Unread = subtle paper wash, not blue tint
- Badge: paper on ink, square/minimal

### Primary buttons

- Dark surfaces: paper fill, ink text; hover invert to outline
- Light surfaces: ink fill, paper text; hover invert

## Do's and Don'ts

**Do**

- Keep structure; change tokens only when asked for palette work
- Use mono overlays for modal/toast/notification
- Keep success/dispute tints only on escrow **state** chips where status must scan fast
- Read this file before any BOND color edit

**Don't**

- Bring back gold `#d8b15f` or cream `#ede9df` as brand chrome
- Paint danger confirms with clay/orange fills
- Use Tailwind `blue-*` / `amber-*` leftovers on app chrome
- Redesign layout while “just changing colors”
- Leave one surface (modal/toast/bell) on the old warm system

## Migration notes

Old → Stark:

- `#ede9df` → `#fafafa`
- `#0d0d0b` / `#171716` → `#0a0a0a`
- `#050505` / `#08090a` → `#000000`
- `#111110` → `#0a0a0a`
- `#20201f` → `#111111`
- `#d8b15f` → `#a3a3a3` (brand accent)
- modal danger fill clay → paper/ink mono buttons

## App light / dark

Landing stays light only — no theme toggle.

App workspace (`/app`, workspace market, rooms, create, profile, …):

- Toggle in top nav (sun/moon)
- Stored as `bond_app_theme` = `light` | `dark`
- Light tokens match landing paper (`#fafafa` / `#0a0a0a`)
- Dark tokens stay stark mono black
- Applied only via `html[data-app-theme]` CSS variables (`--a-bg`, `--a-ink`, …)

Do not put a theme switch on the marketing landing.

## Landing structure

Linear density, BOND stark. Not essay stacks.

1. **Hero** — interactive room demo (product surface)
2. **Market stage** — static listing board + Browse market
3. **Close** — dual doors: Room / Market

Dropped from landing body: Room clarity grid, use-case essays, long room-states section (docs + hero cover that).

## Landing rhythm

1. Hero room demo (product)
2. Manifesto
3. Pillars Room / Market / Exit
4. Endings (dark type chapter)
5. Dual-door close

Market is **not** mocked on landing. Header + CTAs go to `/market` (real page).
