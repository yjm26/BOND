import { useMemo, useState } from 'react'
import { CATEGORIES } from '../market/marketConstants'
import { sortListings } from '../market/marketUtils'

export function usePublicListings(listings) {
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')
  const [sort, setSort] = useState('newest')

  const filtered = useMemo(() => {
    const byCategory =
      filter === 'All' ? listings : listings.filter((item) => item.category === filter)
    // Public page focuses on what people can still act on.
    const activeFirst = byCategory.filter((item) => !item.taken)
    const taken = byCategory.filter((item) => item.taken)
    return sortListings([...activeFirst, ...taken], search, sort)
  }, [listings, filter, search, sort])

  return {
    search,
    setSearch,
    filter,
    setFilter,
    sort,
    setSort,
    categories: CATEGORIES,
    listings: filtered,
  }
}
