import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common'
import { ApiConsumes, ApiExtraModels, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger'
import { Prisma } from '@prisma/client'
import { TokenService } from '../token'
import { HolderService } from '../holder'
import { ExistResponse } from '../common'
import { InscriptionService } from './inscription.service'
import { InscriptionPageResponse, InscriptionResponse } from './dtos'
import { Inscription } from './entities'

@ApiTags('inscription')
@Controller('inscription')
@ApiExtraModels(Inscription)
export class InscriptionController {
  constructor(
    private readonly inscriptionService: InscriptionService,
    private readonly tokenService: TokenService,
    private readonly holderService: HolderService,
  ) {}

  @Get('inscription')
  @ApiQuery({ name: 'page', type: 'number' })
  @ApiQuery({ name: 'limit', type: 'number', required: false })
  @ApiQuery({ name: 'owner', type: 'string', required: false })
  @ApiQuery({ name: 'op', type: 'string', isArray: true, required: false })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, type: InscriptionPageResponse, description: 'Inscriptions' })
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
  @ApiResponse({ status: 200, type: InscriptionResponse, description: 'Inscription' })
  async getInscription(@Param('hash') hash: string) {
    const inscription = await this.inscriptionService.detail({ hash })
    if (!inscription)
      throw new NotFoundException('Inscription not found')
    const tick = await this.tokenService.detail({ tick: inscription?.tick })
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
  @ApiResponse({ status: 200, type: ExistResponse, description: 'InscriptionSome' })
  async getInscriptionSome(@Param('hash') hash: string) {
    return {
      data: await this.inscriptionService.some(hash),
    }
  }
}
