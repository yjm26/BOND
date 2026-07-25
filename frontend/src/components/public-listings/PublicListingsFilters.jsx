import { SORT_OPTIONS } from '../market/marketConstants'

export default function PublicListingsFilters({
  search,
  sort,
  filter,
  categories,
  onSearchChange,
  onSortChange,
  onFilterChange,
}) {
  return (
    <div className="mt-8 space-y-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <input
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search listings"
          className="h-11 w-full border border-[#0a0a0a]/14 bg-[#fafafa] px-4 text-[14px] text-[#0a0a0a] outline-none placeholder:text-[#0a0a0a]/35 focus:border-[#0a0a0a]/40 lg:max-w-[360px]"
        />
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="h-11 border border-[#0a0a0a]/14 bg-[#fafafa] px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-[#0a0a0a] outline-none focus:border-[#0a0a0a]/40"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.key} value={option.key}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const active = filter === category
          return (
            <button
              key={category}
              type="button"
              onClick={() => onFilterChange(category)}
              className={`h-9 border px-3 font-mono text-[10px] uppercase tracking-[0.14em] transition duration-160 ease-out active:scale-[0.97] ${
                active
                  ? 'border-[#0a0a0a] bg-[#0a0a0a] text-[#fafafa]'
                  : 'border-[#0a0a0a]/14 text-[#0a0a0a]/62 hover:border-[#0a0a0a]/34 hover:text-[#0a0a0a]'
              }`}
            >
              {category}
            </button>
          )
        })}
      </div>
    </div>
  )
}
