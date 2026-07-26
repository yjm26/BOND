/**
 * Load local/deploy/deploy.env into process.env.
 *
 * hardhat.config.js reads process.env.PRIVATE_KEY when it builds the network
 * `accounts` array, and that happens before any script runs. Requiring this
 * file from the config is what makes `ethers.getSigners()` non-empty — without
 * it a deploy fails with "Cannot read properties of undefined (reading 'address')".
 */
const fs = require('fs')
const path = require('path')

const envPath = path.join(__dirname, '..', 'local', 'deploy', 'deploy.env')

if (fs.existsSync(envPath)) {
  for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const key = t.slice(0, i).trim()
    const value = t.slice(i + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

module.exports = { envPath }
