import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
import '@openzeppelin/hardhat-upgrades'
import 'hardhat-deploy'
import 'dotenv/config'

const PRIVATE_KEY_TESTNET = process.env.PRIVATE_KEY_TESTNET!
const PRIVATE_KEY_MAINNET = process.env.PRIVATE_KEY_MAINNET!

const config: HardhatUserConfig = {
  solidity: '0.8.20',
  defaultNetwork: 'hardhat',
  namedAccounts: {
    deployer: {
      default: 0,
      5167003: 0,
      1337: 0,
    },
    owner: {
      default: 0,
      5167003: 0,
      1337: 0,
    },
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
      chainId: 5167003,
      accounts: [PRIVATE_KEY_TESTNET],
      saveDeployments: true,
      allowUnlimitedContractSize: true,
      gasPrice: 6000000000000,
    },
    mainnet: {
      url: 'http://207.246.101.30:8545',
      chainId: 18686,
      accounts: [PRIVATE_KEY_MAINNET],
      saveDeployments: true,
      allowUnlimitedContractSize: true,
      gasPrice: 100000000000000,
    },
  },
}

export default config
