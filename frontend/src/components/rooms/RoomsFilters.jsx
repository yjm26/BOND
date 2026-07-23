import { ROOM_FILTERS } from './roomsConstants'

export default function RoomsFilters({ filter, onFilterChange, hasRooms }) {
  if (!hasRooms) return null
  return (
    <div className="mb-5 flex gap-2 overflow-x-auto border border-[#ede9df]/10 bg-[#20201f] p-2">
      {ROOM_FILTERS.map((item) => (
        <button key={item.key} onClick={() => onFilterChange(item.key)} className={`whitespace-nowrap border px-4 py-2 font-mono text-[10px] uppercase tracking-[0.16em] transition ${filter === item.key ? 'border-[#ede9df] bg-[#ede9df] text-[#20201f]' : 'border-[#ede9df]/12 text-[#ede9df]/52 hover:border-[#ede9df]/34 hover:text-[#ede9df]'}`}>
          {item.label}
        </button>
      ))}
    </div>
  )
}
