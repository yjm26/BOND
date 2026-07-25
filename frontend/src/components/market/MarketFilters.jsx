import { CATEGORIES, CATEGORY_ICON, SORT_OPTIONS } from './marketConstants'

export default function MarketFilters({ search, sort, filter, onSearchChange, onSortChange, onFilterChange }) {
  return (
    <div className="mb-5 border border-[var(--a-line)] bg-[var(--a-surface,#111111)] p-3">
      <div className="grid gap-3 lg:grid-cols-[1fr_220px]">
        <input className="h-12 w-full border border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] px-4 text-[14px] text-[var(--a-ink,#fafafa)] outline-none transition placeholder:text-[var(--a-ink,#fafafa)]/28 focus:border-[var(--a-muted,#a3a3a3)]/60" placeholder="Search listings…" value={search} onChange={(event) => onSearchChange(event.target.value)} />
        <select className="h-12 w-full border border-[var(--a-line)] bg-[var(--a-panel,#0a0a0a)] px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--a-ink,#fafafa)] outline-none transition focus:border-[var(--a-muted,#a3a3a3)]/60" value={sort} onChange={(event) => onSortChange(event.target.value)}>
          {SORT_OPTIONS.map((option) => <option key={option.key} value={option.key}>{option.label}</option>)}
        </select>
      </div>
      <div className="mt-3 flex gap-2 overflow-x-auto border-t border-[var(--a-line)] pt-3">
        {CATEGORIES.map((category) => (
          <button key={category} onClick={() => onFilterChange(category)} className={`whitespace-nowrap border px-3 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${filter === category ? 'border-[var(--a-ink,#fafafa)] bg-[var(--a-inverse-bg,#fafafa)] text-[#111111]' : 'border-[var(--a-line)] bg-transparent text-[var(--a-ink,#fafafa)]/52 hover:border-[var(--a-line-strong)] hover:text-[var(--a-ink,#fafafa)]'}`}>{category !== 'All' && <span className="mr-1 opacity-60">{CATEGORY_ICON[category]}</span>}{category}</button>
        ))}
      </div>
    </div>
  )
}
