import { Body, Controller, Get, NotFoundException, Param, Post, Query, Request } from '@nestjs/common'
import { Holder, Inscription, Prisma } from '@prisma/client'
import { InscriptionService } from './services/inscription.service'
import { HolderService } from './services/holder.service'
import { TickService } from './services/tick.service'
import { ApiConsumes, ApiExtraModels, ApiParam, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { HexagonDto, HexagonPageResponseDto, HolderDto, HolderPageResponseDto, InscriptionDto, InscriptionPageResponseDto, InscriptionResponseDto, TickDto, TickPageResponseDto } from 'dtos'
import { HexagonService } from './services/hexagon.service'

@Controller()
@ApiTags('app-controller')
@ApiExtraModels(TickDto)
@ApiExtraModels(HolderDto)
@ApiExtraModels(InscriptionDto)
@ApiExtraModels(HexagonDto)
export class AppController {
  constructor(
    private readonly inscriptionService: InscriptionService,
    private readonly holderService: HolderService,
    private readonly tickService: TickService,
    private readonly hexagonService: HexagonService,
  ) {}

  @Get('inscription')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionPageResponseDto, description: 'Inscriptions' })
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
      take: +limit,
    })
    return { total, data }
  }

  @Get('inscription/:hash')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionResponseDto, description: 'Inscription' })
  async getInscription(@Param('hash') hash: string) {
    const inscription = await this.inscriptionService.inscription({ hash })
    if (!inscription)
      throw new NotFoundException('Inscription not found')
    const tick = await this.tickService.tick({ tick: inscription?.tick })
    if (!tick)
      throw new NotFoundException(`Not relevant information found Tick [${inscription.tick}]`)

    const holders = await this.holderService.holderCount({
      where: { tick: inscription.tick }
    })
    return {
      tick: inscription.tick,
      hash: inscription.hash,
      creator: inscription.from,
      owner: inscription.to,
      from: inscription.from,
      to: inscription.to,
      number: tick.number,
      supply: tick.total,
      time: inscription.time,
      json: inscription.json,
      holders,
    }
  }

  @Get('hexagon')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'tick', type: 'string' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiResponse({ status: 200, type: HexagonPageResponseDto, description: 'Hexagons' })
  async getHexagons(
    @Query('tick') tick?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const total = await this.hexagonService.hexagonCount({
      where: { tik: tick }
    })
    const data = await this.hexagonService.hexagons({
      skip: (page - 1) * limit,
      take: +limit,
      where: { tik: tick }
    })
    return { data, total }
  }

  @Get('holder')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'address', type: 'string', required: false })
  @ApiQuery({ name: 'tick', type: 'string', required: false })
  @ApiQuery({ name: 'order', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: HolderPageResponseDto, description: 'holders' })
  async getHolders(
    @Query('tick') tick?: string,
    @Query('address') address?: string,
    @Query('order') order?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const orderBy: Prisma.HolderOrderByWithRelationInput = {}
    const where = { tick, owner: address }
    order && (orderBy[order] = 'asc')
    const total = await this.holderService.holderCount({ where })
    const data = await this.holderService.holders({
      skip: (page - 1) * limit,
      take: +limit,
      where,
      orderBy
    })
    return { data, total }
  }


  @Get('token')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'keyword', type: 'string' })
  @ApiQuery({ name: 'type', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
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
    const where = keyword ? { tick: { contains: keyword } } : undefined
    const total = await this.tickService.getTickCount({ where })
    const data = await this.tickService.ticks({
      orderBy: orders[type],
      skip: (page - 1) * limit,
      take: +limit,
      where,
    })
    return { total, data }
  }

  @Get('token/:id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TickDto, description: 'Ticks' })
  async getTick(@Param('id') id: string) {
    const data = await this.tickService.tick({ tick: id })
    if (!data)
      throw new NotFoundException(`Not found Tick [${id}]`)
    return data
  }

  @Get('market')
  async getMarkets(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    return this.tickService.getTickByMarket(page, limit)
  }
}
