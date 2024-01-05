import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { Block, BlockTag, Contract, EventLog, FetchRequest, JsonRpcProvider, TransactionResponse, Wallet, solidityPackedKeccak256 } from 'ethers'
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
  private wallet: Wallet
  constructor(private config: ConfigService) {
    this.provider = new JsonRpcProvider(config.get('NEST_PROVIDER_URL'))
    this.contract = new Contract(config.get('NEST_MARKET_CONTRACT'), marketFragment, { provider: this.provider })
    this.contract.queryFilter('inscription_msc20_transfer')
      .then(([log]: EventLog[]) => {
        console.log(log.args.toObject())
      })
    this.wallet = new Wallet(config.get('NEST_PRIVATE_KEY'), this.provider)
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
