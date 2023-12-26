import { createClient } from 'wagmi'
import { goerli } from 'wagmi/chains'
import type { Chain } from '@wagmi/core'
import { InjectedConnector, configureChains } from '@wagmi/core'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'

const defaultChains: Chain[] = [
  goerli,
]

const providers = [
  jsonRpcProvider({
    rpc: () => ({
      http: goerli.rpcUrls.default[0],
    }),
  }),
]

const { chains, provider, webSocketProvider } = configureChains(defaultChains, providers)

function AXSWallet({ chains }) {
  return {
    id: 'axs',
    name: 'AXS Wallet',
    iconUrl: '/AxsWallet.png',
    iconBackground: '#FFFFFF',
    description: 'AXS wallet web3 provider.',
    createConnector: () => {
      const connector = new InjectedConnector({
        chains,
      })
      return {
        connector,
      }
    },
  }
}

const connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      AXSWallet({ chains }),
      metaMaskWallet({ chains }),
    ],
  },
])

const client = createClient({
  logger: {
    warn: message => console.warn(message),
  },
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
})

export { chains, client }
