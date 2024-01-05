import { Injectable, Logger } from '@nestjs/common'
import { Cron, Interval } from '@nestjs/schedule'
import { TransactionResponse, toUtf8String } from 'ethers'
import { cyan, dim, gray, reset } from 'chalk'
import { ConfigService } from '@nestjs/config'
import { omit } from 'lodash'
import { getIndexerLastBlock, setIndexerLastBlock } from '../utils'

import { BlockWithTransactions, ProviderService } from './provider.service'
import { InscriptionService } from './inscription.service'
import { ScanCancelJSON, ScanDeployJSON, ScanListJSON, ScanMintJSON, ScanTransferJSON, ScriptsService } from './scripts.service'

type InscriptionJSON = ScanDeployJSON | ScanMintJSON | ScanTransferJSON | ScanListJSON | ScanCancelJSON

@Injectable()
export class TasksService {
  constructor(
    private provider: ProviderService,
    private scripts: ScriptsService,
    private inscription: InscriptionService,
    private config: ConfigService,
  ) {}

  private readonly logger = new Logger('Task')
  private locked = false

  @Interval(3000)
  async indexer() {
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

    await this.processBlocksTransactions(startBlockNumber, endBlockNumber)
    await setIndexerLastBlock(endBlockNumber + 1)
    this.locked = false
  }

  @Cron('0 */5 * * * *')
  async inspector() {
    await this.scripts.checks()
  }

  async processBlocksTransactions(start: number, end: number) {
    const blocks = await this.provider.getBlockByArangeWithTransactions(start, end)

    for (const block of blocks) {
      for (const transaction of block.transactions) {
        if ((await transaction.wait()).status !== 1)
          continue

        if (transaction.to === this.config.get('NEST_MARKET_CONTRACT'))
          await this.processMarketContractTransaction(block, transaction)

        if (transaction.data.startsWith('0x7b2270223a226d73632d323022'))
          this.processInscriptionTransaction(block, transaction)
      }
    }
  }

  async processMarketContractTransaction(block: BlockWithTransactions, transaction: TransactionResponse) {
    const events = await this.provider.queryFilterByHash(
      'inscription_msc20_transferForListing',
      transaction.hash,
    )

    if (!events.length)
      return
    const data = events
      .map(e => e.args?.toObject?.())
      .filter(Boolean)
      .map(o => omit(o, ['filterId']))
    const json = JSON.stringify(data)

    this.logger.log(reset(`Transaction hash: ${dim(transaction.hash)}`))

    await this.scripts.buyMany(block, transaction, events)
    await this.inscription.create({
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
      op: 'buy',
      tick: 'none',
      time: new Date(block.timestamp * 1000),
      json,
    })
  }

  async processInscriptionTransaction(block: BlockWithTransactions, transaction: TransactionResponse) {
    try {
      const json = toUtf8String(transaction.data)
      const inscription = JSON.parse(json) as InscriptionJSON
      const existInscription = await this.inscription.some(transaction.hash)
      if (existInscription)
        throw new Error(`[inscription] - Attempting to record existing inscription(${transaction.hash.slice(0, 12)})`)

      this.logger.log(reset(`Transaction hash: ${dim(transaction.hash)}`))
      this.logger.log(reset(`Inscription json: ${dim(json)}`))

      switch (inscription.op) {
        case 'deploy':
          await this.scripts.deploy(block, transaction, inscription)
          break
        case 'transfer':
          await this.scripts.transfer(block, transaction, inscription)
          break
        case 'mint':
          await this.scripts.mint(block, transaction, inscription)
          break
        case 'list':
          await this.scripts.list(block, transaction, inscription)
          break
        case 'cancel':
          await this.scripts.cancel(block, transaction, inscription)
          break
      }

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
