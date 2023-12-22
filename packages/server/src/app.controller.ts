import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common'
import { Inscription, Prisma } from '@prisma/client'
import { InscriptionService } from './services/inscription.service'
import { HolderService } from './services/holder.service'
import { TickService } from './services/tick.service'

@Controller()
export class AppController {
  constructor(
    private readonly inscriptionService: InscriptionService,
    private readonly holderService: HolderService,
    private readonly tickService: TickService,
  ) {}

  @Get('inscription')
  async getInscriptions(): Promise<Inscription[]> {
    return this.inscriptionService.inscriptions({
      orderBy: { number: 'asc' },
    })
  }

  @Get('inscription/:hash')
  async getInscription(@Param('hash') hash: string) {
    const inscription = await this.inscriptionService.inscription({ hash })
    const tick = await this.tickService.tick({ tick: inscription.tick })

    return {
      hash: inscription.hash,
      creator: inscription.from,
      owner: inscription.to,
      from: inscription.from,
      to: inscription.to,
      number: tick.number,
      supply: tick.total,
      time: inscription.time,
      json: inscription.json,
    }
  }

  @Get('holder')
  async getHoldersByAddress(@Query('address') address: string) {
    return this.holderService.holders({
      where: { owner: address },
    })
  }

  @Get('token')
  async getTicks(
    @Query('keyword') keyword = '',
    // 1:all, 2:in-progress, 3:completed
    @Query('type') type = 3,
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const orders: Record<number, Prisma.TickOrderByWithRelationInput> = {
      1: { lastTime: 'asc' },
      2: { completedTime: { nulls: 'first', sort: 'asc' } },
      3: { completedTime: { nulls: 'last', sort: 'asc' } },
    }
    return this.tickService.ticks({
      orderBy: orders[type],
      skip: (page - 1) * limit,
      take: limit,
      where: keyword ? { tick: { contains: keyword } } : undefined,
    })
  }
}
