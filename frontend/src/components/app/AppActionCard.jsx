import { Link } from 'react-router-dom'

export default function AppActionCard({ item, index }) {
  return (
    <Link to={item.to} className="group block border border-[#171716]/14 bg-[#f4f0e7] p-5 transition hover:border-[#171716]/32 hover:bg-[#ede9df] sm:p-6">
      <div className="flex items-start justify-between gap-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#6f6b62]">0{index + 1} / {item.label}</div>
        <span className="text-[#171716]/32 transition group-hover:translate-x-1 group-hover:text-[#171716]">→</span>
      </div>
      <h2 className="mt-14 max-w-[360px] text-[30px] font-medium leading-[0.98] tracking-[-0.06em] text-[#171716]">
        {item.title}
      </h2>
      <p className="mt-4 max-w-[340px] text-[14px] leading-[1.62] tracking-[-0.01em] text-[#5f5a50]">
        {item.body}
      </p>
    </Link>
  )
}
