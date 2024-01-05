import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { PrismaService } from './services/prisma.service'
import { TasksService } from './services/tasks.service'
import { HolderService } from './services/holder.service'
import { InscriptionService } from './services/inscription.service'
import { TickService } from './services/tick.service'
import { ProviderService } from './services/provider.service'
import { HexagonService } from './services/hexagon.service'
import { ScriptsService } from './services/scripts.service'
import { RecoveryService } from './services/recovery.service'
import { OrderService } from './services/order.service'

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    PrismaService,
    TasksService,
    HolderService,
    InscriptionService,
    TickService,
    ProviderService,
    HexagonService,
    ScriptsService,
    RecoveryService,
    OrderService,
  ],
})
export class AppModule {}
