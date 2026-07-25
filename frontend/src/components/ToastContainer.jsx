import { useToast } from '../hooks/useToast'

const ICONS = {
  ok: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  err: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  info: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/><path d="M12 16v-4M12 8h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
  ),
}

// Stark mono toasts — no clay/gold/blue chrome
const STYLES = {
  ok: 'border-[var(--a-ink,#fafafa)]/18 bg-[var(--a-surface,#111111)]/96 text-[var(--a-ink,#fafafa)]',
  err: 'border-[var(--a-line-strong)] bg-[var(--a-surface,#111111)]/96 text-[var(--a-ink,#fafafa)]',
  info: 'border-[var(--a-line)] bg-[var(--a-surface,#111111)]/96 text-[var(--a-muted,#a3a3a3)]',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 pointer-events-none sm:px-0">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 border px-4 py-3 text-[13px] font-medium shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur ${STYLES[t.type] || STYLES.info}`}
          style={{
            animation: 'bondToastIn 0.2s cubic-bezier(0.23, 1, 0.32, 1)',
          }}
        >
          <span className="mt-0.5 shrink-0 opacity-80">{ICONS[t.type] || ICONS.info}</span>
          <span className="flex-1 leading-snug tracking-[-0.01em]">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 opacity-50 transition duration-160 ease-out hover:opacity-100 active:scale-[0.97]"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      ))}
      <style>{`
        @keyframes bondToastIn {
          from { opacity: 0; transform: translateY(10px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          @keyframes bondToastIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
        }
      `}</style>
    </div>
  )
}
