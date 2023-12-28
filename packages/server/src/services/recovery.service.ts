import { Injectable } from '@nestjs/common'
import { HexagonService } from './hexagon.service'
import { HolderService } from './holder.service'
import { InscriptionService } from './inscription.service'
import { TickService } from './tick.service'

@Injectable()
export class RecoveryService {
  constructor(
    private holderService: HolderService,
    private inscriptionService: InscriptionService,
    private tickService: TickService,
    private hexagonService: HexagonService,
  ) {}

  private retryPasswords = 0

  async tick(password: string, tick: string) {
    if (this.retryPasswords >= 5)
      throw new Error('Exceeded retry attempts')
    if (password !== process.env.NEST_RECOVERY_PASSWORD) {
      this.retryPasswords++
      throw new Error('password is incorrect')
    }
    await this.holderService.delete({ tick })
    await this.inscriptionService.delete({ tick })
    await this.tickService.delete({ tick })
    await this.hexagonService.delete({ tik: tick })
  }
}
