import { Injectable, Logger } from '@nestjs/common'
import { Cron, Interval } from '@nestjs/schedule'
import { toUtf8String } from 'ethers'
import { cyan, dim, gray, reset } from 'chalk'
import { getIndexerLastBlock, setIndexerLastBlock } from '../utils'

import { JsonProviderService } from './provider.service'
import { InscriptionService } from './inscription.service'
import { ScanDeployJSON, ScanListJSON, ScanMintJSON, ScanTransferJSON, ScriptsService } from './scripts.service'

type InscriptionJSON = ScanDeployJSON | ScanMintJSON | ScanTransferJSON | ScanListJSON

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
    if (startBlockNumber > endBlockNumber) {
      this.locked = false
      return
    }
    const titleLogText = `${reset.underline('[scan]')} ${gray('- regularly scan blockchain')}`
    const rangeLogText = startBlockNumber !== endBlockNumber
      ? `${cyan(`${startBlockNumber} ${gray('to')} ${endBlockNumber}`)} ${gray('blocks')}`
      : `${cyan(startBlockNumber)} ${gray('block')}`
    this.logger.log(`${titleLogText} ${rangeLogText}`)
    await this.nextBlocks(startBlockNumber, endBlockNumber)
    await setIndexerLastBlock(endBlockNumber + 1)
    this.locked = false
  }

  async nextBlocks(start: number, end: number) {
    const blocks = await this.provider.getBlockByArangeWithTransactions(start, end)
    for (const block of blocks) {
      for (const transaction of block.transactions) {
        if (!transaction.data.startsWith('0x7b2270223a226d73632d323022'))
          continue
        const receipt = await transaction.wait()
        if (receipt.status !== 1)
          continue

        try {
          const json = toUtf8String(transaction.data)
          const inscription = JSON.parse(json) as InscriptionJSON

          const existInscription = await this.inscription.some(transaction.hash)
          if (existInscription)
            throw new Error(`[inscription] - Attempting to record existing inscription(${transaction.hash.slice(0, 12)})`)

          this.logger.log(reset(`Transaction hash: ${dim(transaction.hash)}`))
          this.logger.log(reset(`Inscription json: ${dim(json)}`))
          if (inscription.op === 'deploy')
            await this.scripts.deploy(block, transaction, inscription)
          if (inscription.op === 'transfer')
            await this.scripts.transfer(block, transaction, inscription)
          if (inscription.op === 'mint')
            await this.scripts.mint(block, transaction, inscription)
          if (inscription.op === 'list')
            await this.scripts.list(block, transaction, inscription)
          await this.inscription.create({
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
          if (error.name.startsWith('Prisma'))
            this.logger.warn(error.message || `[prisma:${error?.code}] ${error?.name}: ${error.meta?.modelName} - ${error.meta?.target}`)
          else
            this.logger.warn(error.message)
        }
      }
    }
  }

  @Cron('0 */5 * * * *')
  async timeoutOrders() {
    await this.scripts.checks()
  }
}
