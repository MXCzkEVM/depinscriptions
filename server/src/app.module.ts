import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import { PrismaService } from './services/prisma.service'
import { TasksService } from './services/tasks.service'
import { HolderService } from './services/holder.service'
import { InscriptionService } from './services/inscription.service'
import { TickService } from './services/tick.service'
import { jsonProviderService } from './services/provider.service'

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [
    PrismaService,
    TasksService,
    HolderService,
    InscriptionService,
    TickService,
    jsonProviderService,
  ],
})
export class AppModule {}
