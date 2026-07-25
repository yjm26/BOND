const { ethers } = require('ethers')
const { readJSON, writeJSON } = require('../lib/storage')
const { listingsFile } = require('../lib/paths')
const { sanitize } = require('../lib/sanitize')
const { requireAuth } = require('../lib/auth')
const { parseBody, json } = require('../lib/http')

const LISTING_TTL_MS = 30 * 24 * 60 * 60 * 1000

function isExpiredListing(listing) {
  const expiresAt = listing.expiresAt || ((listing.createdAt || 0) + LISTING_TTL_MS)
  return !listing.taken && expiresAt <= Date.now()
}

function readListings() {
  const listings = readJSON(listingsFile, [])
  const list = Array.isArray(listings) ? listings : []
  const activeListings = list.filter((listing) => !isExpiredListing(listing))
  if (activeListings.length !== list.length) {
    writeJSON(listingsFile, activeListings)
  }
  return activeListings
}

/**
 * Who may mark a listing taken:
 * - listing creator, or
 * - any authenticated wallet opening a room against an untaken listing (market counterparty flow)
 */
function canMarkTaken(listing, verified) {
  if (!listing || !verified) return false
  if (listing.creator?.toLowerCase() === verified) return true
  if (!listing.taken) return true
  return false
}

async function handleListingsRoutes(req, res, { pathname, origin, url }) {
  if (pathname === '/api/listings' && req.method === 'GET') {
    const category = url.searchParams.get('category')
    const role = url.searchParams.get('role')
    const q = url.searchParams.get('q')?.toLowerCase()
    let listings = readListings()
    if (category && category !== 'All') listings = listings.filter((l) => l.category === category)
    if (role && role !== 'all') listings = listings.filter((l) => l.role === role)
    if (q) {
      listings = listings.filter(
        (l) => l.title.toLowerCase().includes(q) || l.description?.toLowerCase().includes(q),
      )
    }
    json(res, listings, 200, origin)
    return true
  }

  if (pathname === '/api/listings' && req.method === 'POST') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    let body
    try {
      body = await parseBody(req)
    } catch (e) {
      json(res, { error: e.message }, 400, origin)
      return true
    }
    if (!body.title || !body.price) {
      json(res, { error: 'title, price required' }, 400, origin)
      return true
    }
    const listings = readListings()
    const newListing = {
      id: Date.now(),
      role: body.role || 'seller',
      title: sanitize(body.title, 200),
      description: sanitize(body.description || '', 2000),
      category: sanitize(body.category || 'Other', 50),
      price: body.price,
      collateral: body.collateral || '0',
      creator: auth.verified,
      socials: body.socials
        ? {
            twitter: sanitize(body.socials.twitter || '', 100) || undefined,
            telegram: sanitize(body.socials.telegram || '', 100) || undefined,
            discord: sanitize(body.socials.discord || '', 100) || undefined,
          }
        : undefined,
      createdAt: Date.now(),
      expiresAt: Date.now() + LISTING_TTL_MS,
    }
    listings.unshift(newListing)
    await writeJSON(listingsFile, listings)
    json(res, newListing, 201, origin)
    return true
  }

  if (pathname.startsWith('/api/listings/') && pathname.endsWith('/taken') && req.method === 'PUT') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    const id = parseInt(pathname.split('/')[3], 10)
    let body
    try {
      body = await parseBody(req)
    } catch (e) {
      json(res, { error: e.message }, 400, origin)
      return true
    }
    const listings = readListings()
    const listing = listings.find((l) => l.id === id)
    if (!listing) {
      json(res, { error: 'Not found' }, 404, origin)
      return true
    }
    if (!body.roomId) {
      json(res, { error: 'roomId required' }, 400, origin)
      return true
    }
    if (listing.taken && listing.takenRoomId && String(listing.takenRoomId) !== String(body.roomId)) {
      json(res, { error: 'Listing already taken' }, 409, origin)
      return true
    }
    if (listing.taken && String(listing.takenRoomId) === String(body.roomId)) {
      json(res, listing, 200, origin)
      return true
    }
    if (!canMarkTaken(listing, auth.verified)) {
      json(res, { error: 'Not allowed to mark listing taken' }, 403, origin)
      return true
    }
    listing.taken = true
    listing.takenBy = auth.verified
    listing.takenRoomId = String(body.roomId)
    listing.takenAt = Date.now()
    await writeJSON(listingsFile, listings)
    json(res, listing, 200, origin)
    return true
  }

  if (pathname.startsWith('/api/listings/') && req.method === 'DELETE') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    const id = parseInt(pathname.split('/')[3], 10)
    const listings = readListings()
    const idx = listings.findIndex((l) => l.id === id)
    if (idx === -1) {
      json(res, { error: 'Not found' }, 404, origin)
      return true
    }
    if (listings[idx].creator.toLowerCase() !== auth.verified) {
      json(res, { error: 'Not your listing' }, 403, origin)
      return true
    }
    listings.splice(idx, 1)
    await writeJSON(listingsFile, listings)
    json(res, { ok: true }, 200, origin)
    return true
  }

  return false
}

module.exports = { handleListingsRoutes, readListings, canMarkTaken, LISTING_TTL_MS }
