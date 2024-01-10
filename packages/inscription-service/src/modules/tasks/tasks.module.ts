import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { ScriptsModule, ScriptsService } from '../scripts'
import { ProviderService } from '../provider'
import { InscriptionModule, InscriptionService } from '../inscription'
import { HolderService } from '../holder'
import { TokenService } from '../token'
import { HexagonService } from '../hexagon'
import { OrderService } from '../order'
import { PrismaService } from '../common'
import { TasksService } from './tasks.service'

@Module({
  providers: [
    PrismaService,
    ScriptsService,
    HolderService,
    TokenService,
    HexagonService,
    OrderService,
    InscriptionService,
    ConfigService,
    ProviderService,
    TasksService,
  ],
})
export class TasksModule {}
