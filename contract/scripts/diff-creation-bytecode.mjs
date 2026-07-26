/**
 * Compare our locally-compiled creation bytecode against the explorer's stored
 * creation bytecode, and recover the real constructor args from the tail.
 *
 * Verification fails silently when the submitted args or compiler settings don't
 * reproduce the on-chain creation code, so diff them before blaming the API.
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { ethers } from 'ethers'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

const BASE = 'https://testnet.arcscan.app'
const ADDRESS = '0x57608180484B746F396851aE84f8f64F03Bb89dF'
const CONTRACT_PATH = 'contracts/BoundTestnet.sol'
const CONTRACT_NAME = 'BoundTestnet'

const artifact = JSON.parse(
  fs.readFileSync(
    path.join(root, 'artifacts', 'contracts', 'BoundTestnet.sol', 'BoundTestnet.json'),
    'utf8',
  ),
)

const remote = await fetch(`${BASE}/api/v2/smart-contracts/${ADDRESS}`).then((r) => r.json())
const onchainCreation = (remote.creation_bytecode || '').toLowerCase()
const localCreation = artifact.bytecode.toLowerCase()

console.log('onchain creation len:', onchainCreation.length)
console.log('local   creation len:', localCreation.length)

const prefixMatch = onchainCreation.startsWith(localCreation)
console.log('onchain starts with local bytecode:', prefixMatch)

if (prefixMatch) {
  const argsHex = onchainCreation.slice(localCreation.length)
  console.log('\ntrailing constructor args len:', argsHex.length)
  try {
    const decoded = ethers.AbiCoder.defaultAbiCoder().decode(
      ['address', 'address', 'address', 'string'],
      '0x' + argsHex,
    )
    console.log('decoded ctor args:')
    console.log('  usdc       =', decoded[0])
    console.log('  treasury   =', decoded[1])
    console.log('  arbiter    =', decoded[2])
    console.log('  arbiterName=', JSON.stringify(decoded[3]))
    console.log('\nEXACT_ARGS_HEX=' + argsHex)
  } catch (e) {
    console.log('decode failed:', e.shortMessage || e.message)
  }
} else {
  let i = 0
  while (i < localCreation.length && localCreation[i] === onchainCreation[i]) i++
  console.log('\nfirst divergence at char:', i)
  console.log('local  :', localCreation.slice(i, i + 80))
  console.log('onchain:', onchainCreation.slice(i, i + 80))
  console.log('\n=> local compile does NOT reproduce on-chain creation code.')
  console.log('   Compiler settings differ from the deploy (check viaIR/optimizer/version).')
}
