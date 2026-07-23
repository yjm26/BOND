const hre = require('hardhat')

const USDC_ADDRESS = process.env.USDC_ADDRESS || '0x3600000000000000000000000000000000000000'
const TREASURY_ADDRESS = process.env.TREASURY_ADDRESS
const ARBITER_ADDRESS = process.env.ARBITER_ADDRESS || TREASURY_ADDRESS
const ARBITER_NAME = process.env.ARBITER_NAME || 'BOND Arbiter'

async function main() {
  if (!TREASURY_ADDRESS) throw new Error('Missing TREASURY_ADDRESS env')
  if (!ARBITER_ADDRESS) throw new Error('Missing ARBITER_ADDRESS env')

  const [deployer] = await hre.ethers.getSigners()
  if (!deployer) throw new Error('Missing PRIVATE_KEY env for deployer')

  console.log('Deploying BoundTestnet with:', deployer.address)
  console.log('USDC:', USDC_ADDRESS)
  console.log('Treasury:', TREASURY_ADDRESS)
  console.log('Arbiter:', ARBITER_ADDRESS)

  const BondRoom = await hre.ethers.getContractFactory('BoundTestnet')
  const contract = await BondRoom.deploy(
    USDC_ADDRESS,
    TREASURY_ADDRESS,
    ARBITER_ADDRESS,
    ARBITER_NAME
  )

  await contract.waitForDeployment()
  const address = await contract.getAddress()
  console.log('BoundTestnet deployed to:', address)
  console.log('Arcscan:', `https://testnet.arcscan.app/address/${address}`)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
