import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiConsumes, ApiQuery, ApiResponse } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { ExistResponse } from '../common'
import { TokenService } from './token.service'
import { TickDeployedResponse, TickPageResponse } from './dtos'
import { Tick } from './entities'

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'keyword', type: 'string' })
  @ApiQuery({ name: 'type', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TickPageResponse, description: 'Ticks' })
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
    const total = await this.tokenService.count({ where })
    const data = await this.tokenService.lists({
      orderBy: { holders: 'desc' },
      skip: (page - 1) * limit,
      take: +limit,
      where,
    })
    return { total, data }
  }

  @Get('deployed')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TickDeployedResponse, description: 'Ticks' })
  async getTicksByDeployed() {
    const data = await this.tokenService.lists({
      select: { tick: true },
    })
    return {
      data: data.map(v => v.tick),
    }
  }

  @Get('some/:id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: ExistResponse, description: 'InscriptionSome' })
  async getTickBySome(@Param('id') id: string) {
    return {
      data: await this.tokenService.some(id),
    }
  }

  @Get(':id')
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: Tick, description: 'Ticks' })
  async getTick(@Param('id') id: string) {
    const data = await this.tokenService.detail({ tick: id })
    if (!data)
      throw new NotFoundException(`Not found Tick [${id}]`)
    return data
  }
}
