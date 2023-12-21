/* eslint-disable @typescript-eslint/ban-ts-comment */
import { createClient } from 'wagmi'
import { goerli } from 'wagmi/chains'
import { configureChains } from '@wagmi/core'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { Chain, InjectedConnector } from '@wagmi/core'
import { connectorsForWallets, } from '@rainbow-me/rainbowkit'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'

/*
export const zkevm = {
    id: 18686,
    name: 'MXC zkEVM',
    network: 'MXC zkEVM',
    nativeCurrency: {
        decimals: 18,
        name: 'MXC Token',
        symbol: 'MXC',
    },
    rpcUrls: {
        public: { http: ['"https://rpc.mxc.com"'] },
        default: { http: ['"https://wrpc.mxc.com"'] },
    },
    blockExplorers: {
        etherscan: { name: 'etherscan', url: 'https://explorer.mxc.com' },
        default: { name: 'etherscan', url: 'https://explorer.mxc.com' },
    },
} as const satisfies Chain
*/

const defaultChains: Chain[] = [
  {
    id: 5167003,
    name: 'Wannsee',
    network: 'Wannsee',
    nativeCurrency: {
      decimals: 18,
      name: 'MXC Token',
      symbol: 'MXC',
    },
    rpcUrls: {
      public: { http: ['"https://wannsee-rpc.mxc.com"'] },
      default: { http: ['"https://wannsee-rpc.mxc.com"'] },
    },
    blockExplorers: {
      etherscan: { name: 'etherscan', url: 'https://wannsee-explorer.mxc.com' },
      default: { name: 'etherscan', url: 'https://wannsee-explorer.mxc.com' },
    },
  },
  goerli
]

const providers = [
  jsonRpcProvider({
    rpc: () => ({
      http: `https://wannsee-rpc.mxc.com`,
    }),
  }),
]

// @ts-ignore
const { chains, provider, webSocketProvider } = configureChains(defaultChains, providers)

const AXSWallet = ({ chains }) => ({
  id: 'axs',
  name: 'AXS Wallet',
  iconUrl: '/AxsWallet.png',
  iconBackground: '#FFFFFF',
  description: 'AXS wallet web3 provider.',
  createConnector: () => {
    const connector = new InjectedConnector({
      chains
    })
    return {
      connector,
    }
  },
})

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      AXSWallet({ chains }),
      metaMaskWallet({ chains }),
    ],
  },
])


export const client = createClient({
  logger: {
    warn: (message) => console.warn(message),
  },
  // autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export { chains }
