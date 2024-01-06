import { Injectable, Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { Interval, ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import {
  CommonModule,
  HexagonModule,
  InscriptionModule,
  MarketModule,
  OrderModule,
  RecoveryModule,
  TasksModule,
  TokenModule,
} from './modules'

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({ isGlobal: true }),
    CommonModule,
    HexagonModule,
    InscriptionModule,
    MarketModule,
    OrderModule,
    RecoveryModule,
    TokenModule,
    TasksModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
