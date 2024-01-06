import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ScheduleModule } from '@nestjs/schedule'
import { AppController } from './app.controller'
import {
  CommonModule,
  HexagonModule,
  HolderModule,
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
    HolderModule,
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
