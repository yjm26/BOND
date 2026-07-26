/**
 * Route-level Suspense fallback for lazy-loaded pages.
 * Minimal + on-brand (mono, no spinner theater). Matches app bg so the
 * swap to real content is quiet, not a flash.
 */
export default function RouteFallback() {
  return (
    <div className="grid min-h-[60vh] place-items-center px-6">
      <div className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-[0.24em] text-[var(--a-ink,#0a0a0a)]/40">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
        Loading
      </div>
    </div>
  )
}
