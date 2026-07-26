// Local verification of SEO wiring against a running BOND server.
// Usage: node scripts/verify-seo.mjs [baseUrl]
const base = (process.argv[2] || 'http://127.0.0.1:3001').replace(/\/$/, '')

let failed = 0
const check = (name, ok, detail = '') => {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`)
  if (!ok) failed++
}

const get = async (path) => {
  const res = await fetch(base + path, { redirect: 'manual' })
  return { status: res.status, type: res.headers.get('content-type') || '', body: await res.text() }
}

const robots = await get('/robots.txt')
check('robots.txt status 200', robots.status === 200, `got ${robots.status}`)
check('robots.txt is text/plain', robots.type.startsWith('text/plain'), robots.type)
check('robots.txt is not HTML', !robots.body.trim().startsWith('<'), robots.body.slice(0, 40))
check('robots.txt links sitemap', robots.body.includes('Sitemap: https://usebond.xyz/sitemap.xml'))

const sitemap = await get('/sitemap.xml')
check('sitemap.xml status 200', sitemap.status === 200, `got ${sitemap.status}`)
check('sitemap.xml is xml', sitemap.type.includes('xml'), sitemap.type)
check('sitemap.xml has urlset', sitemap.body.includes('<urlset'))
const locs = [...sitemap.body.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
check('sitemap has >=3 urls', locs.length >= 3, `${locs.length} urls`)
check('all locs absolute https', locs.every((l) => l.startsWith('https://usebond.xyz/')))

const home = await get('/')
check('/ status 200', home.status === 200, `got ${home.status}`)
const ld = [...home.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)]
check('JSON-LD block present', ld.length === 1, `${ld.length} blocks`)
if (ld.length) {
  try {
    const data = JSON.parse(ld[0][1])
    const types = (data['@graph'] || []).map((n) => n['@type'])
    check('JSON-LD parses', true)
    check('has WebSite', types.includes('WebSite'), types.join(','))
    check('has SoftwareApplication', types.includes('SoftwareApplication'))
    check('has FAQPage', types.includes('FAQPage'))
    const faq = (data['@graph'] || []).find((n) => n['@type'] === 'FAQPage')
    check('FAQ has >=4 questions', (faq?.mainEntity || []).length >= 4)
    check(
      'every FAQ answer non-empty',
      (faq?.mainEntity || []).every((q) => q.acceptedAnswer?.text?.length > 20),
    )
  } catch (e) {
    check('JSON-LD parses', false, e.message)
  }
}
check('canonical present', home.body.includes('rel="canonical" href="https://usebond.xyz/"'))
check('app entry script intact', home.body.includes('type="module"') && home.body.includes('/assets/'))

const missing = await get('/definitely-not-a-real-file.txt')
check('missing .txt returns real 404', missing.status === 404, `got ${missing.status}`)
check('missing .txt is not HTML (no soft-404)', !missing.body.trim().startsWith('<'))

const spa = await get('/market')
check('SPA route still serves index.html', spa.status === 200 && spa.body.includes('<div id="root">'))

console.log(failed === 0 ? '\nALL CHECKS PASSED' : `\n${failed} CHECK(S) FAILED`)
process.exit(failed === 0 ? 0 : 1)
