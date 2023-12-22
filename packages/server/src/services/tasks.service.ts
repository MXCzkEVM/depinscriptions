import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { getIndexerLastBlock } from 'src/utils'
import { TransactionResponse, toUtf8String } from 'ethers'
import { jsonProviderService } from './provider.service'
import { HolderService } from './holder.service'
import { TickService } from './tick.service'
import { InscriptionService } from './inscription.service'

interface ScanDeployJSON {
  p: 'msc-20'
  op: 'deploy'
  tick: string
  max: string
  lim: string
}
interface ScanMintJSON {
  p: 'msc-20'
  op: 'deploy'
  tick: string
  amt: string
  hex?: string
}

type ScanJSONType = ScanDeployJSON | ScanMintJSON

@Injectable()
export class TasksService {
  constructor(
    private provider: jsonProviderService,
    private holderService: HolderService,
    private tickService: TickService,
    private inscriptionService: InscriptionService,
  ) { }

  private readonly logger = new Logger(TasksService.name)

  @Interval(5000)
  async handleBlock() {
    const lastBlockNumber = await this.provider.getLastBlockNumber()
    const startBlockNumber = await getIndexerLastBlock()
    const endBlockNumber = Math.min(startBlockNumber + 10, lastBlockNumber)
    this.logger.debug(`lastBlockNumber: ${lastBlockNumber}`)
    await this.nextBlocks(startBlockNumber, endBlockNumber)
  }

  async nextBlocks(start: number, end: number) {
    // const blocks = await this.provider.getBlockByArangeWithTransactions(
    //   start,
    //   end,
    // )
    const transactions = [
      await this.provider.getTransaction(
        '0x28a46a361072b179415971d01e0c7cc3ee95b9914722527369d656add25c2da0',
      ),
    ]
    for (const block of [{ transactions, timestamp: Date() }]) {
      for (const transaction of block.transactions) {
        if (!transaction.data.startsWith('0x7b2270223a226d73632d323022'))
          continue
        const receipt = await transaction.wait()
        if (receipt.status !== 1)
          continue

        const json = toUtf8String(transaction.data)
        const inscription = JSON.parse(json) as ScanJSONType

        this.logger.log(`transaction data: ${transaction.data}`)
        this.logger.log(`inscription json: ${json}`)

        try {
          await this.inscriptionService.recordInscription({
            from: transaction.from,
            to: transaction.to,
            hash: transaction.hash,
            op: inscription.op,
            tick: String(inscription.tick),
            json,
          })
          if (inscription.op === 'deploy')
            continue

          if (inscription.op === 'mint')
            continue
        }
        catch (error) {
          this.logger.warn('The current hash already exists, skipping record')
        }
      }
    }
  }

  async deploy(transaction: TransactionResponse, inscription: ScanDeployJSON) {
    this.tickService.createTick({
      creator: transaction.from,
      deployTime: Date(),
      deployHash: transaction.hash,
      limit: +inscription.lim,
      tick: inscription.tick,
    })
  }

  async mint(transaction: TransactionResponse, inscription: ScanMintJSON) {
    const tick = await this.tickService.tick({ tick: inscription.tick })
    // inscription.lim;
    // this.holderService.someHolder
    // this.tickService.updateTick();
  }
}
