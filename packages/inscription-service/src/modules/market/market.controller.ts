import { Body, Controller, Get, NotFoundException, Param, Post, Query } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { TokenService } from '../token'
import { OrderService } from '../order'
import { AuthorizationBody } from '../common'
import { MarketService } from './market.service'
import { MarketDetail, MarketRaw } from './entities'
import { MarketPageResponse } from './dtos'

@ApiTags('market')
@Controller('market')
@ApiExtraModels(MarketRaw)
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
    const total = await this.tokenService.count({ where: { market: true } })
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

  @Post('authorize')
  @ApiBody({ type: AuthorizationBody, required: true })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'RecoveryInscription' })
  async authMarket(@Body() body: AuthorizationBody) {
    if (body.password !== process.env.NEST_RECOVERY_PASSWORD)
      throw new Error('password is incorrect')
    this.tokenService.update(body.value, { market: true })
  }
}
