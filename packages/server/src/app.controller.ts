import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { ApiBody, ApiConsumes, ApiExtraModels, ApiQuery, ApiResponse, ApiTags, getSchemaPath } from '@nestjs/swagger'
import {
  HexagonDto,
  HexagonPageResponseDto,
  HolderDto,
  HolderPageResponseDto,
  InscriptionDto,
  InscriptionPageResponseDto,
  InscriptionResponseDto,
  MarketPageResponseDto,
  OrderDto,
  OrderPageResponseDto,
  RecoveryBodyDto,
  SomeResponseDto,
  TickDeployedResponseDto,
  TickDto,
  TickPageResponseDto,
} from './dtos'

import { InscriptionService } from './services/inscription.service'
import { HolderService } from './services/holder.service'
import { TickService } from './services/tick.service'
import { HexagonService } from './services/hexagon.service'
import { RecoveryService } from './services/recovery.service'
import { MarketDetailDto, MarketRawDto } from './dtos/query-raw'
import { OrderService } from './services/order.service'

@Controller()
@ApiTags('app-controller')
@ApiExtraModels(TickDto)
@ApiExtraModels(HolderDto)
@ApiExtraModels(InscriptionDto)
@ApiExtraModels(HexagonDto)
@ApiExtraModels(RecoveryBodyDto)
@ApiExtraModels(MarketRawDto)
@ApiExtraModels(OrderDto)
export class AppController {
  constructor(
    private readonly inscriptionService: InscriptionService,
    private readonly holderService: HolderService,
    private readonly tickService: TickService,
    private readonly hexagonService: HexagonService,
    private readonly recoveryService: RecoveryService,
    private readonly orderService: OrderService,
  ) { }

  @Get('inscription')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'owner', type: 'string', required: false })
  @ApiQuery({ name: 'op', type: 'string', isArray: true, required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionPageResponseDto, description: 'Inscriptions' })
  async getInscriptions(
    @Query('owner') owner?: string, @Query('owner') op?: string, @Query('page') page = 1, @Query('limit') limit = 15) {
    const where: Prisma.InscriptionWhereInput = {
      op: { in: (op || 'mint,deploy').split(',') },
    }
    if (owner)
      where.from = owner
    const total = await this.inscriptionService.count({
      where,
    })
    const data = await this.inscriptionService.lists({
      orderBy: { number: 'desc' },
      where,
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

  @Get('token/deployed')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TickDeployedResponseDto, description: 'Ticks' })
  async getTicksByDeployed() {
    const data = await this.tickService.lists({
      select: { tick: true },
    })
    return {
      data: data.map(v => v.tick),
    }
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
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: MarketPageResponseDto, description: 'Markets' })
  async getMarkets(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const total = await this.tickService.count()
    const data = await this.tickService.detailByMarkets(page, limit)
    const price = await this.orderService.price()
    return { total, data, price }
  }

  @Get('market/:id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: MarketDetailDto, description: 'Market' })
  async getMarket(
    @Param('id') id: string,
  ) {
    const data = this.tickService.detailByMarket(id)
    if (!data)
      throw new NotFoundException(`Not found Tick [${id}]`)
    return data
  }

  @Get('order')
  @ApiConsumes('application/json')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'status', type: 'string', isArray: true, required: false })
  @ApiQuery({ name: 'tick', required: false })
  @ApiQuery({ name: 'owner', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: OrderPageResponseDto, description: 'Market' })
  async getOrders(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('status') status?: string,
    @Query('tick') tick?: string,
    @Query('owner') owner?: string,
  ) {
    const where: Prisma.OrderWhereInput = {
      status: { in: (status || '0,1,2,3').split(',').map(Number) },
    }
    if (owner)
      where.OR = [{ maker: owner }, { buyer: owner }]
    if (tick)
      where.tick = tick

    const total = await this.orderService.count({ where })
    const data = await this.orderService.lists({
      where,
      orderBy: { lastTime: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
    })

    return {
      data,
      total,
    }
  }

  @Get('order/record')
  @ApiConsumes('application/json')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'status', type: 'string', isArray: true, required: false })
  @ApiQuery({ name: 'tick', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: OrderPageResponseDto, description: 'Market' })
  async getOrdersByRecord(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
    @Query('status') status?: string,
    @Query('tick') tick?: string,
  ) {
    const where: Prisma.OrderRecordWhereInput = {
      status: { in: (status || '0,1,2,3').split(',').map(Number) },
      tick,
    }
    const total = await this.orderService.countByRecord({ where })
    const data = await this.orderService.listsByRecord({
      where,
      orderBy: { lastTime: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
    })
    return {
      data,
      total,
    }
  }

  @Get('order/listed')
  @ApiConsumes('application/json')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'tick', required: false })
  @ApiResponse({ status: 200, type: OrderPageResponseDto, description: 'Market' })
  async getOrdersByFloorPrice(
    @Query('tick') tick: string, @Query('page') page = 1, @Query('limit') limit = 15) {
    const total = await this.orderService.count({ where: { status: 0, tick } })
    const data = await this.orderService.listsOrderByFloorPrice({
      limit,
      page,
      tick,
    })
    return {
      data,
      total,
    }
  }

  @Post('recovery/tick')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'RecoveryTicks' })
  @ApiBody({ type: RecoveryBodyDto, required: true })
  async recoveryTick(@Body() body: { password: string, value: string }) {
    try {
      await this.recoveryService.tick(body.password, body.value)
      return { status: true, message: 'success' }
    }
    catch (error: any) {
      return { status: false, message: error.message }
    }
  }

  @Post('recovery/inscription')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'RecoveryInscription' })
  @ApiBody({ type: RecoveryBodyDto, required: true })
  async recoveryInscription(@Body() body: { password: string, value: string }) {
    try {
      await this.recoveryService.inscription(body.password, body.value)
      return { status: true, message: 'success' }
    }
    catch (error: any) {
      return { status: false, message: error.message }
    }
  }
}
