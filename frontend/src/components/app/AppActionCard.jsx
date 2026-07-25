import { Link } from 'react-router-dom'

export default function AppActionCard({ item, index }) {
  return (
    <Link
      to={item.to}
      className="group flex min-h-[168px] flex-col bg-[#111110] p-5 transition duration-160 ease-out hover:bg-[#1a1a18] active:scale-[0.995] sm:min-h-[180px] sm:p-6"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/38">
          0{index + 1} / {item.label}
        </div>
        <span className="text-[#ede9df]/24 transition duration-160 ease-out group-hover:translate-x-0.5 group-hover:text-[#d8b15f]">
          →
        </span>
      </div>
      <h2 className="mt-auto pt-10 text-[22px] font-medium leading-[1.02] tracking-[-0.05em] text-[#ede9df] sm:text-[24px]">
        {item.title}
      </h2>
      <p className="mt-3 text-[13px] leading-[1.55] tracking-[-0.01em] text-[#b9b2a5]">
        {item.body}
      </p>
    </Link>
  )
}
