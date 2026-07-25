const fs = require('fs')
const path = require('path')

/** @type {Map<string, Promise<unknown>>} */
const queues = new Map()

function readJSON(file, fallback) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'))
  } catch {
    return fallback
  }
}

function writeJSONSync(file, data) {
  fs.mkdirSync(path.dirname(file), { recursive: true })
  const tmp = `${file}.${process.pid}.tmp`
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2))
  fs.renameSync(tmp, file)
}

function writeJSON(file, data) {
  const prev = queues.get(file) || Promise.resolve()
  const next = prev
    .catch(() => {})
    .then(() => {
      writeJSONSync(file, data)
    })
  queues.set(file, next)
  return next
}

async function updateJSON(file, fallback, updater) {
  const prev = queues.get(file) || Promise.resolve()
  let result
  const next = prev.catch(() => {}).then(async () => {
    const current = readJSON(file, fallback)
    result = await updater(current)
    const toWrite = result && Object.prototype.hasOwnProperty.call(result, '__data')
      ? result.__data
      : result
    writeJSONSync(file, toWrite)
    return result
  })
  queues.set(file, next)
  await next
  return result
}

module.exports = { readJSON, writeJSON, writeJSONSync, updateJSON }
