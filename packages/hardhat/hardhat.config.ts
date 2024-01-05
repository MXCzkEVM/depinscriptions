import { HardhatUserConfig, task } from 'hardhat/config'
import '@nomicfoundation/hardhat-toolbox'
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
      chainId: 5167003,
      accounts: [OWNER_PRIVATE_KEY_TESTNET, VERIFIER_PRIVATE_KEY_TESTNET],
      saveDeployments: true,
      allowUnlimitedContractSize: true,
    },
    mainnet: {
      url: 'http://207.246.101.30:8545',
      chainId: 18686,
      accounts: [OWNER_PRIVATE_KEY_MAINNET, VERIFIER_PRIVATE_KEY_MAINNET],
      saveDeployments: true,
      allowUnlimitedContractSize: true,
    },
  },
}

export default config
