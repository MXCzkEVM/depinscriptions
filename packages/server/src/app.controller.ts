import { Body, Controller, Get, Param, Post, Query, Request } from '@nestjs/common'
import { Holder, Inscription, Prisma, Tick } from '@prisma/client'
import { InscriptionService } from './services/inscription.service'
import { HolderService } from './services/holder.service'
import { TickService } from './services/tick.service'
import { ApiConsumes, ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HolderDto, HoldersResponseDto, InscriptionDto, InscriptionPageResponseDto, InscriptionResponseDto, TickDto, TickPageResponseDto } from 'dtos'




@Controller()
@ApiTags('app-controller')
@ApiExtraModels(TickDto)
@ApiExtraModels(HolderDto)
@ApiExtraModels(InscriptionDto)
export class AppController {
  constructor(
    private readonly inscriptionService: InscriptionService,
    private readonly holderService: HolderService,
    private readonly tickService: TickService,
  ) { }

  @Get('inscription')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionPageResponseDto, description: 'Inscription' })
  async getInscriptions(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const total = await this.inscriptionService.inscriptionCount({
      orderBy: { number: 'asc' },
    })
    const data = await this.inscriptionService.inscriptions({
      orderBy: { number: 'asc' },
      skip: (page - 1) * limit,
      take: limit,
    })
    return { total, data }
  }

  @Get('inscription/:hash')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionResponseDto, description: 'Inscription' })
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
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: HoldersResponseDto, description: 'holders' })
  async getHoldersByAddress(@Query('address') address: string) {
    const data = await this.holderService.holders({
      where: { owner: address },
    })
    return { data }
  }

  @Get('token')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TickPageResponseDto, description: 'Ticks' })
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
    const total = await this.tickService.getTickCount({
      where: keyword ? { tick: { contains: keyword } } : undefined,
    })
    const data = await this.tickService.ticks({
      orderBy: orders[type],
      skip: (page - 1) * limit,
      take: limit,
      where: keyword ? { tick: { contains: keyword } } : undefined,
    })
    return { total, data }
  }

  @Get('market')
  async getMarkets(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    return this.tickService.getTickByMarket(page, limit)
  }
}
