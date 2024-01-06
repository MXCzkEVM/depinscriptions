import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiConsumes, ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { OrderService } from './order.service'
import { OrderPageResponse } from './dtos'
import { Order } from './entities'

@ApiTags('order')
@Controller('order')
@ApiExtraModels(Order)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get()
  @ApiConsumes('application/json')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'status', type: 'string', isArray: true, required: false })
  @ApiQuery({ name: 'tick', required: false })
  @ApiQuery({ name: 'owner', required: false })
  @ApiResponse({ status: 200, type: OrderPageResponse, description: 'Market' })
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
      orderBy: { lastTime: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
      where,
    })

    return {
      data,
      total,
    }
  }

  @Get('record')
  @ApiConsumes('application/json')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'status', type: 'string', isArray: true, required: false })
  @ApiQuery({ name: 'tick', required: false })
  @ApiResponse({ status: 200, type: OrderPageResponse, description: 'Market' })
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
      orderBy: { time: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
    })
    return {
      data,
      total,
    }
  }

  @Get('listed')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'tick', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: OrderPageResponse, description: 'Market' })
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

  @Get('below')
  @ApiQuery({ name: 'tick', required: false })
  @ApiQuery({ name: 'price' })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: OrderPageResponse, description: 'Market' })
  async getOrdersByLessThan(@Query('tick') tick: string, @Query('price') price: string) {
    return this.orderService.listOrderByBelowLimitPrice({ tick, price })
  }
}
