const path = require('path')

// Repo root (…/BOND), same default as legacy server.js using __dirname at root
const STORAGE_DIR = process.env.DATA_DIR || process.env.RENDER_DISK_MOUNT_PATH || path.resolve(__dirname, '..', '..')

module.exports = {
  STORAGE_DIR,
  listingsFile: path.join(STORAGE_DIR, 'listings.json'),
  notificationsFile: path.join(STORAGE_DIR, 'notifications.json'),
  offersFile: path.join(STORAGE_DIR, 'offers.json'),
  roomCodesFile: path.join(STORAGE_DIR, 'room_codes.json'),
  profilesFile: path.join(STORAGE_DIR, 'profiles.json'),
  evidenceFile: path.join(STORAGE_DIR, 'evidence.json'),
  disputesFile: path.join(STORAGE_DIR, 'disputes.json'),
  roomIndexFile: path.join(STORAGE_DIR, 'room_index.json'),
}
