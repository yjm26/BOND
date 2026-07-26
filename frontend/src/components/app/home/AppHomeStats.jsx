import { ROOM_FILTER_MAP } from '../../rooms/roomsConstants'

const LIFECYCLE = ['Created', 'Funded', 'Delivered', 'Released']

/**
 * Home top-right slot — adaptive, always relevant.
 * - 0 rooms: the room lifecycle as a dry mechanism strip (orient a first-timer,
 *   no extra CTA — Create already lives in nav + action grid + open-rooms).
 * - >=1 room: real at-a-glance counts. Monochrome numerals; disputed uses copper.
 */
export default function AppHomeStats({ rooms, loading }) {
  const list = Array.isArray(rooms) ? rooms : []
  const count = (bucket) => list.filter((r) => ROOM_FILTER_MAP[bucket].includes(r.state)).length
  const disputed = list.filter((r) => r.state === 'Disputed').length

  // Empty state → lifecycle, not zeroes.
  if (!loading && list.length === 0) {
    return (
      <div className="flex flex-col border border-[var(--a-line-strong)] bg-[var(--a-chip)] p-5 sm:p-6">
        <div className="font-mono text-[10px] uppercase tracking-[0.22em] text-[var(--a-muted)]">
          Room lifecycle
        </div>
        <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1.5">
          {LIFECYCLE.map((step, i) => (
            <span key={step} className="flex items-center gap-2 whitespace-nowrap">
              <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-[var(--a-ink)]">
                {step}
              </span>
              {i < LIFECYCLE.length - 1 && (
                <span className="font-mono text-[11px] text-[color:var(--a-faint)]">→</span>
              )}
            </span>
          ))}
        </div>
        <p className="mt-auto pt-5 text-[13px] leading-[1.55] text-[var(--a-muted)]">
          Funds lock on <span className="text-[var(--a-ink)]">Funded</span> and stay locked until release. Refund or
          dispute ends the room early.
        </p>
      </div>
    )
  }

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
