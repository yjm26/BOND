import { useState } from 'react'
import { LANDING_ROOM_STATES } from './roomStatesData'

/**
 * Room state rail — one next action per state.
 * Hover/focus updates the detail line (decorative, not required for use).
 */
export default function LandingRoomStatesSection() {
  const [active, setActive] = useState(0)
  const detail = LANDING_ROOM_STATES[active]?.detail ?? LANDING_ROOM_STATES[0].detail

  return (
    <section
      id="states"
      className="bg-[#0a0a0a] px-6 py-16 text-[#fafafa] sm:px-10 sm:py-20 lg:px-14 lg:py-24"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 border-b border-[#fafafa]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#737373]">States</div>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(28px,4vw,42px)] font-medium leading-[1.05] tracking-[-0.05em]">
              Each state has one next action.
            </h2>
          </div>
          <p className="max-w-[240px] text-[14px] leading-[1.5] text-[#a3a3a3] sm:text-right">
            Hover a step for the detail line.
          </p>
        </div>

        <div className="mt-9 grid border border-[#fafafa]/10 sm:grid-cols-5">
          {LANDING_ROOM_STATES.map((step, index) => {
            const isActive = index === active
            return (
              <button
                key={step.id}
                type="button"
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                className={`flex min-h-[168px] flex-col border-[#fafafa]/10 px-4 py-5 text-left transition duration-160 ease-out sm:border-r sm:last:border-r-0 ${
                  isActive ? 'bg-[#fafafa]/[0.06] outline outline-1 outline-[#fafafa]/18 -outline-offset-1' : ''
                } ${index < LANDING_ROOM_STATES.length - 1 ? 'border-b sm:border-b-0' : ''}`}
                style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/35">
                  0{index + 1} · {step.label}
                </div>
                <div className="mt-3 text-[18px] font-medium tracking-[-0.03em]">{step.label}</div>
                <div className="mt-auto pt-5 text-[13px] leading-[1.45] text-[#a3a3a3]">
                  <span className="font-medium text-[#fafafa]">
                    {step.id === 'closed' ? 'Ends:' : 'Next:'}
                  </span>{' '}
                  {step.next}
                </div>
              </button>
            )
          })}
        </div>

        <p className="mt-5 max-w-[52ch] text-[13px] leading-[1.5] text-[#fafafa]/45">{detail}</p>
      </div>
    </section>
  )
}
