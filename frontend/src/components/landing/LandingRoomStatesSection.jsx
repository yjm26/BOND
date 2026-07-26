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
      className="bg-[#0a0a0a] px-4 pt-14 pb-10 text-[#fafafa] sm:px-10 sm:pt-16 sm:pb-12 lg:px-14 lg:pt-20 lg:pb-14"
    >
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-col gap-6 border-b border-[#fafafa]/10 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[#8f8f8f]">States</div>
            <h2 className="mt-3 max-w-[16ch] text-[clamp(28px,4vw,42px)] font-medium leading-[1.05] tracking-[-0.05em]">
              Each state has one next action.
            </h2>
          </div>
          <p className="max-w-[280px] text-[14px] leading-[1.5] text-[#a3a3a3] sm:text-right">
            <span className="sm:hidden">Tap a step for the detail line.</span>
            <span className="hidden sm:inline">Tap a step for the detail line.</span>
          </p>
        </div>

        {/* Mobile: horizontal snap rail. sm+: 5-col grid. */}
        <div className="mt-8 sm:mt-9">
          <div className="relative">
            {/* right-edge peek fade — signals swipe on mobile only. Solid for the first ~70% so the peeking label ("02 · JOINE…") reads as a soft hint, not a mid-word crop. */}
            <div
              className="pointer-events-none absolute inset-y-0 -right-4 z-10 w-40 sm:hidden"
              style={{ background: 'linear-gradient(to left, #0a0a0a 0%, #0a0a0a 72%, transparent 100%)' }}
            />
            <div className="-mx-6 flex gap-0 overflow-x-auto overscroll-x-contain border-y border-[#fafafa]/14 px-6 snap-x snap-mandatory sm:mx-0 sm:grid sm:grid-cols-5 sm:overflow-visible sm:border sm:border-[#fafafa]/14 sm:px-0 sm:snap-none">
            {LANDING_ROOM_STATES.map((step, index) => {
              const isActive = index === active
              return (
                <button
                  key={step.id}
                  type="button"
                  onFocus={() => setActive(index)}
                  onClick={() => setActive(index)}
                  className={`flex w-[min(78vw,280px)] shrink-0 snap-center flex-col border-[#fafafa]/10 px-4 py-5 text-left transition duration-160 ease-out active:scale-[0.99] sm:w-auto sm:min-h-[156px] sm:border-r sm:last:border-r-0 ${
                    isActive ? 'bg-[#fafafa]/[0.06] outline outline-1 outline-[#fafafa]/18 -outline-offset-1' : ''
                  } ${
                    index < LANDING_ROOM_STATES.length - 1
                      ? 'border-r sm:border-r'
                      : ''
                  }`}
                  style={{ transitionTimingFunction: 'cubic-bezier(0.23, 1, 0.32, 1)' }}
                >
                  <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#fafafa]/50">
                    0{index + 1} · {step.label}
                  </div>
                  <div className="mt-3 text-[18px] font-medium tracking-[-0.03em]">{step.label}</div>
                  <div className="mt-4 pt-1 text-[13px] leading-[1.45] text-[#a3a3a3] sm:mt-auto sm:pt-5">
                    <span className="font-medium text-[#fafafa]">
                      {step.id === 'closed' ? 'Ends:' : 'Next:'}
                    </span>{' '}
                    {step.next}
                  </div>
                </button>
              )
            })}
            </div>
          </div>
          <div className="mt-3 flex justify-center gap-1.5 sm:hidden" aria-hidden="true">
            {LANDING_ROOM_STATES.map((step, index) => (
              <span
                key={step.id}
                className={`h-1 w-1 rounded-full ${index === active ? 'bg-[#fafafa]' : 'bg-[#fafafa]/25'}`}
              />
            ))}
          </div>
        </div>

        <p className="mt-5 max-w-[52ch] text-[13px] leading-[1.5] text-[#fafafa]/45">{detail}</p>
      </div>
    </section>
  )
}
