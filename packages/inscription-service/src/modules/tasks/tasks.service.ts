import { Injectable, Logger } from '@nestjs/common'
import { Cron, Interval } from '@nestjs/schedule'
import { TransactionResponse, toUtf8String } from 'ethers'
import { cyan, dim, gray, reset } from 'chalk'
import { ConfigService } from '@nestjs/config'
import { omit } from 'lodash'
import { ScriptsService } from '../scripts'
import { BlockWithTransactions, ProviderService } from '../provider'
import { InscriptionService } from '../inscription'
import { getIndexerLastBlock, setIndexerLastBlock } from './utils'
import { InscriptionJSON } from './types'

@Injectable()
export class TasksService {
  constructor(
    private provider: ProviderService,
    private scripts: ScriptsService,
    private inscription: InscriptionService,
    private config: ConfigService,
  ) { }

  private readonly logger = new Logger('Task')
  private locked = false

  @Interval(3000)
  async indexer() {
    if (this.locked)
      return
    this.locked = true
    try {
      const lastBlockNumber = await this.provider.getLastBlockNumber()
      const startBlockNumber = await getIndexerLastBlock()
      const endBlockNumber = Math.min(startBlockNumber + 10, lastBlockNumber)
      if (startBlockNumber > endBlockNumber) {
        this.locked = false
        return
      }

      await this.printlnBeforeParseBlockArange(startBlockNumber, endBlockNumber)
      await this.processBlocksTransactions(startBlockNumber, endBlockNumber)
      await setIndexerLastBlock(endBlockNumber + 1)
      this.locked = false
    }
    catch (error) {
      this.logger.warn(error.message)
      this.locked = false
    }
  }

  @Cron('0 */5 * * * *')
  async inspector() {
    await this.scripts.checks()
  }

  async processBlocksTransactions(start: number, end: number) {
    const blocks = await this.provider.getBlockByArangeWithTransactions(start, end)
    for (const block of blocks) {
      for (const transaction of block.transactions) {
        try {
          if ((await transaction.wait()).status !== 1)
            continue
          if (transaction.to === this.config.get('NEST_MARKET_CONTRACT'))
            await this.processMarketContractTransaction(block, transaction)
          if (transaction.data.startsWith('0x7b2270223a226d73632d323022'))
            await this.processInscriptionTransaction(block, transaction)
        }
        catch (error) {
          this.logger.error(error)
        }
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
    this.logger.log(reset(`Transaction hash: ${dim(transaction.hash)}`))

    const orders = await this.scripts.buyMany(block, transaction, events)
    const amount = orders.reduce((n, o) => n + o.amount, 0n)
    const token = orders[0].tick

    await this.inscription.create({
      json: `{"p":"msc-20","op":"buy","tick":"${token}","amt":"${amount}"}`,
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
      op: 'buy',
      tick: token,
      time: new Date(block.timestamp * 1000),
    })
  }

  async processInscriptionTransaction(block: BlockWithTransactions, transaction: TransactionResponse) {
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

  async printlnBeforeParseBlockArange(start: number, end: number) {
    const titleLogText = `${reset.underline('[scan]')} ${gray('- regularly scan blockchain')}`
    const rangeLogText = start !== end
      ? `${cyan(`${start} ${gray('to')} ${end}`)} ${gray('blocks')}`
      : `${cyan(start)} ${gray('block')}`
    this.logger.log(`${titleLogText} ${rangeLogText}`)
  }
}
