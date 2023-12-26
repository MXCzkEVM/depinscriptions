import { Injectable, Logger } from '@nestjs/common'
import { TransactionResponse } from 'ethers'
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

  private readonly logger = new Logger(ScriptsService.name)

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
        total: +inscription.max,
        limit: +inscription.lim,
        tick: inscription.tick,
      })

      this.logger.log(`[deployed] - ${inscription.tick} were deploy at ${transaction.from.slice(0, 12)}`)
    }
    catch (error) {
      if (error.code === '2002')
        throw new Error('Deploy Error: The current hash already exists, skipping record')
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
    if (+inscription.amt > tick.limit)
      throw new Error(`Mint Error: Exceeded ${inscription.tick} limit number of mints by ${tick.limit}`)
    if (+inscription.amt > surplus)
      throw new Error(`Mint Error: Exceeded ${inscription.tick} total number of mints by ${tick.total}`)

    await this.hexagonService.incrementHexagonValue(
      { hex: inscription.hex, tik: inscription.tick },
      { value: +inscription.amt },
    )

    await this.holderService.incrementHolderValue(
      { owner: transaction.from, tick: inscription.tick },
      { value: +inscription.amt, number: tick.number },
    )

    await this.tickService.incrementTickMinted(
      inscription.tick,
      { value: +inscription.amt },
    )

    if ((+inscription.amt + tick.minted) === tick.total) {
      await this.tickService.updateTick(
        inscription.tick,
        { completedTime: new Date(block.timestamp * 1000) },
      )
    }

    this.logger.log(`[minted] - ${inscription.amt} ${tick.tick} were mint at ${transaction.from.slice(0, 12)}`)
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
      { value: +inscription.amt },
    )
    await this.holderService.incrementHolderValue(
      { owner: transaction.to, tick: inscription.tick },
      { value: +inscription.amt, number: tick.number },
    )
  }
}