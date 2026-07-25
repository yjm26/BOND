const { readJSON, writeJSON } = require('./storage')
const { evidenceFile } = require('./paths')
const { sanitize } = require('./sanitize')

function readAll() {
  return readJSON(evidenceFile, {})
}

function listByRoom(roomId) {
  const key = String(roomId)
  const all = readAll()
  return Array.isArray(all[key]) ? all[key] : []
}

async function addEvidence({ roomId, submitter, evidenceType, description, evidenceRef }) {
  const key = String(roomId)
  const all = readAll()
  if (!all[key]) all[key] = []
  const entry = {
    id: Date.now(),
    roomId: key,
    submitter: String(submitter).toLowerCase(),
    evidenceType: sanitize(evidenceType || 'text', 48),
    description: sanitize(description || '', 500),
    evidenceRef: sanitize(evidenceRef || '', 300),
    timestamp: Date.now(),
  }
  all[key].unshift(entry)
  await writeJSON(evidenceFile, all)
  return entry
}

module.exports = { listByRoom, addEvidence, readAll }
