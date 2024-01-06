import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { TokenService } from '../token'
import { OrderService } from '../order'
import { MarketService } from './market.service'
import { MarketDetail } from './entities'
import { MarketPageResponse } from './dtos'

@Controller('market')
export class MarketController {
  constructor(
    private readonly marketService: MarketService,
    private readonly tokenService: TokenService,
    private readonly orderService: OrderService,
  ) {}

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: MarketPageResponse, description: 'Markets' })
  async getMarkets(
    @Query('page') page = 1,
    @Query('limit') limit = 15,
  ) {
    const total = await this.tokenService.count()
    const data = await this.marketService.detailByMarkets(page, limit)
    const price = await this.orderService.price()
    return { total, data, price }
  }

  @Get(':id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: MarketDetail, description: 'Market' })
  async getMarket(@Param('id') id: string) {
    const data = this.marketService.detailByMarket(id)
    if (!data)
      throw new NotFoundException(`Not found Tick [${id}]`)
    return data
  }
}
