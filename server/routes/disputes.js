const disputesStore = require('../lib/disputesStore')
const { requireAuth } = require('../lib/auth')
const { parseBody, json } = require('../lib/http')

async function handleDisputesRoutes(req, res, { pathname, origin, url }) {
  if (pathname === '/api/disputes' && req.method === 'GET') {
    const status = url.searchParams.get('status') || undefined
    json(res, disputesStore.list({ status }), 200, origin)
    return true
  }

  if (pathname.startsWith('/api/disputes/') && req.method === 'GET') {
    const roomId = pathname.split('/')[3]
    const row = disputesStore.getByRoom(roomId)
    if (!row) {
      json(res, { error: 'Not found' }, 404, origin)
      return true
    }
    json(res, row, 200, origin)
    return true
  }

  if (pathname === '/api/disputes' && req.method === 'POST') {
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
    if (!body.roomId) {
      json(res, { error: 'roomId required' }, 400, origin)
      return true
    }
    const row = await disputesStore.upsertOpen({
      roomId: body.roomId,
      item: body.item,
      price: body.price,
      collateral: body.collateral,
      creator: body.creator,
      counterparty: body.counterparty,
      disputedBy: auth.verified,
      reason: body.reason,
      evidenceRef: body.evidenceRef,
    })
    json(res, row, 201, origin)
    return true
  }

  if (pathname.match(/^\/api\/disputes\/[^/]+\/resolve$/) && req.method === 'POST') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    const roomId = pathname.split('/')[3]
    let body = {}
    try {
      body = await parseBody(req)
    } catch {
      body = {}
    }
    const row = await disputesStore.markResolved(roomId, {
      resolvedBy: auth.verified,
      resolution: body.resolution || 'on-chain',
    })
    if (!row) {
      json(res, { error: 'Not found' }, 404, origin)
      return true
    }
    json(res, row, 200, origin)
    return true
  }

  return false
}

module.exports = { handleDisputesRoutes }
