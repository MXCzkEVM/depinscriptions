import { Injectable, Logger } from '@nestjs/common'
import { TransactionResponse } from 'ethers'
import { bgWhite, cyan, reset, yellow } from 'chalk'
import { BlockWithTransactions } from './provider.service'
import { HolderService } from './holder.service'
import { TickService } from './tick.service'
import { HexagonService } from './hexagon.service'

export interface ScanDeployJSON {
  p: 'msc-20'
  op: 'deploy'
  tick: string
  max: string
  lim: string
}
export interface ScanMintJSON {
  p: 'msc-20'
  op: 'mint'
  tick: string
  amt: string
  hex: string
}
export interface ScanTransferJSON {
  p: 'msc-20'
  op: 'transfer'
  tick: string
  amt: string
}

@Injectable()
export class ScriptsService {
  constructor(
    private holderService: HolderService,
    private tickService: TickService,
    private hexagonService: HexagonService,
  ) { }

  private readonly logger = new Logger('TasksService')

  async deploy(
    block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanDeployJSON,
  ) {
    try {
      await this.tickService.create({
        creator: transaction.from,
        deployTime: new Date(block.timestamp * 1000),
        deployHash: transaction.hash,
        total: +inscription.max,
        limit: +inscription.lim,
        tick: inscription.tick,
      })
      const fromLogText = yellow(transaction.from.slice(0, 12))
      const hashLogText = yellow(transaction.hash.slice(0, 12))
      this.logger.log(reset(`${bgWhite('[deployed]')} - ${cyan(inscription.tick)} were z at ${fromLogText} in ${hashLogText}`))
    }
    catch (error) {
      if (error.code === '2002')
        throw new Error('[deploy] - The current hash already exists, skipping record')
      throw error
    }
  }

  async mint(
    block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanMintJSON,
  ) {
    const tick = await this.tickService.detail({ tick: String(inscription.tick) })
    if (!tick)
      throw new Error(`[mint] - Attempting to mint into non-existent tick(${inscription.tick})`)

    const surplus = tick.total - tick.minted
    if (+inscription.amt > tick.limit)
      throw new Error(`Exceeded ${inscription.tick} limit number of mints by ${tick.limit}`)
    if (+inscription.amt > surplus)
      throw new Error(`Exceeded ${inscription.tick} total number of mints by ${tick.total}`)

    await this.hexagonService.incrementValue(
      { hex: inscription.hex, tik: inscription.tick },
      { value: +inscription.amt },
    )

    await this.holderService.incrementValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: +inscription.amt, number: tick.number },
    )

    await this.tickService.incrementMinted(
      inscription.tick,
      { value: +inscription.amt },
    )

    if ((+inscription.amt + tick.minted) === tick.total) {
      await this.tickService.update(
        inscription.tick,
        { completedTime: new Date(block.timestamp * 1000) },
      )
    }
    const fromLogText = yellow(transaction.from.slice(0, 12))
    const hashLogText = yellow(transaction.hash.slice(0, 12))
    const amtLogText = cyan(`${inscription.amt} ${tick.tick}`)
    this.logger.log(reset(`${bgWhite('[minted]')} - ${amtLogText} were minted at ${fromLogText} in ${hashLogText}`))
  }

  async transfer(
    block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanTransferJSON,
  ) {
    const tick = await this.tickService.detail({ tick: String(inscription.tick) })
    if (!tick)
      throw new Error(`[transfer] - Attempting to transfer into non-existent tick( ${inscription.tick} )`)
    const holder = await this.holderService.detail({
      where: { tick: inscription.tick, owner: transaction.from },
    })
    if (!holder)
      throw new Error(`[transfer] - from(${transaction.from.slice(0, 12)}) does not have a holder`)
    await this.holderService.decrementValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: +inscription.amt },
    )
    await this.holderService.incrementValue(
      { owner: transaction.to, tick: inscription.tick },
      { value: +inscription.amt, number: tick.number },
    )
    const fromLogText = yellow(transaction.from.slice(0, 12))
    const toLogText = yellow(transaction.to.slice(0, 12))
    const amtLogText = cyan(`${inscription.amt} ${tick.tick}`)
    const hashLogText = yellow(transaction.hash.slice(0, 12))

    this.logger.log(reset(`${bgWhite('[transferred]')} - transfer ${amtLogText} from ${fromLogText} to ${toLogText} in ${hashLogText}`))
  }
}
