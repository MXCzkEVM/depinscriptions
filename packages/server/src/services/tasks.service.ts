import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { TransactionResponse, toUtf8String } from 'ethers'
import { getIndexerLastBlock, setIndexerLastBlock } from '../utils'

import { JsonProviderService } from './provider.service'
import { HolderService } from './holder.service'
import { TickService } from './tick.service'
import { InscriptionService } from './inscription.service'
import { HexagonService } from './hexagon.service'
import { ScanDeployJSON, ScanMintJSON, ScanTransferJSON, ScriptsService } from './scripts.service'

type InscriptionJSON = ScanDeployJSON | ScanMintJSON | ScanTransferJSON

@Injectable()
export class TasksService {
  constructor(
    private provider: JsonProviderService,
    private scripts: ScriptsService,
    private inscription: InscriptionService,
  ) { }

  private readonly logger = new Logger(TasksService.name)
  private locked = false

  @Interval(3000)
  async loadBlocks() {
    if (this.locked)
      return
    this.locked = true
    const lastBlockNumber = await this.provider.getLastBlockNumber()
    const startBlockNumber = await getIndexerLastBlock()
    const endBlockNumber = Math.min(startBlockNumber + 10, lastBlockNumber)
    this.logger.log(`Blockchain current block number is ${lastBlockNumber}`)
    if (startBlockNumber >= endBlockNumber)
      return
    this.logger.log(`Regularly scan blockchain ${startBlockNumber} to ${endBlockNumber} blocks`)
    try {
      await this.nextBlocks(startBlockNumber, endBlockNumber)
      await setIndexerLastBlock(endBlockNumber)
    }
    catch (error) {
      if (error.name.startsWith('Prisma'))
        this.logger.warn(`Tasks ${error.name}-${error.code}: ${error.meta.modelName} - ${error.meta.target}`)
      else
        this.logger.warn(error.message)
    }

    this.locked = false
  }

  async nextBlocks(start: number, end: number) {
    const blocks = await this.provider.getBlockByArangeWithTransactions(start, end)
    // const transactions = [
    //   // deploy - goerli
    //   // await this.provider.getTransaction('0x1c81625f7727e8825794d81adf2bc217a6d9302166df5db95df610ff1c3c0a3e'),
    //   // mint - goerli
    //   // await this.provider.getTransaction('0xd75cfb4d592a200b25845a6861c91707a94c428499303bee964d080f28b3c926'),
    // ]
    // for (const block of [{ transactions, timestamp: 1 }]) {
    for (const block of blocks) {
      for (const transaction of block.transactions) {
        if (!transaction.data.startsWith('0x7b2270223a226d73632d323022'))
          continue
        const receipt = await transaction.wait()
        if (receipt.status !== 1)
          continue

        const json = toUtf8String(transaction.data)
        const inscription = JSON.parse(json) as InscriptionJSON

        this.logger.log(`transaction hash: ${transaction.hash}`)
        this.logger.log(`inscription json: ${json}`)

        try {
          const existInscription = await this.inscription.someInscription(transaction.hash)
          if (existInscription)
            throw new Error(`Inscription Error: attempting to record existing inscription(${transaction.hash.slice(0, 12)})`)
          if (inscription.op === 'deploy')
            await this.scripts.deploy(block as any, transaction, inscription)
          if (inscription.op === 'transfer')
            await this.scripts.transfer(block as any, transaction, inscription)
          if (inscription.op === 'mint')
            await this.scripts.mint(block as any, transaction, inscription)
          await this.inscription.recordInscription({
            from: transaction.from,
            to: transaction.to,
            hash: transaction.hash,
            op: inscription.op,
            tick: String(inscription.tick),
            time: new Date(block.timestamp * 1000),
            json,
          })
        }
        catch (error) {
          if (error.code === 'P2002')
            throw new Error(`The current hash(${transaction.hash}) already exists, skipping record`)
          throw error
        }
      }
    }
  }
}
