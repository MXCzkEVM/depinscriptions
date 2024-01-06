import { Controller, Get, Query } from '@nestjs/common'
import { ApiQuery, ApiResponse } from '@nestjs/swagger'
import { HexagonService } from './hexagon.service'
import { HexagonPageResponse } from './dtos'

@Controller('hexagon')
export class HexagonController {
  constructor(private readonly hexagonService: HexagonService) {}

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'tick', type: 'string' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiResponse({ status: 200, type: HexagonPageResponse, description: 'Hexagons' })
  async getHexagons(@Query('tick') tick?: string, @Query('page') page = 1, @Query('limit') limit = 15) {
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
}
