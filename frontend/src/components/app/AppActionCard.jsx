import { Link } from 'react-router-dom'

export default function AppActionCard({ item, index }) {
  return (
    <Link to={item.to} className="group block min-h-[190px] bg-[#111110] p-5 transition hover:bg-[#1a1a18] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#ede9df]/38">0{index + 1} / {item.label}</div>
        <span className="text-[#ede9df]/24 transition group-hover:translate-x-1 group-hover:text-[#d8b15f]">→</span>
      </div>
      <h2 className="mt-12 max-w-[280px] text-[24px] font-medium leading-[0.98] tracking-[-0.055em] text-[#ede9df]">
        {item.title}
      </h2>
      <p className="mt-4 max-w-[300px] text-[13px] leading-[1.6] tracking-[-0.01em] text-[#b9b2a5]">
        {item.body}
      </p>
    </Link>
  )
}
