import { Injectable, Logger } from '@nestjs/common'
import { TransactionResponse } from 'ethers'
import { bgWhite, cyan, reset, yellow } from 'chalk'
import { ConfigService } from '@nestjs/config'
import { SchedulerRegistry } from '@nestjs/schedule'
import { Order } from '@prisma/client'
import { BlockWithTransactions } from './provider.service'
import { HolderService } from './holder.service'
import { TickService } from './tick.service'
import { HexagonService } from './hexagon.service'
import { OrderService } from './order.service'
import { InscriptionService } from './inscription.service'

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
  amt: string | number
  hex: string
}
export interface ScanTransferJSON {
  p: 'msc-20'
  op: 'transfer'
  tick: string
  amt: string
}
export interface ScanListJSON {
  p: 'msc-20'
  op: 'list'
  tick: string
  amt: string
  pre: string
  exp: string
}

export interface ScanCancelJSON {
  p: 'msc-20'
  op: 'cancel'
  tick: string
  hash: string
}
export interface ScanBuyJSON {
  p: 'msc-20'
  op: 'buy'
  tick: string
  hash: string
}

@Injectable()
export class ScriptsService {
  constructor(
    private holderService: HolderService,
    private tickService: TickService,
    private hexagonService: HexagonService,
    private orderService: OrderService,
    private inscriptionService: InscriptionService,
    private config: ConfigService,
  ) {
  }

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
        total: BigInt(inscription.max),
        limit: BigInt(inscription.lim),
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
    if (tick.completedTime || surplus <= 0)
      throw new Error(`${inscription.tick} Completed`)

    let amount = BigInt(inscription.amt)
    if (amount > tick.limit)
      throw new Error(`Exceeded ${inscription.tick} limit number of mints by ${tick.limit}`)

    if (amount > surplus)
      amount = surplus

    await this.hexagonService.incrementValue(
      { hex: inscription.hex, tik: inscription.tick },
      { value: amount },
    )

    await this.holderService.incrementValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: amount, number: tick.number },
    )

    await this.tickService.incrementMinted(
      inscription.tick,
      { value: amount },
    )

    if ((amount + tick.minted) === tick.total) {
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

    const amount = BigInt(inscription.amt)

    await this.holderService.decrementValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: amount },
    )
    await this.holderService.incrementValue(
      { owner: transaction.to, tick: inscription.tick },
      { value: amount, number: tick.number },
    )

    const fromLogText = yellow(transaction.from.slice(0, 12))
    const toLogText = yellow(transaction.to.slice(0, 12))
    const amtLogText = cyan(`${inscription.amt} ${tick.tick}`)
    const hashLogText = yellow(transaction.hash.slice(0, 12))

    this.logger.log(reset(`${bgWhite('[transferred]')} - transfer ${amtLogText} from ${fromLogText} to ${toLogText} in ${hashLogText}`))
  }

  async list(
    _block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanListJSON,
  ) {
    const tick = await this.tickService.detail({ tick: String(inscription.tick) })
    const contract = this.config.get('NEST_MARKET_CONTRACT')
    const yearTimestamp = 24 * 3600 * 1000 * 365
    const expiration = Number(inscription.exp)

    if (!tick)
      throw new Error(`[list] - Attempting to transfer into non-existent tick( ${inscription.tick} )`)

    if (transaction.to !== contract)
      throw new Error(`[list] - Listing exception, listing through an unverified address`)

    if (expiration > yearTimestamp)
      throw new Error(`Exceeded the time limit for listing`)

    await this.holderService.decrementValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: BigInt(inscription.amt) },
    )

    await this.holderService.incrementValue(
      { owner: transaction.to, tick: inscription.tick },
      { value: BigInt(inscription.amt), number: tick.number },
    )

    await this.orderService.create({
      amount: BigInt(inscription.amt),
      price: inscription.pre,
      tick: inscription.tick,
      hash: transaction.hash,
      maker: transaction.from,
      expiration: new Date(Date.now() + Number(inscription.exp)),
      status: 0,
    })
  }

  async cancel(
    _block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanCancelJSON,
  ) {
    const order = await this.orderService.detail({ hash: inscription.hash })
    const record = await this.inscriptionService.detail({ hash: inscription.hash })
    if (!record || !order)
      throw new Error('Unlisted Inscription')
    if (record.from.toUpperCase() !== transaction.from.toUpperCase())
      throw new Error(`Attempt to remove inscriptions that do not belong to ${transaction.hash}`)
    if (order.status !== 0)
      throw new Error(`the order has been processed`)

    await this.orderService.update(inscription.hash, {
      status: 2,
    })

    await this.refund(order)
  }

  async buy(
    _block: BlockWithTransactions,
    _transaction: TransactionResponse,
    _inscription: ScanCancelJSON,
  ) {

  }

  async refund(order: Order) {
    const contract = this.config.get('NEST_MARKET_CONTRACT')

    await this.holderService.decrementValue(
      { owner: contract, tick: order.tick },
      { value: BigInt(order.amount) },
    )

    await this.holderService.incrementValue(
      { owner: order.maker, tick: order.tick },
      { value: BigInt(order.amount) },
    )
  }

  async checks() {
    const orders = await this.orderService.lists({
      where: { status: 0 },
    })
    for (const order of orders) {
      const current = Date.now()
      if (order.expiration.valueOf() > current)
        continue
      this.orderService.update(order.hash, {
        status: 3,
      })
      await this.refund(order)
      const hashLogText = yellow(order.hash.slice(0, 12))
      this.logger.log(reset(`${bgWhite('[expired]')} - order in ${hashLogText}`))
    }
  }
}
