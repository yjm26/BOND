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
    ? 'border-[#fafafa]/14 bg-[#111111] text-[#fafafa]'
    : 'border-[#0a0a0a]/14 bg-[#fafafa] text-[#0a0a0a]'
  const mutedText = dark ? 'text-[#a3a3a3]' : 'text-[#525252]'
  const subtleText = dark ? 'text-[#fafafa]/44' : 'text-[#0a0a0a]/44'
  const cancelButton = dark
    ? 'border-[#fafafa]/14 text-[#fafafa]/70 hover:border-[#fafafa]/34 hover:text-[#fafafa] active:scale-[0.97]'
    : 'border-[#0a0a0a]/14 text-[#0a0a0a]/70 hover:border-[#0a0a0a]/34 hover:text-[#0a0a0a] active:scale-[0.97]'
  // Stark mono: danger is copy/priority, not clay/gold fill.
  const confirmButton = dark
    ? 'border-[#fafafa] bg-[#fafafa] text-[#0a0a0a] hover:bg-transparent hover:text-[#fafafa] active:scale-[0.97]'
    : 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa] hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]'
  const eyebrowClass = danger ? (dark ? 'text-[#a3a3a3]' : 'text-[#525252]') : subtleText

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6" role="dialog" aria-modal="true">
      <button className="absolute inset-0 cursor-default bg-[#000000]/70 backdrop-blur-sm" aria-label="Close confirmation" onClick={onCancel} />
      <div className={`relative w-full max-w-[460px] border p-5 shadow-2xl sm:p-6 ${panelClass}`}>
        <div className={`font-mono text-[10px] uppercase tracking-[0.24em] ${eyebrowClass}`}>{eyebrow}</div>
        <h2 className="mt-5 max-w-[360px] text-[34px] font-medium leading-[0.94] tracking-[-0.06em]">
          {title}
        </h2>
        {description && (
          <p className={`mt-4 text-[14px] leading-[1.65] tracking-[-0.01em] ${mutedText}`}>
            {description}
          </p>
        )}
        <div className="mt-8 grid grid-cols-2 gap-2">
          <button onClick={onCancel} className={`h-11 border font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-160 ease-out ${cancelButton}`}>
            {cancelLabel}
          </button>
          <button onClick={onConfirm} className={`h-11 border font-mono text-[11px] font-semibold uppercase tracking-[0.16em] transition duration-160 ease-out ${confirmButton}`}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
