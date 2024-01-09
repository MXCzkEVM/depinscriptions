import { Injectable, Logger } from '@nestjs/common'
import { AbiCoder, EventLog, Signature, TransactionResponse, solidityPackedKeccak256, toBeArray } from 'ethers'
import { bgWhite, cyan, reset, yellow } from 'chalk'
import { ConfigService } from '@nestjs/config'
import { Order } from '@prisma/client'
import { HolderService } from '../holder'
import { TokenService } from '../token'
import { HexagonService } from '../hexagon'
import { OrderService } from '../order'
import { InscriptionService } from '../inscription'
import { BlockWithTransactions, ProviderService } from '../provider'
import { ScanCancelJSON, ScanDeployJSON, ScanListJSON, ScanMintJSON, ScanTransferJSON, ScriptLogOptions } from './types'

@Injectable()
export class ScriptsService {
  private readonly logger = new Logger('Task')

  constructor(
    private holderService: HolderService,
    private tickService: TokenService,
    private hexagonService: HexagonService,
    private orderService: OrderService,
    private inscriptionService: InscriptionService,
    private provider: ProviderService,
    private config: ConfigService,
  ) {

  }

  private log(type: string, options: ScriptLogOptions) {
    const {
      from,
      hash,
      to,
      amount,
      desc,
    } = options
    const fromLogText = from ? yellow(from.slice(0, 12)) : ''
    const toLogText = to ? yellow(to.slice(0, 12)) : ''
    const hashLogText = yellow(hash.slice(0, 12))
    const amtLogText = amount ? ` ${cyan(`${amount}`)} from ` : ''
    const logs = [
      bgWhite(`[${type}]`),
      ' - ',
      desc,
      amtLogText,
      fromLogText,
      toLogText,
      ' in ',
      hashLogText,
    ]
    this.logger.log(reset(logs.join('')))
  }

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
    const amtLogText = cyan(`${inscription.amt} ${tick.tick}`)
    this.log('minted', {
      desc: `${amtLogText} were minted at `,
      from: transaction.from,
      hash: transaction.hash,
    })
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

    this.log('transferred', {
      desc: `transfer`,
      amount: `${inscription.amt} ${tick.tick}`,
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
    })
  }

  async list(
    _block: BlockWithTransactions,
    transaction: TransactionResponse,
    inscription: ScanListJSON,
  ) {
    const token = await this.tickService.detail({ tick: String(inscription.tick) })
    const contract = this.config.get('NEST_MARKET_CONTRACT')
    const yearTimestamp = 24 * 3600 * 1000 * 365
    const expiration = Number(inscription.exp)

    if (!token)
      throw new Error(`[list] - Attempting to transfer into non-existent tick( ${inscription.tick} )`)

    if (transaction.to.toLowerCase() !== contract.toLowerCase())
      throw new Error(`[list] - Listing exception, listing through an unverified address`)

    if (!token.market)
      throw new Error(`[list] - ${token.tick} not allowed to be listed`)

    if (expiration > yearTimestamp)
      throw new Error(`Exceeded the time limit for listing`)

    await this.holderService.decrementValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: BigInt(inscription.amt) },
    )

    await this.holderService.incrementValue(
      { owner: transaction.to, tick: inscription.tick },
      { value: BigInt(inscription.amt), number: token.number },
    )

    const messageHash = solidityPackedKeccak256(
      ['string', 'string', 'address', 'uint256', 'uint256'],
      [transaction.hash, inscription.tick, transaction.from, inscription.amt, inscription.pre],
    )
    const messageByte = toBeArray(messageHash)
    const message = await this.provider.signMessage(messageByte)
    const { r, s, v } = Signature.from(message)

    await this.orderService.create({
      amount: BigInt(inscription.amt),
      price: inscription.pre,
      tick: inscription.tick,
      hash: transaction.hash,
      maker: transaction.from,
      expiration: new Date(Date.now() + Number(inscription.exp)),
      json: JSON.stringify({ r, s, v, hex: inscription.hex }),
      status: 0,
    })

    this.log('listed', {
      desc: `list`,
      amount: `${inscription.amt} ${token.tick}`,
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
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
      finalHash: transaction.hash,
      status: 2,
    })

    await this.refund(order)

    this.log('cancelled', {
      desc: `refund`,
      amount: `${order.amount} ${order.tick}`,
      from: transaction.from,
      to: transaction.to,
      hash: transaction.hash,
    })
  }

  async buyMany(
    _block: BlockWithTransactions,
    transaction: TransactionResponse,
    events: EventLog[],
  ) {
    const contract = this.config.get('NEST_MARKET_CONTRACT')
    const processes = events
      .map(e => e.args?.toObject?.())
      .filter(Boolean)
    const orders: Order[] = []
    for (const { id: hash, buyer } of processes) {
      const order = await this.orderService.detail({ hash })
      if (!order) {
        this.logger.warn('Attempt to purchase non-existent orders')
        continue
      }

      if (order.status !== 0) {
        this.logger.warn('Order has expired')
        continue
      }
      await this.holderService.incrementValue(
        { owner: buyer, tick: order.tick },
        { value: BigInt(order.amount) },
      )
      await this.holderService.decrementValue(
        { owner: contract, tick: order.tick },
        { value: BigInt(order.amount) },
      )
      await this.orderService.update(hash, {
        finalHash: transaction.hash,
        status: 1,
        buyer,
      })

      orders.push(order)

      this.log('purchased', {
        desc: `buy`,
        amount: `${order.amount} ${order.tick}`,
        to: order.maker,
        from: buyer,
        hash: transaction.hash,
      })
    }
    return orders
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
        finalHash: order.hash,
        status: 3,
      })
      await this.refund(order)
      const hashLogText = yellow(order.hash.slice(0, 12))
      this.logger.log(reset(`${bgWhite('[expired]')} - order in ${hashLogText}`))
    }
  }
}
