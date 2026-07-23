import { CREATE_FLOW } from './createRoomData'

export default function CreateRoomFlow({ creatorIsSeller }) {
  const steps = creatorIsSeller ? CREATE_FLOW.seller : CREATE_FLOW.buyer
  return (
    <div className="grid gap-2 sm:grid-cols-3">
      {steps.map(([number, title, body]) => (
        <div key={number} className="border border-[#ede9df]/10 bg-[#111110] p-4">
          <div className="mb-4 flex h-7 w-7 items-center justify-center border border-[#d8b15f]/30 font-mono text-[10px] text-[#d8b15f]">{number}</div>
          <div className="text-[14px] font-medium text-[#ede9df]">{title}</div>
          <div className="mt-1 text-[12px] leading-[1.55] text-[#b9b2a5]">{body}</div>
        </div>
      ))}
    </div>
  )
}
