import { Injectable } from '@nestjs/common'
import { HolderService } from '../holder'
import { InscriptionService } from '../inscription'
import { TokenService } from '../token'
import { HexagonService } from '../hexagon'

@Injectable()
export class RecoveryService {
  constructor(
    private tokenService: TokenService,
    private holderService: HolderService,
    private inscriptionService: InscriptionService,
    private hexagonService: HexagonService,
  ) {}

  async tick(password: string, tick: string) {
    if (password !== process.env.NEST_ADMIN_PASSWORD)
      throw new Error('password is incorrect')

    await this.tokenService.delete({ tick })
    await this.holderService.delete({ tick })
    await this.hexagonService.delete({ tik: tick })
    await this.inscriptionService.delete({ tick })
  }

  async inscription(password: string, hash: string) {
    if (password !== process.env.NEST_ADMIN_PASSWORD)
      throw new Error('password is incorrect')
    await this.inscriptionService.delete({ hash })
  }
}
