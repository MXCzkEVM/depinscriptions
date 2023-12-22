import { Injectable, Logger } from '@nestjs/common'
import { Interval } from '@nestjs/schedule'
import { getIndexerLastBlock, setIndexerLastBlock } from 'src/utils'
import { TransactionResponse, toUtf8String } from 'ethers'

import { BlockWithTransactions, jsonProviderService } from './provider.service'
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
  op: 'mint'
  tick: string
  amt: string
  hex: string
}
interface ScanTransferJSON {
  p: 'msc-20'
  op: 'transfer'
  tick: string
  amt: string
  hex: string
}

type ScanJSONType = ScanDeployJSON | ScanMintJSON | ScanTransferJSON

@Injectable({
})
export class TasksService {
  constructor(
    private provider: jsonProviderService,
    private holderService: HolderService,
    private tickService: TickService,
    private inscriptionService: InscriptionService,
  ) { }

  private readonly logger = new Logger(TasksService.name)
  private locked = false

  @Interval(3000)
  async handleBlock() {
    if (this.locked)
      return
    this.locked = true
    const lastBlockNumber = await this.provider.getLastBlockNumber()
    const startBlockNumber = await getIndexerLastBlock()
    const endBlockNumber = Math.min(startBlockNumber + 10, lastBlockNumber)
    this.logger.debug(`----start---- parse block_number: ${startBlockNumber} - ${endBlockNumber}`)
    try {
      await this.nextBlocks(startBlockNumber, endBlockNumber)
      await setIndexerLastBlock(endBlockNumber)
      this.logger.debug(`-----end----- parse block_number: ${startBlockNumber} - ${endBlockNumber}`)
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
    const blocks = await this.provider.getBlockByArangeWithTransactions(
      start,
      end,
    )
    // const transactions = [
    //   await this.provider.getTransaction(
    //     '0x28a46a361072b179415971d01e0c7cc3ee95b9914722527369d656add25c2da0',
    //   ),
    // ]
    for (const block of blocks) {
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
          const existInscription = this.inscriptionService.someInscription(transaction.hash)
          if (existInscription)
            throw new Error(`Inscription Error: attempting to record existing inscription(${transaction.hash.slice(0, 12)})`)
          if (inscription.op === 'deploy')
            await this.deploy(block, transaction, inscription)
          if (inscription.op === 'transfer')
            await this.transfer(block, transaction, inscription)
          if (inscription.op === 'mint')
            await this.mint(block, transaction, inscription)
          await this.inscriptionService.recordInscription({
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

  async deploy(
    block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanDeployJSON,
  ) {
    try {
      await this.tickService.createTick({
        creator: transaction.from,
        deployTime: new Date(block.timestamp * 1000),
        deployHash: transaction.hash,
        limit: +inscription.lim,
        tick: inscription.tick,
      })
    }
    catch (error) {
      if (error.code === '2002')
        throw new Error('The current hash already exists, skipping record')
      throw error
    }
  }

  async mint(
    block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanMintJSON,
  ) {
    const tick = await this.tickService.tick({ tick: String(inscription.tick) })
    if (!tick)
      throw new Error(`Mint Error: Attempting to mint into non-existent tick(${inscription.tick})`)

    const surplus = tick.total - tick.minted
    const amount = BigInt(inscription.amt)
    if (amount > tick.limit)
      throw new Error(`Mint Error: Exceeded ${inscription.tick} limit number of mints by ${tick.limit}`)
    if (amount > surplus)
      throw new Error(`Mint Error: Exceeded ${inscription.tick} total number of mints by ${tick.total}`)

    await this.holderService.incrementHolderValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: inscription.amt, number: tick.number },
    )
  }

  async transfer(
    block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanTransferJSON,
  ) {
    const tick = await this.tickService.tick({ tick: String(inscription.tick) })
    if (!tick)
      throw new Error(`Transfer Error: Attempting to transfer into non-existent tick( ${inscription.tick} )`)
    const holder = await this.holderService.holder({
      where: { tick: inscription.tick, owner: transaction.from },
    })
    if (!holder)
      throw new Error(`Transfer Error: from(${transaction.from.slice(0, 12)}) does not have a holder`)
    await this.holderService.decrementHolderValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: inscription.amt },
    )
    await this.holderService.incrementHolderValue(
      { owner: transaction.to, tick: inscription.tick },
      { value: inscription.amt },
    )
  }
}
