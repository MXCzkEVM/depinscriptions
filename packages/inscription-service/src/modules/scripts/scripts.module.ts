import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ProviderService } from '../provider'
import { TokenService } from '../token'
import { HexagonService } from '../hexagon'
import { OrderService } from '../order'
import { InscriptionService } from '../inscription'
import { PrismaService } from '../common'
import { HolderService } from '../holder'
import { ScriptsService } from './scripts.service'

@Module({
  providers: [
    HolderService,
    PrismaService,
    TokenService,
    HexagonService,
    OrderService,
    InscriptionService,
    ProviderService,
    ConfigService,
    ScriptsService,
    ProviderService,
  ],
})
export class ScriptsModule {}
