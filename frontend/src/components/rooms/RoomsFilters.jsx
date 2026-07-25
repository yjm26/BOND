import { ROOM_FILTERS } from './roomsConstants'

export default function RoomsFilters({ filter, onFilterChange, hasRooms }) {
  if (!hasRooms) return null
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto border border-[#fafafa]/10 bg-[#111111] p-2">
      {ROOM_FILTERS.map((item) => (
        <button key={item.key} onClick={() => onFilterChange(item.key)} className={`whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${filter === item.key ? 'border-[#fafafa] bg-[#fafafa] text-[#111111]' : 'border-[#fafafa]/12 text-[#fafafa]/52 hover:border-[#fafafa]/34 hover:text-[#fafafa]'}`}>
          {item.label}
        </button>
      ))}
    </div>
  )
}
