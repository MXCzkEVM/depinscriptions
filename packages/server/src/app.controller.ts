import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ApiConsumes, ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import {
  HexagonDto,
  HexagonPageResponseDto,
  HolderDto,
  HolderPageResponseDto,
  InscriptionDto,
  InscriptionPageResponseDto,
  InscriptionResponseDto,
  SomeResponseDto,
  TickDto,
  TickPageResponseDto,
} from './dtos'

import { InscriptionService } from './services/inscription.service'
import { HolderService } from './services/holder.service'
import { TickService } from './services/tick.service'
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
  ) { }

  @Get('inscription')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'owner', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionPageResponseDto, description: 'Inscriptions' })
  async getInscriptions(@Query('owner') owner?: string, @Query('page') page = 1, @Query('limit') limit = 15) {
    const total = await this.inscriptionService.count({
      where: owner ? { from: owner } : undefined,
    })
    const data = await this.inscriptionService.lists({
      orderBy: { number: 'desc' },
      where: owner ? { from: owner } : undefined,
      skip: (page - 1) * limit,
      take: +limit,
    })
    return { total, data }
  }

  @Get('inscription/:hash')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionResponseDto, description: 'Inscription' })
  async getInscription(@Param('hash') hash: string) {
    const inscription = await this.inscriptionService.detail({ hash })
    if (!inscription)
      throw new NotFoundException('Inscription not found')
    const tick = await this.tickService.detail({ tick: inscription?.tick })
    if (!tick)
      throw new NotFoundException(`Not relevant information found Tick [${inscription.tick}]`)

    const holders = await this.holderService.count({
      where: { tick: inscription.tick },
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

  @Get('inscription/some/:hash')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: SomeResponseDto, description: 'InscriptionSome' })
  async getInscriptionSome(@Param('hash') hash: string) {
    return {
      data: await this.inscriptionService.some(hash),
    }
  }

  @Get('hexagon')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'tick', type: 'string' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiResponse({ status: 200, type: HexagonPageResponseDto, description: 'Hexagons' })
  async getHexagons(
    @Query('tick') tick?: string, @Query('page') page = 1, @Query('limit') limit = 15) {
    const total = await this.hexagonService.count({
      where: { tik: tick },
    })
    const data = await this.hexagonService.lists({
      orderBy: { mit: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
      where: { tik: tick },
    })
    return { data, total }
  }

  @Get('holder')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'owner', type: 'string', required: false })
  @ApiQuery({ name: 'tick', type: 'string', required: false })
  @ApiQuery({ name: 'order', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: HolderPageResponseDto, description: 'holders' })
  async getHolders(
    @Query('tick') tick?: string, @Query('owner') owner?: string, @Query('order') order?: string, @Query('page') page = 1, @Query('limit') limit = 15) {
    const orderBy: Prisma.HolderOrderByWithRelationInput = {}

    const where: Prisma.HolderWhereInput = {}
    if (tick)
      where.tick = tick
    if (owner)
      where.owner = owner
    order && (orderBy[order] = 'desc')
    const total = await this.holderService.count({ where })
    const data = await this.holderService.lists({
      skip: (page - 1) * limit,
      take: +limit,
      where,
      orderBy,
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
    const where: Prisma.TickWhereInput = { tick: { contains: keyword } }
    if (+type === 2)
      where.completedTime = null
    if (+type === 3)
      where.completedTime = { not: null }
    const total = await this.tickService.count({ where })
    const data = await this.tickService.lists({
      orderBy: { holders: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
      where,
    })
    return { total, data }
  }

  @Get('token/some/:id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: SomeResponseDto, description: 'InscriptionSome' })
  async getTickSome(@Param('id') id: string) {
    return {
      data: await this.tickService.some(id),
    }
  }

  @Get('token/:id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TickDto, description: 'Ticks' })
  async getTick(@Param('id') id: string) {
    const data = await this.tickService.detail({ tick: id })
    if (!data)
      throw new NotFoundException(`Not found Tick [${id}]`)
    return data
  }

  @Get('market')
  async getMarkets(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    return this.tickService.detailByMarket(page, limit)
  }
}
