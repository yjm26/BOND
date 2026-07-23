import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch, API_URL } from '../lib/api'
import OfferModal from './OfferModal'
import OffersPanel from './OffersPanel'
import ListingDetailModal from './market/ListingDetailModal'
import MarketFilters from './market/MarketFilters'
import MarketListingForm from './market/MarketListingForm'
import MarketListings from './market/MarketListings'
import MarketSidebar from './market/MarketSidebar'
import MarketToolbar from './market/MarketToolbar'
import { EMPTY_FORM, SOCIAL_OPTIONS } from './market/marketConstants'
import { sortListings } from './market/marketUtils'

export default function Market({ wallet }) {
  const navigate = useNavigate()
  const [listings, setListings] = useState([])
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')
  const [showForm, setShowForm] = useState(false)
  const [loading, setLoading] = useState(true)
  const [offerTarget, setOfferTarget] = useState(null)
  const [showOffers, setShowOffers] = useState(false)
  const [expandedListing, setExpandedListing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [touched, setTouched] = useState({ title: false, price: false })
  const [deleteError, setDeleteError] = useState('')

  const fetchListings = useCallback(async () => {
    try {
      const categoryParam = filter === 'All' ? '' : `?category=${filter}`
      const response = await fetch(`${API_URL}/api/listings${categoryParam}`)
      const data = await response.json()
      setListings(data)
    } catch (error) {
      console.error('Failed to fetch listings:', error)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => { fetchListings() }, [fetchListings])

  useEffect(() => {
    const interval = setInterval(() => fetchListings(), 15000)
    return () => clearInterval(interval)
  }, [fetchListings])

  const sortedListings = useMemo(() => sortListings(listings, search, sort), [listings, search, sort])

  const handleSubmit = async () => {
    setFormError('')
    if (!wallet) { setFormError('Connect your wallet first'); return }
    if (!form.title.trim()) { setTouched((current) => ({ ...current, title: true })); setFormError('Title is required'); return }
    if (!form.price || Number(form.price) <= 0) { setTouched((current) => ({ ...current, price: true })); setFormError('Price must be greater than 0'); return }

    const method = SOCIAL_OPTIONS.find((social) => social.key === form.contactMethod)
    const handle = form.contactHandle.trim()
    if (!handle) { setFormError('Contact handle is required so buyer/seller can reach you'); return }
    const validation = method?.validate?.(handle)
    if (validation) { setFormError(`Contact: ${validation}`); return }

    try {
      await authFetch('/api/listings', {
        method: 'POST',
        body: JSON.stringify({
          role: form.role,
          title: form.title.trim(),
          description: form.description,
          category: form.category,
          price: form.price,
          collateral: form.collateral || '0',
          deliveryDays: Number(form.deliveryDays) || 5,
          dealType: Number(form.dealType) || 0,
          socials: { [form.contactMethod]: handle },
        }),
      }, wallet)
      setForm(EMPTY_FORM)
      setTouched({ title: false, price: false })
      setShowForm(false)
      fetchListings()
    } catch (error) {
      console.error(error)
      setFormError(error.message || 'Failed to post listing')
    }
  }

  const handleDelete = async (id) => {
    setDeleteError('')
    try {
      await authFetch(`/api/listings/${id}`, { method: 'DELETE' }, wallet)
      fetchListings()
    } catch (error) {
      console.error(error)
      setDeleteError(error.message || 'Failed to delete listing. Try again.')
    }
  }

  return (
    <section className="min-h-screen bg-[#050505] px-4 pt-[88px] text-[#ede9df] sm:px-6 lg:px-8">
      <div className="grid min-h-[calc(100vh-88px)] gap-4 pb-4 lg:grid-cols-[260px_1fr]">
        <MarketSidebar wallet={wallet} />

        <main className="overflow-hidden border border-[#ede9df]/10 bg-[#111110]">
          <div className="p-4 sm:p-5 lg:p-6">
            {showForm && (
              <MarketListingForm
                form={form}
                formError={formError}
                setForm={setForm}
                setTouched={setTouched}
                touched={touched}
                onSubmit={handleSubmit}
              />
            )}

            {deleteError && <div className="mb-4 border border-[#c98b4a]/30 bg-[#c98b4a]/10 px-4 py-3 text-[13px] text-[#c98b4a]">{deleteError}</div>}

            <MarketToolbar
              wallet={wallet}
              showOffers={showOffers}
              showForm={showForm}
              onToggleOffers={() => { setShowOffers(!showOffers); setShowForm(false) }}
              onToggleForm={() => { setShowForm(!showForm); setShowOffers(false) }}
            />

            <MarketFilters
              search={search}
              sort={sort}
              filter={filter}
              onSearchChange={setSearch}
              onSortChange={setSort}
              onFilterChange={setFilter}
            />

            <MarketListings
              loading={loading}
              listings={sortedListings}
              search={search}
              wallet={wallet}
              onOpenDeal={setOfferTarget}
              onDelete={handleDelete}
              onExpand={setExpandedListing}
            />

            {showOffers && wallet && <OffersPanel wallet={wallet} API_URL={API_URL} />}
            {offerTarget && wallet && <OfferModal listing={offerTarget} wallet={wallet} onClose={() => setOfferTarget(null)} onSubmitted={() => { setOfferTarget(null); fetchListings() }} />}
            {expandedListing && (
              <ListingDetailModal
                listing={expandedListing}
                wallet={wallet}
                API_URL={API_URL}
                onClose={() => setExpandedListing(null)}
                onOpenDeal={() => { setExpandedListing(null); setOfferTarget(expandedListing) }}
                onDelete={() => { setExpandedListing(null); handleDelete(expandedListing.id) }}
                navigate={navigate}
              />
            )}
          </div>
        </main>
      </div>
    </section>
  )
}
