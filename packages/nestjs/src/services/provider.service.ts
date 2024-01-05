import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Block, BlockTag, Contract, EventLog, FetchRequest, JsonRpcProvider, Log, TransactionResponse } from 'ethers'
import { arange } from '@hairy/utils'
import { httpsOverHttp } from 'tunnel'
import { marketFragment } from '../config'

const fetchRequest = FetchRequest.createGetUrlFunc({
  agent: httpsOverHttp({
    proxy: {
      host: '127.0.0.1',
      port: 7890,
    },
  }),
})

FetchRequest.registerGetUrl(fetchRequest)

export interface BlockWithTransactions extends Omit<Block, 'transactions'> {
  transactions: Array<TransactionResponse>
}
@Injectable()
export class JsonProviderService {
  private provider: JsonRpcProvider
  private contract: Contract
  private logsMappings: Record<number, Record<string, (Log | EventLog)[]>> = {}
  constructor(private config: ConfigService) {
    this.provider = new JsonRpcProvider(config.get('NEST_PROVIDER_URL'))
    this.contract = new Contract(config.get('NEST_MARKET_CONTRACT'), marketFragment, { provider: this.provider })
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
    if (this.logsMappings?.[blockNumber]?.[event])
      return this.logsMappings[blockNumber][event]
    const logs = await this.contract.queryFilter(event, blockNumber, blockNumber)
    if (!this.logsMappings[blockNumber])
      this.logsMappings[blockNumber] = {}
    return this.logsMappings[blockNumber][event] = logs
  }

  async queryFilterByHash(event: string, hash: string) {
    const detail = await this.getTransaction(hash)
    const logs = await this.queryFilterByBlock(event, detail.blockNumber)
    return logs.filter(l => l.transactionHash === detail.hash) as EventLog[]
  }
}
