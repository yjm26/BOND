import { useCallback, useEffect, useState } from 'react'
import { API_URL } from '../../lib/api'
import PublicListingDetail from './PublicListingDetail'
import PublicListingsFilters from './PublicListingsFilters'
import PublicListingsGrid from './PublicListingsGrid'
import PublicListingsHeader from './PublicListingsHeader'
import { usePublicListings } from './usePublicListings'

export default function PublicListings() {
  const [rawListings, setRawListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState(null)
  const view = usePublicListings(rawListings)

  const fetchListings = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/listings`)
      const data = await response.json()
      setRawListings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Failed to fetch public listings:', error)
      setRawListings([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchListings()
    const interval = setInterval(fetchListings, 20000)
    return () => clearInterval(interval)
  }, [fetchListings])

  return (
    <section className="min-h-screen bg-[#fafafa] px-6 pb-20 pt-[92px] text-[#0a0a0a] sm:px-10 lg:px-14">
      <div className="mx-auto max-w-[1180px]">
        <PublicListingsHeader />

        <PublicListingsFilters
          search={view.search}
          sort={view.sort}
          filter={view.filter}
          categories={view.categories}
          onSearchChange={view.setSearch}
          onSortChange={view.setSort}
          onFilterChange={view.setFilter}
        />

        <PublicListingsGrid
          loading={loading}
          listings={view.listings}
          totalCount={rawListings.length}
          onOpen={setSelected}
        />
      </div>

      {selected && <PublicListingDetail listing={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
