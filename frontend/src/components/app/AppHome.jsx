import useOwnedRooms from '../../hooks/useOwnedRooms'
import AppHomeActionGrid from './home/AppHomeActionGrid'
import AppHomeOpenRooms from './home/AppHomeOpenRooms'
import AppHomeProfilePanel from './home/AppHomeProfilePanel'
import AppHomeStats from './home/AppHomeStats'
import useDisputeAccess from './useDisputeAccess'
import { visibleAppActions } from './appHomeData'

export default function AppHome({ wallet, profile }) {
  const name = profile?.displayName || 'BOND member'
  const canAccessDisputes = useDisputeAccess(wallet)
  const actions = visibleAppActions(canAccessDisputes)
  const { rooms, loading: roomsLoading } = useOwnedRooms(wallet)

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] pb-6 text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="pb-0">

        <main className="flex flex-col overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)]">
          <div className="border-b border-[var(--a-line)] p-5 sm:p-6 lg:p-7">
            <div className="font-mono text-[10px] uppercase tracking-[0.28em] text-[var(--a-muted)]">Home</div>
            <h1 className="mt-3 max-w-[780px] text-[clamp(36px,5.2vw,64px)] font-medium leading-[0.92] tracking-[-0.07em]">
              Good to see you, {name}.
            </h1>
          </div>

          <div className="grid gap-4 p-4 sm:p-5 lg:grid-cols-2 lg:p-5">
            <AppHomeProfilePanel profile={profile} name={name} />
            <AppHomeStats rooms={rooms} loading={roomsLoading} />
          </div>

          <AppHomeActionGrid actions={actions} />
          <AppHomeOpenRooms rooms={rooms} loading={roomsLoading} />
        </main>
      </div>
    </section>
  )
}
