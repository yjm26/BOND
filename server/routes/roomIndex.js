const roomIndexStore = require('../lib/roomIndexStore')
const { requireAuth } = require('../lib/auth')
const { parseBody, json } = require('../lib/http')

async function handleRoomIndexRoutes(req, res, { pathname, origin }) {
  if (pathname === '/api/room-index' && req.method === 'GET') {
    const auth = await requireAuth(req)
    if (auth.error) {
      json(res, { error: auth.error }, auth.status, origin)
      return true
    }
    json(res, { roomIds: roomIndexStore.getRoomIds(auth.verified) }, 200, origin)
    return true
  }

  if (pathname === '/api/room-index' && req.method === 'POST') {
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
    try {
      const roomIds = await roomIndexStore.addRoomId(auth.verified, body.roomId)
      json(res, { roomIds }, 200, origin)
    } catch (e) {
      json(res, { error: e.message }, 400, origin)
    }
    return true
  }

  if (pathname === '/api/room-index/backfill' && req.method === 'POST') {
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
    const roomIds = await roomIndexStore.backfill(auth.verified, body.roomIds || [])
    json(res, { roomIds }, 200, origin)
    return true
  }

  return false
}

module.exports = { handleRoomIndexRoutes }
