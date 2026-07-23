import { CATEGORIES, CATEGORY_ICON, SORT_OPTIONS } from './marketConstants'

export default function MarketFilters({ search, sort, filter, onSearchChange, onSortChange, onFilterChange }) {
  return (
    <div className="mb-5 border border-[#ede9df]/10 bg-[#20201f] p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <input className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-4 text-[14px] text-[#ede9df] outline-none transition placeholder:text-[#ede9df]/28 focus:border-[#d8b15f]/60" placeholder="Search listings…" value={search} onChange={(event) => onSearchChange(event.target.value)} />
        <select className="h-12 w-full border border-[#ede9df]/12 bg-[#111110] px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#ede9df] outline-none transition focus:border-[#d8b15f]/60" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
        </select>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto border-t border-[#ede9df]/10 pt-3">
        {CATEGORIES.map((category) => (
          <button key={category} onClick={() => onFilterChange(category)} className={`whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${filter === category ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 bg-transparent text-[#ede9df]/52 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}>{category !== 'All' && <span className="mr-1 opacity-60">{CATEGORY_ICON[category]}</span>}{category}</button>
        ))}
      </div>
    </div>
  )
}
