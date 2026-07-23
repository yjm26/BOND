export default function ConfirmModal({
  open,
  tone = 'dark',
  eyebrow = 'Confirm action',
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  danger = false,
  onConfirm,
  onCancel,
}) {
  if (!open) return null

  const dark = tone === 'dark'
  const panelClass = dark
    ? 'border-[#ede9df]/14 bg-[#20201f] text-[#ede9df]'
    : 'border-[#171716]/14 bg-[#ede9df] text-[#171716]'
  const mutedText = dark ? 'text-[#b9b2a5]' : 'text-[#5f5a50]'
  const subtleText = dark ? 'text-[#ede9df]/44' : 'text-[#171716]/44'
  const cancelButton = dark
    ? 'border-[#ede9df]/14 text-[#ede9df]/70 hover:border-[#ede9df]/34 hover:text-[#ede9df]'
    : 'border-[#171716]/14 text-[#171716]/70 hover:border-[#171716]/34 hover:text-[#171716]'
  const confirmButton = danger
    ? 'border-[#c98b4a] bg-[#c98b4a] text-[#171716] hover:bg-transparent hover:text-[#c98b4a]'
    : dark
      ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f] hover:bg-transparent hover:text-[#ede9df]'
      : 'border-[#171716] bg-[#171716] text-[#ede9df] hover:bg-transparent hover:text-[#171716]'

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default bg-[#050505]/70 backdrop-blur-sm" aria-label="Close confirmation" onClick={onCancel} />
      <div className={`relative w-full max-w-[460px] border p-5 shadow-2xl sm:p-6 ${panelClass}`}>
        <div className={`font-mono text-[10px] uppercase tracking-[0.24em] ${danger ? 'text-[#c98b4a]' : subtleText}`}>{eyebrow}</div>
        <h2 className="mt-5 max-w-[360px] text-[34px] font-medium leading-[0.94] tracking-[-0.06em]">
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-[14px] leading-[1.65] tracking-[-0.01em] ${mutedText}`}>
            {description}
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-2">
          <button onClick={onCancel} className={`h-11 border font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition ${cancelButton}`}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`h-11 border font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition ${confirmButton}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
