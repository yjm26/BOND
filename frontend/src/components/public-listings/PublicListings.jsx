import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
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

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border border-[#0a0a0a]/10 bg-white px-4 py-3">
          <p className="text-[13px] leading-[1.5] text-[#525252]">
            No wallet needed to browse. Connect only when you want to act.
          </p>
          <Link
            to="/app"
            className="inline-flex h-10 items-center border border-[#0a0a0a] bg-[#0a0a0a] px-4 font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-[#fafafa] transition duration-160 ease-out hover:bg-transparent hover:text-[#0a0a0a] active:scale-[0.97]"
          >
            Go to app
          </Link>
        </div>

        <PublicListingsFilters
          search={view.search}
          sort={view.sort}
          filter={view.filter}
          categories={view.categories}
          onSearchChange={view.setSearch}
          onSortChange={view.setSort}
          onFilterChange={view.setFilter}
        />

        <PublicListingsGrid loading={loading} listings={view.listings} onOpen={setSelected} />
      </div>

      {selected && <PublicListingDetail listing={selected} onClose={() => setSelected(null)} />}
    </section>
  )
}
