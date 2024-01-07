import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'

import { LogInterceptor } from './flow'
import { LoggerService, PrismaService } from './provider'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
  ],
  providers: [
    LoggerService,
    PrismaService,
    LogInterceptor,
  ],
  exports: [
    LoggerService,
    PrismaService,
    LogInterceptor,
  ],
})

export class CommonModule {}
