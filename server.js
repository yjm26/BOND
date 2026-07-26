const http = require('http')
const fs = require('fs')
const path = require('path')

const { corsHeaders } = require('./server/lib/cors')
const { json } = require('./server/lib/http')
const { handleEvidenceRoutes } = require('./server/routes/evidence')
const { handleDisputesRoutes } = require('./server/routes/disputes')
const { handleRoomIndexRoutes } = require('./server/routes/roomIndex')
const { handleListingsRoutes } = require('./server/routes/listings')
const {
  handleAuthRoutes,
  handleProfileRoutes,
  handleNotificationRoutes,
  handleOfferRoutes,
  handleRoomCodeRoutes,
} = require('./server/routes/legacy')

const PORT = process.env.PORT || 3001
const STATIC_DIR = path.join(__dirname, 'frontend', 'dist')
const CONTENT_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.woff2': 'font/woff2',
}

function serveStatic(res, pathname) {
  const safePath = path.normalize(pathname).replace(/^\/+/, '')
  let filePath = path.join(STATIC_DIR, safePath)
  if (!filePath.startsWith(STATIC_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain; charset=utf-8' })
    return res.end('Forbidden')
  }

  if (pathname === '/' || !path.extname(filePath)) {
    filePath = path.join(STATIC_DIR, 'index.html')
  }

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Only SPA routes (extensionless paths) fall back to index.html.
      // A missing file with an extension is a real 404 — never a soft-404,
      // which would make crawlers index HTML as robots.txt/sitemap.xml/assets.
      if (path.extname(filePath) && path.basename(filePath) !== 'index.html') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
        return res.end('Not found')
      }

      fs.readFile(path.join(STATIC_DIR, 'index.html'), (indexErr, indexData) => {
        if (indexErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
          return res.end('Frontend build not found. Run npm run render-build first.')
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' })
        res.end(indexData)
      })
      return
    }

    res.writeHead(200, { 'Content-Type': CONTENT_TYPES[path.extname(filePath)] || 'application/octet-stream' })
    res.end(data)
  })
}

const routeHandlers = [
  handleAuthRoutes,
  handleProfileRoutes,
  handleListingsRoutes,
  handleNotificationRoutes,
  handleOfferRoutes,
  handleRoomCodeRoutes,
  handleEvidenceRoutes,
  handleDisputesRoutes,
  handleRoomIndexRoutes,
]

const server = http.createServer(async (req, res) => {
  const origin = req.headers.origin || '*'

  if (req.method === 'OPTIONS') {
    res.writeHead(204, corsHeaders(origin))
    return res.end()
  }

  const url = new URL(req.url, `http://localhost:${PORT}`)
  const pathname = url.pathname
  const ctx = { pathname, origin, url }

  try {
    if (pathname === '/api/health' && req.method === 'GET') {
      return json(res, { status: 'ok' }, 200, origin)
    }

    for (const handler of routeHandlers) {
      // eslint-disable-next-line no-await-in-loop
      if (await handler(req, res, ctx)) return
    }

    if (!pathname.startsWith('/api/')) {
      return serveStatic(res, pathname)
    }

    json(res, { error: 'Not found' }, 404, origin)
  } catch (err) {
    json(res, { error: err.message }, 500, origin)
  }
})

server.listen(PORT, () => {
  console.log(`BOND Market API on http://localhost:${PORT}`)
})

module.exports = { server }
