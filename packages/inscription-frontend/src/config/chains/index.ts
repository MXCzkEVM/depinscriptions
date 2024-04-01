import { Chain } from 'wagmi'

export const chains: Record<string, Chain> = {
  5167004: {
    id: 5167004,
    name: 'Wannsee MXC zkEVM',
    network: 'Wannsee',
    nativeCurrency: {
      decimals: 18,
      name: 'MXC Token',
      symbol: 'MXC',
    },
    rpcUrls: {
      public: { http: ['https://geneva-rpc.moonchain.com'] },
      default: { http: ['https://geneva-rpc.moonchain.com'] },
    },
    blockExplorers: {
      etherscan: { name: 'etherscan', url: 'https://wannsee-explorer.mxc.com' },
      default: { name: 'etherscan', url: 'https://wannsee-explorer.mxc.com' },
    },
  },
  18686: {
    id: 18686,
    name: 'MXC zkEVM',
    network: 'Mainnet',
    nativeCurrency: {
      decimals: 18,
      name: 'MXC Token',
      symbol: 'MXC',
    },
    rpcUrls: {
      public: { http: ['https://rpc.mxc.com'] },
      default: { http: ['https://rpc.mxc.com'] },
    },
    blockExplorers: {
      etherscan: { name: 'etherscan', url: 'https://explorer.mxc.com' },
      default: { name: 'etherscan', url: 'https://explorer.mxc.com' },
    },
  },
}
