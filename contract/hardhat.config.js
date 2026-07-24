require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      viaIR: true,
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    arcTestnet: {
      url: process.env.ARC_RPC_URL || 'https://rpc.blockdaemon.testnet.arc.network',
      chainId: 5042002,
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
  },
  etherscan: {
    apiKey: {
      arcTestnet: 'arcscan',
    },
    customChains: [
      {
        network: 'arcTestnet',
        chainId: 5042002,
        urls: {
          apiURL: 'https://testnet.arcscan.app/api/',
          browserURL: 'https://testnet.arcscan.app',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
};
