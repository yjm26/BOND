import { CREATE_FLOW } from './createRoomData'

export default function CreateRoomFlow({ creatorIsSeller }) {
  const steps = creatorIsSeller ? CREATE_FLOW.seller : CREATE_FLOW.buyer
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {steps.map(([number, title, body]) => (
        <div key={number} className="border border-[var(--a-line)] bg-[var(--a-panel)] p-4">
          <div className="mb-4 flex h-7 w-7 items-center justify-center border border-[var(--a-muted)]/30 font-mono text-[10px] text-[var(--a-muted)]">{number}</div>
          <div className="text-[14px] font-medium text-[var(--a-ink)]">{title}</div>
          <div className="mt-1 text-[12px] leading-[1.55] text-[var(--a-muted)]">{body}</div>
        </div>
      ))}
    </div>
  )
}
