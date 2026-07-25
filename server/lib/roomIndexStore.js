const { readJSON, writeJSON } = require('./storage')
const { roomIndexFile } = require('./paths')

function readAll() {
  const data = readJSON(roomIndexFile, {})
  return data && typeof data === 'object' ? data : {}
}

function getRoomIds(address) {
  const key = String(address).toLowerCase()
  const all = readAll()
  const ids = Array.isArray(all[key]) ? all[key] : []
  return [...new Set(ids.map(Number).filter((n) => Number.isFinite(n) && n > 0))].sort((a, b) => b - a)
}

async function addRoomId(address, roomId) {
  const key = String(address).toLowerCase()
  const id = Number(roomId)
  if (!Number.isFinite(id) || id <= 0) throw new Error('Invalid roomId')
  const all = readAll()
  const current = Array.isArray(all[key]) ? all[key].map(Number) : []
  if (!current.includes(id)) current.push(id)
  all[key] = [...new Set(current)].sort((a, b) => b - a)
  await writeJSON(roomIndexFile, all)
  return all[key]
}

async function backfill(address, roomIds) {
  const key = String(address).toLowerCase()
  const all = readAll()
  const current = Array.isArray(all[key]) ? all[key].map(Number) : []
  const incoming = (roomIds || []).map(Number).filter((n) => Number.isFinite(n) && n > 0)
  all[key] = [...new Set([...current, ...incoming])].sort((a, b) => b - a)
  await writeJSON(roomIndexFile, all)
  return all[key]
}

module.exports = { getRoomIds, addRoomId, backfill, readAll }
