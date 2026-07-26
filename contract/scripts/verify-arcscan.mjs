/**
 * Verify BOND on ArcScan (Blockscout v2).
 *
 * Two gotchas this handles:
 *  1. There are multiple build-info files. Pick the one whose sources contain
 *     ONLY BOND.sol — the deploy compilation. Submitting the build that
 *     also includes MockUSDC.sol makes the verifier recompile a different input.
 *  2. Blockscout's verifier wants a full outputSelection. Hardhat's build-info
 *     narrows it, so widen it to ["*"] before submitting.
 *
 * v1 `/api/?action=verifysourcecode` cannot be used: it answers
 * "Address is not a smart-contract" while v2 reports is_contract: true.
 *
 * Usage: node scripts/verify-arcscan.mjs [--status]
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ethers } from 'ethers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const BASE = 'https://testnet.arcscan.app'
const ADDRESS = process.env.BOND_ADDRESS ||
  fs.readFileSync(path.join(root, 'deployed-address.txt'), 'utf8').trim()
const CONTRACT_PATH = 'contracts/BOND.sol'
const CONTRACT_NAME = 'BOND'

const CTOR = {
  usdc: '0x3600000000000000000000000000000000000000',
  treasury: '0xc7F84022f00Ca720e70f44bc98C45cA8C16f935C',
  arbiter: '0xc7F84022f00Ca720e70f44bc98C45cA8C16f935C',
  arbiterName: 'BOND Arbiter',
}

const state = async () => {
  const r = await fetch(`${BASE}/api/v2/addresses/${ADDRESS}`).then((x) => x.json())
  return { is_contract: r.is_contract, is_verified: r.is_verified }
}

/** Prefer the build whose source set is exactly the deployed contract. */
const pickBuildInfo = () => {
  const dir = path.join(root, 'artifacts', 'build-info')
  const candidates = []
  for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.json'))) {
    const info = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8'))
    if (info.output?.contracts?.[CONTRACT_PATH]?.[CONTRACT_NAME]) {
      candidates.push({ file: f, info, nSources: Object.keys(info.input.sources).length })
    }
  }
  if (!candidates.length) throw new Error('no build-info for BOND')
  candidates.sort((a, b) => a.nSources - b.nSources)
  return candidates[0]
}

const encodeArgs = () =>
  ethers.AbiCoder.defaultAbiCoder()
    .encode(
      ['address', 'address', 'address', 'string'],
      [CTOR.usdc, CTOR.treasury, CTOR.arbiter, CTOR.arbiterName],
    )
    .slice(2)

const main = async () => {
  const before = await state()
  console.log('before:', JSON.stringify(before))
  if (process.argv.includes('--status')) return
  if (before.is_verified) return console.log('already verified')

  const { file, info, nSources } = pickBuildInfo()
  const compiler = `v${info.solcLongVersion}`

  // Widen outputSelection — hardhat narrows it, Blockscout wants everything.
  const input = JSON.parse(JSON.stringify(info.input))
  input.settings.outputSelection = { '*': { '*': ['*'], '': ['*'] } }

  console.log('build-info :', file, `(${nSources} source${nSources > 1 ? 's' : ''})`)
  console.log('compiler   :', compiler)
  console.log('viaIR      :', input.settings.viaIR)
  console.log('evmVersion :', input.settings.evmVersion)

  const args = encodeArgs()
  const form = new FormData()
  form.append('compiler_version', compiler)
  form.append('license_type', 'mit')
  form.append('contract_name', `${CONTRACT_PATH}:${CONTRACT_NAME}`)
  form.append('autodetect_constructor_args', 'false')
  form.append('constructor_args', args)
  form.append(
    'files[0]',
    new Blob([JSON.stringify(input)], { type: 'application/json' }),
    'standard-input.json',
  )

  const res = await fetch(
    `${BASE}/api/v2/smart-contracts/${ADDRESS}/verification/via/standard-input`,
    { method: 'POST', body: form },
  )
  console.log(`\nsubmit HTTP ${res.status}:`, (await res.text()).slice(0, 300))
  if (res.status >= 400) process.exit(1)

  for (let i = 1; i <= 24; i++) {
    await new Promise((r) => setTimeout(r, 5000))
    const s = await state()
    if (s.is_verified) {
      console.log(`\nVERIFIED after ${i * 5}s`)
      console.log(`${BASE}/address/${ADDRESS}#code`)
      process.exit(0)
    }
    if (i % 4 === 0) console.log(`  ${i * 5}s: still unverified`)
  }
  console.log('\nNOT VERIFIED (timed out)')
  process.exit(1)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
