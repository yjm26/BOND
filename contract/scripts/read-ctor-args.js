// Read live constructor state from the deployed contract using the real ABI.
const { ethers } = require('ethers')
const artifact = require('../artifacts/contracts/BoundTestnet.sol/BoundTestnet.json')

const RPC = process.env.ARC_RPC_URL || 'https://rpc.blockdaemon.testnet.arc.network'
const ADDR = '0x57608180484B746F396851aE84f8f64F03Bb89dF'

async function main() {
  const provider = new ethers.JsonRpcProvider(RPC)
  const c = new ethers.Contract(ADDR, artifact.abi, provider)

  const out = {}
  for (const key of ['usdc', 'treasury', 'arbiter', 'arbiterName', 'owner']) {
    try {
      out[key] = await c[key]()
    } catch (e) {
      out[key] = `ERR: ${e.shortMessage || e.message}`
    }
  }
  console.log(JSON.stringify(out, null, 2))

  // Local bytecode vs on-chain: confirms the source in repo matches what's deployed.
  const onchain = await provider.getCode(ADDR)
  console.log('\non-chain runtime bytecode len:', onchain.length)
  console.log('local deployedBytecode len:   ', artifact.deployedBytecode.length)
  console.log('exact match:', onchain.toLowerCase() === artifact.deployedBytecode.toLowerCase())
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
