const evidenceStore = require('../lib/evidenceStore')
const { requireAuth } = require('../lib/auth')
const { parseBody, json } = require('../lib/http')

/**
 * @returns {Promise<boolean>} true if handled
 */
async function handleEvidenceRoutes(req, res, { pathname, origin, url }) {
  if (pathname.startsWith('/api/evidence/') && req.method === 'GET') {
    const roomId = pathname.split('/')[3]
    if (!roomId) {
      json(res, { error: 'roomId required' }, 400, origin)
      return true
    }
    json(res, evidenceStore.listByRoom(roomId), 200, origin)
    return true
  }

  if (pathname === '/api/evidence' && req.method === 'POST') {
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
    const entry = await evidenceStore.addEvidence({
      roomId: body.roomId,
      submitter: auth.verified,
      evidenceType: body.evidenceType,
      description: body.description,
      evidenceRef: body.evidenceRef,
    })
    json(res, entry, 201, origin)
    return true
  }

  return false
}

module.exports = { handleEvidenceRoutes }
