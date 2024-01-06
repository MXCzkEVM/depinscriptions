import { Controller, Get, Query } from '@nestjs/common'
import { ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { HolderService } from './holder.service'
import { HolderPageResponseDto } from './dtos'

@Controller('holder')
export class HolderController {
  constructor(private readonly holderService: HolderService) {}

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'owner', type: 'string', required: false })
  @ApiQuery({ name: 'tick', type: 'string', required: false })
  @ApiQuery({ name: 'order', type: 'string', required: false })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: HolderPageResponseDto, description: 'holders' })
  async getHolders(@Query('tick') tick?: string, @Query('owner') owner?: string, @Query('order') order?: string, @Query('page') page = 1, @Query('limit') limit = 15) {
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
}
