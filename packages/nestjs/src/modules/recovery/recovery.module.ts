import { Module } from '@nestjs/common'
import { HolderService } from '../holder'
import { InscriptionService } from '../inscription'
import { HexagonService } from '../hexagon'
import { PrismaService } from '../common'
import { TokenService } from '../token'
import { RecoveryController } from './recovery.controller'
import { RecoveryService } from './recovery.service'

@Module({
  controllers: [RecoveryController],
  providers: [
    PrismaService,
    TokenService,
    HolderService,
    InscriptionService,
    HexagonService,
    RecoveryService,
  ],
})
export class RecoveryModule {}
