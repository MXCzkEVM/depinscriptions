import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Block, BlockTag, FetchRequest, JsonRpcProvider, TransactionResponse } from 'ethers'
import { arange } from '@hairy/utils'
import { httpsOverHttp } from 'tunnel'

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
  constructor(private config: ConfigService) {
    this.provider = new JsonRpcProvider(config.get('NEST_PROVIDER_URL'))
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
}
