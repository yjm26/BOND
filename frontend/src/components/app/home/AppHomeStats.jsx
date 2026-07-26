import { ROOM_FILTER_MAP } from '../../rooms/roomsConstants'

/**
 * Home "at a glance" — real room counts, not description.
 * Monochrome numerals. Disputed uses the copper accent already used app-wide.
 */
export default function AppHomeStats({ rooms, loading }) {
  const list = Array.isArray(rooms) ? rooms : []
  const count = (bucket) => list.filter((r) => ROOM_FILTER_MAP[bucket].includes(r.state)).length
  const disputed = list.filter((r) => r.state === 'Disputed').length

  const stats = [
    { label: 'Active', value: count('active') },
    { label: 'Disputed', value: disputed, danger: true },
    { label: 'Released', value: count('completed') },
    { label: 'Total', value: list.length },
  ]

  return (
    <div className="border border-[var(--a-line-strong)] bg-[var(--a-chip)] p-5 sm:p-6">
      <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">At a glance</div>
      <div className="mt-5 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label}>
            <div
              className={`font-mono text-[28px] leading-none tracking-[-0.04em] tabular-nums ${
                s.danger && s.value > 0 ? 'text-[#b87333]' : 'text-[var(--a-ink)]'
              }`}
            >
              {loading ? '—' : s.value}
            </div>
            <div className="mt-2 font-mono text-[9px] uppercase tracking-[0.16em] text-[color:var(--a-faint)]">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
