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

const STYLES = {
  ok:   'border-[#b7c8a3]/32 bg-[#111110]/96 text-[#b7c8a3]',
  err:  'border-[#c98b4a]/38 bg-[#111110]/96 text-[#c98b4a]',
  info: 'border-[#d8b15f]/30 bg-[#111110]/96 text-[#d8b15f]',
}

export default function ToastContainer() {
  const { toasts, removeToast } = useToast()
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex w-full max-w-sm flex-col gap-2 px-4 pointer-events-none sm:px-0">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 border px-4 py-3 text-[13px] font-medium shadow-[0_18px_60px_rgba(0,0,0,0.42)] backdrop-blur animate-[slideIn_0.2s_ease-out] ${STYLES[t.type]}`}
          style={{
            animation: 'slideIn 0.25s ease-out',
          }}
        >
          <span className="mt-0.5 shrink-0 opacity-80">{ICONS[t.type]}</span>
          <span className="flex-1 leading-snug tracking-[-0.01em]">{t.message}</span>
          <button
            onClick={() => removeToast(t.id)}
            className="shrink-0 opacity-50 hover:opacity-100 transition"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        </div>
      ))}
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}
