import { Body, Controller, Get, Post } from '@nestjs/common'
import { Inscription, Prisma } from '@prisma/client'
import { InscriptionService } from './services/inscription.service'
import { HolderService } from './services/holder.service'
import { TickService } from './services/tick.service'

@Controller()
export class AppController {
  constructor(
    private readonly inscriptionService: InscriptionService,
    private readonly holderService: HolderService,
    private readonly tickService: TickService,
  ) {}

  @Get('inscription')
  async selectInscriptions(): Promise<Inscription[]> {
    return this.inscriptionService.inscriptions({
      orderBy: { number: 'asc' },
    })
  }

  @Post('inscription')
  async createInscription(
    @Body() data: Omit<Prisma.InscriptionCreateInput, 'time'>,
  ) {
    const inscription = JSON.parse(data.json)
    if (inscription.op === 'deploy') {
      await this.tickService.createTick({
        creator: data.from,
        deployHash: data.hash,
        deployTime: new Date(),
        limit: inscription.lim,
        tick: data.tick,
      })
    }
    if (inscription.op === 'mint') {
      // this.holderService.
    }
    if (inscription.op === 'transfer') {
      // TODO
    }
  }
}
