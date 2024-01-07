import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BlockTag, Contract, EventLog, JsonRpcProvider, Log, Wallet } from 'ethers'
import { arange } from '@hairy/utils'
import { marketFragment } from '../../config'
import { BlockWithTransactions } from './types'

@Injectable()
export class ProviderService {
  private provider: JsonRpcProvider
  private contract: Contract
  private mappings: Record<number, Record<string, (Log | EventLog)[]>> = {}
  private wallet: Wallet
  constructor(private config: ConfigService) {
    this.provider = new JsonRpcProvider(config.get('NEST_PROVIDER_URL'))
    this.wallet = new Wallet(config.get('NEST_VERIFIER_PRIVATE_KEY'), this.provider)
    this.contract = new Contract(
      config.get('NEST_MARKET_CONTRACT'),
      marketFragment,
      { provider: this.provider },
    )
  }

  async getLastBlockNumber() {
    return this.provider.getBlockNumber()
  }

  async getBlockByArangeWithTransactions(start: number, end: number) {
    return Promise.all(
      arange(start, end).map(index => this.getBlockWithTransactions(index)),
    )
  }

  async getBlockWithTransactions(
    block: BlockTag,
  ): Promise<BlockWithTransactions> {
    const response = await this.provider.getBlock(block, true)
    const transactions = await this.getTransactions([...response.transactions])
    return { ...response, transactions } as BlockWithTransactions
  }

  async getTransactions(transactions: string[]) {
    return Promise.all(
      transactions.map(hash => this.provider.getTransaction(hash)),
    )
  }

  async getTransaction(hash: string) {
    return this.provider.getTransaction(hash)
  }

  async queryFilterByBlock(event: string, blockNumber: number) {
    if (this.mappings?.[blockNumber]?.[event])
      return this.mappings[blockNumber][event]
    const logs = await this.contract.queryFilter(event, blockNumber, blockNumber)
    if (!this.mappings[blockNumber])
      this.mappings[blockNumber] = {}
    return this.mappings[blockNumber][event] = logs
  }

  async queryFilterByHash(event: string, hash: string) {
    const detail = await this.getTransaction(hash)
    const logs = await this.queryFilterByBlock(event, detail.blockNumber)
    return logs.filter(l => l.transactionHash === detail.hash) as EventLog[]
  }

  async signMessage(message: string | Uint8Array) {
    return this.wallet.signMessage(message)
  }
}
