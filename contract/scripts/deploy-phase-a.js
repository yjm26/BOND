/**
 * Deploy BOND (Phase A) to Arc Testnet.
 * Loads local/deploy/deploy.env (gitignored).
 */
const hre = require('hardhat')
const fs = require('fs')
const path = require('path')

function loadDeployEnv() {
  const p = path.join(__dirname, '..', '..', 'local', 'deploy', 'deploy.env')
  if (!fs.existsSync(p)) throw new Error('Missing local/deploy/deploy.env')
  const out = {}
  for (const line of fs.readFileSync(p, 'utf8').split(/\r?\n/)) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    out[t.slice(0, i).trim()] = t.slice(i + 1).trim()
  }
  return out
}

async function main() {
  const env = loadDeployEnv()
  const usdc = env.USDC_ADDRESS || '0x3600000000000000000000000000000000000000'
  const treasury = env.TREASURY_ADDRESS
  const arbiter = env.ARBITER_ADDRESS || treasury
  const arbiterName = env.ARBITER_NAME || 'BOND Arbiter'
  if (!treasury) throw new Error('TREASURY_ADDRESS required')
  if (!arbiter) throw new Error('ARBITER_ADDRESS required')

  const [deployer] = await hre.ethers.getSigners()
  console.log('Deployer', deployer.address)
  console.log('USDC', usdc)
  console.log('Treasury', treasury)
  console.log('Arbiter', arbiter)

  const Factory = await hre.ethers.getContractFactory('BOND')
  const contract = await Factory.deploy(usdc, treasury, arbiter, arbiterName, {
    maxFeePerGas: 100000000000n,
    maxPriorityFeePerGas: 2000000000n,
    gasLimit: 6000000n,
  })
  await contract.waitForDeployment()
  const address = await contract.getAddress()
  console.log('BOND (Phase A) deployed:', address)
  console.log('ArcScan:', `https://testnet.arcscan.app/address/${address}`)

  const outDir = path.join(__dirname, '..', '..', 'local', 'deploy')
  fs.mkdirSync(outDir, { recursive: true })
  fs.writeFileSync(
    path.join(outDir, 'last-deploy.json'),
    JSON.stringify(
      {
        address,
        deployer: deployer.address,
        treasury,
        arbiter,
        usdc,
        chainId: 5042002,
        phase: 'A-deadline-from-fund-nonReentrant',
        at: new Date().toISOString(),
      },
      null,
      2,
    ),
  )
  fs.writeFileSync(path.join(__dirname, '..', 'deployed-address.txt'), address + '\n')
  console.log('Wrote contract/deployed-address.txt + local/deploy/last-deploy.json')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
