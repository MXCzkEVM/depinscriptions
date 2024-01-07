import { Contract, providers } from 'ethers'
import { chains } from '@/config'
import { MarketContract, marketFragment } from '@/config/abis'

export function getMarketContractWithSinger(chainId: number, address: string) {
  const contract = process.env.NEXT_PUBLIC_MARKET_CONTRACT as `0x${string}`
  const singer = getProviderBySinger(chainId, address)
  const market = new Contract(contract, marketFragment, singer)
  return market as Contract & MarketContract
}

export function getProviderBySinger(chainId: number, address: string) {
  const rpc = chains[chainId].rpcUrls.default.http[0]
  const name = chains[chainId].name
  const jsonProvider = new providers.JsonRpcProvider(rpc, { chainId, name })
  return jsonProvider.getSigner(address)
}
