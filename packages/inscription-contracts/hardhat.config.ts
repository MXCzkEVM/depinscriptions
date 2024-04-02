import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@nomicfoundation/hardhat-verify'
import '@openzeppelin/hardhat-upgrades'
import 'hardhat-deploy'
import 'dotenv/config'

const envs = process.env as Record<string, string>
const {
  OWNER_PRIVATE_KEY_TESTNET,
  OWNER_PRIVATE_KEY_MAINNET,
  VERIFIER_PRIVATE_KEY_TESTNET,
  VERIFIER_PRIVATE_KEY_MAINNET,
} = envs

const config: HardhatUserConfig = {
  paths: { sources: './src' },
  solidity: '0.8.20',
  defaultNetwork: 'hardhat',
  namedAccounts: {
    deployer: { default: 0 },
    owner: { default: 0 },
    verifier: { default: 1 },
  },
  networks: {
    hardhat: {
      chainId: 31337,
      gasPrice: 875000000,
      allowUnlimitedContractSize: true,
      saveDeployments: true,
    },
    testnet: {
      url: 'http://144.202.111.198:8545',
      chainId: 5167004,
      accounts: [OWNER_PRIVATE_KEY_TESTNET, VERIFIER_PRIVATE_KEY_TESTNET],
      saveDeployments: true,
      allowUnlimitedContractSize: true,
      verify: {
        etherscan: {
          apiUrl: 'https://wannsee-explorer-v1.mxc.com/',
          apiKey: '',
        },
      },
    },
    mainnet: {
      url: 'http://207.246.101.30:8545',
      chainId: 18686,
      accounts: [OWNER_PRIVATE_KEY_MAINNET, VERIFIER_PRIVATE_KEY_MAINNET],
      saveDeployments: true,
      allowUnlimitedContractSize: true,
      gas: 'auto',
      gasPrice: 'auto',
      verify: {
        etherscan: { apiUrl: 'https://explorer-v1.mxc.com', apiKey: '' },
      },
    },
  },
  etherscan: {
    apiKey: {
      mainnet: ' ',
      testnet: ' ',
    },
    customChains: [
      {
        network: 'mainnet',
        chainId: 18686,
        urls: {
          apiURL: 'https://explorer-v1.mxc.com/api',
          browserURL: 'https://explorer.mxc.com',
        },
      },
      {
        network: 'testnet',
        chainId: 5167004,
        urls: {
          apiURL: 'https://wannsee-explorer-v1.mxc.com/api',
          browserURL: 'https://wannsee-explorer.mxc.com',
        },
      },
    ],
  },
  sourcify: {
    enabled: false,
  },
}

export default config
