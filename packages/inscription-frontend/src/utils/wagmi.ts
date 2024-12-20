/* eslint-disable ts/ban-ts-comment */
import { createClient } from 'wagmi'
import { goerli } from 'wagmi/chains'
import type { Chain } from '@wagmi/core'
import { InjectedConnector, configureChains } from '@wagmi/core'
import { jsonRpcProvider } from '@wagmi/core/providers/jsonRpc'
import { cloneDeep } from 'lodash'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { metaMaskWallet } from '@rainbow-me/rainbowkit/wallets'
import { chains as CHAINS } from '@/config'

export const defaultChains: Chain[] = [
  CHAINS[process.env.NEXT_PUBLIC_CHAINID || ''] || goerli,
]

const providers = [
  jsonRpcProvider({
    rpc: () => ({ http: defaultChains[0].rpcUrls.default[0] }),
  }),
]

const { chains, provider: getProvider, webSocketProvider } = configureChains(defaultChains, providers)

const _connectors = connectorsForWallets([
  {
    groupName: 'Popular',
    wallets: [
      MoonBaseWallet({ chains }),
      MetamaskWallet({ chains }),
      OKXWallet({ chains }),
    ],
  },
])

export function connectors() {
  const cs = _connectors() as any[]
  cs.forEach(c => c.ready = true)
  return cs
}

function extendsGetProvider(opt: any) {
  const provider = getProvider(opt)
  const clone = cloneDeep(provider)
  // fix request balance error
  // @ts-expect-error
  clone.connection.url = provider.chains?.[0].rpcUrls.public.http[0]
  return clone
}
const client = createClient({
  logger: {
    warn: message => console.warn(message),
  },
  autoConnect: true,
  connectors,
  provider: extendsGetProvider,
  webSocketProvider,
})

function MoonBaseWallet({ chains }) {
  return {
    id: 'moon_base',
    name: 'MoonBase',
    iconUrl: 'https://raw.githubusercontent.com/MXCzkEVM/metadata/main/logo-circle.svg',
    iconBackground: '#FFFFFF',
    description: 'MoonBase wallet web3 provider.',
    createConnector: () => {
      return { connector: new InjectedConnector({ chains }) }
    },
    installed: true,
  }
}
function OKXWallet({ chains }) {
  return {
    id: 'okx',
    name: 'OKX Wallet',
    iconUrl: 'https://logosandtypes.com/wp-content/uploads/2022/04/okx.svg',
    iconBackground: '#FFFFFF',
    description: 'OKX wallet web3 provider.',
    createConnector: () => {
      return { connector: new InjectedConnector({ chains }) }
    },
    installed: true,
  }
}
function MetamaskWallet({ chains }) {
  const source = metaMaskWallet({ chains })
  return {
    id: source.id,
    name: source.name,
    iconUrl: source.iconUrl,
    iconBackground: source.iconBackground,
    downloadUrls: source.downloadUrls,
    iconAccent: source.iconAccent,
    shortName: source.shortName,
    createConnector: () => {
      return { connector: new InjectedConnector({ chains }) }
    },
    installed: true,
  }
}
export { chains, client }
