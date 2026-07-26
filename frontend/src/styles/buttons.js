/**
 * Shared button classes — BOND mono (square corners).
 * Use these instead of one-off class soups. Press: active:scale-[0.97] ~160ms.
 */
const ease = 'transition duration-160 ease-out active:scale-[0.97]'
const base =
  'inline-flex h-11 items-center justify-center px-5 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100'

/** Full-width primary (room actions, forms) */
export const btnPrimary = `${base} w-full border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] text-[var(--a-inverse-ink)] hover:bg-transparent hover:text-[var(--a-ink)] ${ease}`

/** Full-width secondary / ghost */
export const btnSecondary = `${base} w-full border border-[var(--a-line)] text-[var(--a-ink)]/64 hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] ${ease}`

/** Full-width danger */
export const btnDanger = `${base} w-full border border-[#b87333]/38 text-[#b87333] hover:bg-[#b87333]/10 ${ease}`

/** Inline primary (nav, banners) — not full width */
export const btnPrimaryInline = `${base} border border-[var(--a-ink)] bg-[var(--a-inverse-bg)] text-[var(--a-inverse-ink)] hover:bg-transparent hover:text-[var(--a-ink)] ${ease}`

/** Inline secondary */
export const btnSecondaryInline = `${base} border border-[var(--a-line)] text-[var(--a-ink)]/70 hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink)] ${ease}`

/** Landing light surface primary (dark fill) */
export const btnLandingPrimary = `${base} border border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] hover:bg-transparent hover:text-[#0a0a0a] ${ease}`

/** Landing light surface secondary */
export const btnLandingSecondary = `${base} border border-[#0a0a0a]/18 text-[#0a0a0a]/70 hover:border-[#0a0a0a]/40 hover:text-[#0a0a0a] ${ease}`

/** Landing dark surface primary (light fill) */
export const btnLandingOnDarkPrimary = `${base} border border-[#fafafa] bg-[#fafafa] text-[#0a0a0a] hover:bg-transparent hover:text-[#fafafa] ${ease}`

/** Landing dark surface secondary */
export const btnLandingOnDarkSecondary = `${base} border border-[#fafafa]/18 text-[#fafafa]/70 hover:border-[#fafafa]/40 hover:text-[#fafafa] ${ease}`
