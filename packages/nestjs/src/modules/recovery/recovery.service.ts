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

  private retryPasswords = 0

  async tick(password: string, tick: string) {
    if (this.retryPasswords >= 5)
      throw new Error('Exceeded retry attempts')
    if (password !== process.env.NEST_RECOVERY_PASSWORD) {
      this.retryPasswords++
      throw new Error('password is incorrect')
    }
    await this.tokenService.delete({ tick })
    await this.holderService.delete({ tick })
    await this.hexagonService.delete({ tik: tick })
    await this.inscriptionService.delete({ tick })
  }

  async inscription(password: string, hash: string) {
    if (this.retryPasswords >= 5)
      throw new Error('Exceeded retry attempts')
    if (password !== process.env.NEST_RECOVERY_PASSWORD) {
      this.retryPasswords++
      throw new Error('password is incorrect')
    }
    await this.inscriptionService.delete({ hash })
  }
}
