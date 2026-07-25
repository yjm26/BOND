const { getNonce, requireAuth, verifySignature } = require('../lib/auth')
const { readJSON, writeJSON } = require('../lib/storage')
const { profilesFile, notificationsFile, offersFile, roomCodesFile } = require('../lib/paths')
const { sanitize } = require('../lib/sanitize')
const { parseBody, json } = require('../lib/http')
const { ethers } = require('ethers')

function shapePublicProfile(profile) {
  if (!profile) return null
  return {
    address: profile.address,
    displayName: profile.displayName || '',
    xProfile: profile.xProfile || '',
    discord: profile.discord || '',
    updatedAt: profile.updatedAt || profile.createdAt || 0,
  }
}

async function handleAuthRoutes(req, res, { pathname, origin, url }) {
  if (pathname === '/api/auth/nonce' && req.method === 'GET') {
    const address = url.searchParams.get('address')
    if (!address || !ethers.isAddress(address)) {
      json(res, { error: 'Valid address required' }, 400, origin)
      return true
    }
    const entry = getNonce(address)
    json(res, { nonce: entry.nonce }, 200, origin)
    return true
  }

  if (pathname === '/api/auth/verify' && req.method === 'POST') {
    let body
    try {
      body = await parseBody(req)
    } catch (e) {
      json(res, { error: e.message }, 400, origin)
      return true
    }
    if (!body.address || !body.signature || !body.nonce) {
      json(res, { error: 'address, signature, nonce required' }, 400, origin)
      return true
    }
    const verified = await verifySignature(body)
    if (!verified) {
      json(res, { error: 'Signature verification failed' }, 401, origin)
      return true
    }
    json(res, { ok: true, address: verified }, 200, origin)
    return true
  }

  return false
}

async function handleProfileRoutes(req, res, { pathname, origin }) {
  if (pathname.startsWith('/api/profiles/') && req.method === 'GET') {
    const wallet = pathname.split('/')[3]?.toLowerCase()
    if (!wallet || !ethers.isAddress(wallet)) {
      json(res, { error: 'Valid wallet required' }, 400, origin)
      return true
    }
    const profiles = readJSON(profilesFile, {})
    const profile = shapePublicProfile(profiles[wallet])
    json(res, profile || { address: wallet }, 200, origin)
    return true
  }

  if (pathname === '/api/profiles' && req.method === 'POST') {
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
    const profiles = readJSON(profilesFile, {})
    const existing = profiles[auth.verified] || {}
    profiles[auth.verified] = {
      address: auth.verified,
      displayName: sanitize(body.displayName || '', 80),
      xProfile: sanitize(body.xProfile || '', 80),
      discord: sanitize(body.discord || '', 80),
      createdAt: existing.createdAt || Date.now(),
      updatedAt: Date.now(),
    }
    await writeJSON(profilesFile, profiles)
    json(res, shapePublicProfile(profiles[auth.verified]), 200, origin)
    return true
  }

  return false
}

async function handleNotificationRoutes(req, res, { pathname, origin }) {
  if (pathname.startsWith('/api/notifications/') && pathname.endsWith('/read') && req.method === 'POST') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    const wallet = pathname.split('/')[3]?.toLowerCase()
    if (!wallet) {
      json(res, { error: 'wallet required' }, 400, origin)
      return true
    }
    if (wallet !== auth.verified) {
      json(res, { error: 'Not your notifications' }, 403, origin)
      return true
    }
    const notifs = readJSON(notificationsFile, {})
    if (notifs[wallet]) {
      notifs[wallet] = notifs[wallet].map((n) => ({ ...n, read: true }))
      await writeJSON(notificationsFile, notifs)
    }
    json(res, { ok: true }, 200, origin)
    return true
  }

  if (pathname.startsWith('/api/notifications/') && req.method === 'GET') {
    const wallet = pathname.split('/')[3]?.toLowerCase()
    if (!wallet) {
      json(res, { error: 'wallet required' }, 400, origin)
      return true
    }
    const notifs = readJSON(notificationsFile, {})
    json(res, notifs[wallet] || [], 200, origin)
    return true
  }

  if (pathname === '/api/notifications' && req.method === 'POST') {
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
    if (!body.to || !body.message) {
      json(res, { error: 'to, message required' }, 400, origin)
      return true
    }
    const notifs = readJSON(notificationsFile, {})
    const to = body.to.toLowerCase()
    if (!notifs[to]) notifs[to] = []
    notifs[to].unshift({
      id: Date.now(),
      message: sanitize(body.message, 500),
      listingId: body.listingId || null,
      from: auth.verified,
      read: false,
      createdAt: Date.now(),
    })
    await writeJSON(notificationsFile, notifs)
    json(res, { ok: true }, 201, origin)
    return true
  }

  return false
}

async function handleOfferRoutes(req, res, { pathname, origin, url }) {
  if (pathname === '/api/offers' && req.method === 'POST') {
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
    if (!body.listingId) {
      json(res, { error: 'listingId required' }, 400, origin)
      return true
    }
    const offers = readJSON(offersFile, [])
    const newOffer = {
      id: Date.now(),
      listingId: body.listingId,
      listingTitle: sanitize(body.listingTitle || '', 200),
      listingRole: body.listingRole || 'seller',
      listingCreator: (body.listingCreator || '').toLowerCase(),
      offererWallet: auth.verified,
      offerPrice: body.offerPrice || '0',
      collateral: body.collateral || '0',
      message: sanitize(body.message || '', 1000),
      status: 'pending',
      counterPrice: null,
      counterMessage: null,
      createdAt: Date.now(),
    }
    offers.unshift(newOffer)
    await writeJSON(offersFile, offers)
    const notifs = readJSON(notificationsFile, {})
    const to = newOffer.listingCreator
    if (to) {
      if (!notifs[to]) notifs[to] = []
      notifs[to].unshift({
        id: Date.now(),
        message: `${newOffer.offererWallet.slice(0, 6)}…${newOffer.offererWallet.slice(-4)} offered ${newOffer.offerPrice} USDC on "${newOffer.listingTitle}"`,
        type: 'offer',
        offerId: newOffer.id,
        listingId: newOffer.listingId,
        from: newOffer.offererWallet,
        read: false,
        createdAt: Date.now(),
      })
      await writeJSON(notificationsFile, notifs)
    }
    json(res, newOffer, 201, origin)
    return true
  }

  if (pathname === '/api/offers' && req.method === 'GET') {
    const wallet = url.searchParams.get('wallet')?.toLowerCase()
    const listingId = url.searchParams.get('listingId')
    let offers = readJSON(offersFile, [])
    if (wallet) offers = offers.filter((o) => o.listingCreator === wallet || o.offererWallet === wallet)
    if (listingId) offers = offers.filter((o) => o.listingId == listingId)
    json(res, offers, 200, origin)
    return true
  }

  async function mutateOffer(status, extra = {}) {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    const id = parseInt(pathname.split('/')[3], 10)
    const offers = readJSON(offersFile, [])
    const offer = offers.find((o) => o.id === id)
    if (!offer) {
      json(res, { error: 'Offer not found' }, 404, origin)
      return true
    }
    if (offer.listingCreator !== auth.verified) {
      json(res, { error: 'Not your offer' }, 403, origin)
      return true
    }
    offer.status = status
    Object.assign(offer, extra)
    await writeJSON(offersFile, offers)
    return { offer, auth }
  }

  if (pathname.match(/^\/api\/offers\/\d+\/accept$/) && req.method === 'PUT') {
    const result = await mutateOffer('accepted')
    if (result === true) return true
    const { offer } = result
    const notifs = readJSON(notificationsFile, {})
    const to = offer.offererWallet
    if (!notifs[to]) notifs[to] = []
    notifs[to].unshift({
      id: Date.now(),
      message: `Offer accepted on "${offer.listingTitle}"! Open a room now.`,
      type: 'offer_accepted',
      offerId: offer.id,
      listingId: offer.listingId,
      from: offer.listingCreator,
      read: false,
      createdAt: Date.now(),
    })
    await writeJSON(notificationsFile, notifs)
    json(res, offer, 200, origin)
    return true
  }

  if (pathname.match(/^\/api\/offers\/\d+\/decline$/) && req.method === 'PUT') {
    const result = await mutateOffer('declined')
    if (result === true) return true
    const { offer } = result
    const notifs = readJSON(notificationsFile, {})
    const to = offer.offererWallet
    if (!notifs[to]) notifs[to] = []
    notifs[to].unshift({
      id: Date.now(),
      message: `Offer declined on "${offer.listingTitle}".`,
      type: 'offer_declined',
      offerId: offer.id,
      read: false,
      createdAt: Date.now(),
    })
    await writeJSON(notificationsFile, notifs)
    json(res, offer, 200, origin)
    return true
  }

  if (pathname.match(/^\/api\/offers\/\d+\/counter$/) && req.method === 'PUT') {
    let body
    try {
      body = await parseBody(req)
    } catch (e) {
      json(res, { error: e.message }, 400, origin)
      return true
    }
    const result = await mutateOffer('countered', {
      counterPrice: body.counterPrice,
      counterMessage: sanitize(body.counterMessage || '', 500),
    })
    if (result === true) return true
    const { offer } = result
    if (body.counterPrice) offer.counterPrice = body.counterPrice
    offer.counterMessage = sanitize(body.counterMessage || '', 500)
    const offers = readJSON(offersFile, [])
    const idx = offers.findIndex((o) => o.id === offer.id)
    if (idx >= 0) {
      offers[idx] = offer
      await writeJSON(offersFile, offers)
    }
    const notifs = readJSON(notificationsFile, {})
    const to = offer.offererWallet
    if (!notifs[to]) notifs[to] = []
    notifs[to].unshift({
      id: Date.now(),
      message: `Counter-offer on "${offer.listingTitle}": ${offer.counterPrice} USDC — "${offer.counterMessage}"`,
      type: 'offer_counter',
      offerId: offer.id,
      listingId: offer.listingId,
      from: offer.listingCreator,
      read: false,
      createdAt: Date.now(),
    })
    await writeJSON(notificationsFile, notifs)
    json(res, offer, 200, origin)
    return true
  }

  return false
}

async function handleRoomCodeRoutes(req, res, { pathname, origin, url }) {
  if (pathname === '/api/room-codes' && req.method === 'POST') {
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
    if (!body.roomId || !body.joinCode || !body.counterparty) {
      json(res, { error: 'Missing fields' }, 400, origin)
      return true
    }
    const codes = readJSON(roomCodesFile, [])
    if (!codes.find((c) => String(c.roomId) === String(body.roomId))) {
      codes.push({
        roomId: String(body.roomId),
        joinCode: sanitize(body.joinCode, 100),
        creator: auth.verified,
        counterparty: body.counterparty.toLowerCase(),
        listingId: body.listingId || null,
        item: sanitize(body.item || '', 200),
        price: body.price || '',
        createdAt: Date.now(),
      })
      await writeJSON(roomCodesFile, codes)
    }
    json(res, { ok: true }, 200, origin)
    return true
  }

  if (pathname === '/api/room-codes' && req.method === 'GET') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    const codes = readJSON(roomCodesFile, [])
    const roomId = url.searchParams.get('roomId')
    if (roomId) {
      const code = codes.find(
        (c) => String(c.roomId) === String(roomId) && (c.creator === auth.verified || c.counterparty === auth.verified),
      )
      json(res, code ? [code] : [], 200, origin)
      return true
    }
    const pending = codes.filter((c) => c.counterparty === auth.verified)
    json(res, pending, 200, origin)
    return true
  }

  return false
}

module.exports = {
  handleAuthRoutes,
  handleProfileRoutes,
  handleNotificationRoutes,
  handleOfferRoutes,
  handleRoomCodeRoutes,
}
