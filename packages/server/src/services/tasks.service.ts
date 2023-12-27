import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { toUtf8String } from 'ethers'
import { cyan, dim, gray, reset } from 'chalk'
import { getIndexerLastBlock, setIndexerLastBlock } from '../utils'

import { JsonProviderService } from './provider.service'
import { InscriptionService } from './inscription.service'
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
    // const transactions = [
    //   // deploy - goerli
    //   // await this.provider.getTransaction('0x1c81625f7727e8825794d81adf2bc217a6d9302166df5db95df610ff1c3c0a3e'),
    //   // mint - goerli
    //   // await this.provider.getTransaction('0xbf120aca3b8a2be8c38a159c709eaffdba1254a4c9e3afeb9563093b3340070a'),
    //   // transfer - goerli
    //   // await this.provider.getTransaction('0xd9659286e85465b7ed03d3d2eabd29cb2d33718355833dd92f357141ddc73feb'),
    // ]
    // for (const block of [{ transactions, timestamp: 1 }]) {
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
            await this.scripts.deploy(block as any, transaction, inscription)
          if (inscription.op === 'transfer')
            await this.scripts.transfer(block as any, transaction, inscription)
          if (inscription.op === 'mint')
            await this.scripts.mint(block as any, transaction, inscription)
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
            this.logger.warn(`[prisma:${error.code}] ${error.name}: ${error.meta.modelName} - ${error.meta.target}`)
          else
            this.logger.warn(error.message)
        }
      }
    }
  }
}
