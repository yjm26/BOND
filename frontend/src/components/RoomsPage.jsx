import { useMemo, useState } from 'react'
import useOwnedRooms from '../hooks/useOwnedRooms'
import RoomList from './rooms/RoomList'
import RoomsFilters from './rooms/RoomsFilters'
import RoomsLoadingState from './rooms/RoomsLoadingState'
import RoomsToolbar from './rooms/RoomsToolbar'
import { filterRoomsByState } from './rooms/roomsUtils'

export default function RoomsPage({ wallet }) {
  const [filter, setFilter] = useState('active')
  const { rooms, loading, isRefreshing } = useOwnedRooms(wallet)
  const filteredRooms = useMemo(() => filterRoomsByState(rooms, filter), [rooms, filter])

  return (
    <section className="min-h-screen bg-[var(--a-bg)] px-4 pt-[88px] text-[var(--a-ink)] sm:px-6 lg:px-8">
      <div className="pb-4">
        <main className="overflow-hidden border border-[var(--a-line)] bg-[var(--a-panel)]">
          <div className="p-4 sm:p-5 lg:p-6">
            <RoomsToolbar wallet={wallet} isRefreshing={isRefreshing && !loading} />
            {!loading && <RoomsFilters filter={filter} onFilterChange={setFilter} hasRooms={rooms.length > 0} />}
            {loading ? <RoomsLoadingState /> : <RoomList rooms={filteredRooms} wallet={wallet} />}
          </div>
        </main>
      </div>
    </section>
  )
}
