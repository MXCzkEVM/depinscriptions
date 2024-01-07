import { Body, Controller, Delete, Get, NotFoundException, Param, Patch, Post, Query } from '@nestjs/common'
import { ApiConsumes, ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { ExistResponse } from '../common'
import { TokenService } from './token.service'
import { TokenDeployedResponse, TokenPageResponse } from './dtos'
import { Token } from './entities'

@ApiTags('token')
@Controller('token')
@ApiExtraModels(Token)
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get()
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'keyword', type: 'string' })
  @ApiQuery({ name: 'type', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: TokenPageResponse, description: 'Ticks' })
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
  @ApiResponse({ status: 200, type: TokenDeployedResponse, description: 'Ticks' })
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
  @ApiResponse({ status: 200, type: Token, description: 'Ticks' })
  async getTick(@Param('id') id: string) {
    const data = await this.tokenService.detail({ tick: id })
    if (!data)
      throw new NotFoundException(`Not found Tick [${id}]`)
    return data
  }
}
