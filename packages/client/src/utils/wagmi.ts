import { createClient } from 'wagmi'
import { goerli } from 'wagmi/chains'
import type { Chain } from '@wagmi/core'
import { InjectedConnector, configureChains } from '@wagmi/core'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'

import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { chains as CHAINS } from '@/config'

const defaultChains: Chain[] = [
  CHAINS[process.env.NEXT_PUBLIC_CHAINID || ''] || goerli,
]

const providers = [
  jsonRpcProvider({
    rpc: () => ({ http: defaultChains[0].rpcUrls.default[0] }),
  }),
]

const { chains, provider, webSocketProvider } = configureChains(defaultChains, providers)

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

function AXSWallet({ chains }) {
  return {
    id: 'axs',
    name: 'AXS Wallet',
    iconUrl: '/wallet.png',
    iconBackground: '#FFFFFF',
    description: 'AXS wallet web3 provider.',
    createConnector: () => {
      const connector = new InjectedConnector({
        chains,
      })
      return { connector }
    },
  }
}
export { chains, client }
