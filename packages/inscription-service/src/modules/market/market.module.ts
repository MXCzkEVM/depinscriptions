import { Module } from '@nestjs/common'
import { TokenService } from '../token'
import { OrderService } from '../order'
import { PrismaService } from '../common'
import { MarketService } from './market.service'
import { MarketController } from './market.controller'

@Module({
  controllers: [MarketController],
  providers: [
    PrismaService,
    MarketService,
    TokenService,
    OrderService,
  ],
})
export class MarketModule {}
