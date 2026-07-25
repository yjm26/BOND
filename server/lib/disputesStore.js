const { readJSON, writeJSON } = require('./storage')
const { disputesFile } = require('./paths')
const { sanitize } = require('./sanitize')

function readAll() {
  const data = readJSON(disputesFile, [])
  return Array.isArray(data) ? data : []
}

function list({ status } = {}) {
  let rows = readAll()
  if (status) rows = rows.filter((d) => d.status === status)
  return rows
}

function getByRoom(roomId) {
  const key = String(roomId)
  return readAll().find((d) => String(d.roomId) === key) || null
}

async function upsertOpen(input) {
  const roomId = String(input.roomId)
  const rows = readAll()
  const idx = rows.findIndex((d) => String(d.roomId) === roomId)
  const base = {
    roomId,
    item: sanitize(input.item || '', 200),
    price: String(input.price || ''),
    collateral: String(input.collateral || '0'),
    creator: String(input.creator || '').toLowerCase(),
    counterparty: String(input.counterparty || '').toLowerCase(),
    disputedBy: String(input.disputedBy || '').toLowerCase(),
    reason: sanitize(input.reason || '', 500),
    evidenceRef: sanitize(input.evidenceRef || '', 300),
    status: 'open',
    updatedAt: Date.now(),
  }

  if (idx >= 0) {
    rows[idx] = {
      ...rows[idx],
      ...base,
      createdAt: rows[idx].createdAt || Date.now(),
    }
    await writeJSON(disputesFile, rows)
    return rows[idx]
  }

  const row = { id: Date.now(), ...base, createdAt: Date.now() }
  rows.unshift(row)
  await writeJSON(disputesFile, rows)
  return row
}

async function markResolved(roomId, extra = {}) {
  const key = String(roomId)
  const rows = readAll()
  const idx = rows.findIndex((d) => String(d.roomId) === key)
  if (idx < 0) return null
  rows[idx] = {
    ...rows[idx],
    status: 'resolved',
    updatedAt: Date.now(),
    ...extra,
  }
  await writeJSON(disputesFile, rows)
  return rows[idx]
}

module.exports = { list, getByRoom, upsertOpen, markResolved, readAll }
