import { Module } from '@nestjs/common'
import { PrismaService } from '../common'
import { OrderService } from './order.service'
import { OrderController } from './order.controller'

@Module({
  controllers: [OrderController],
  providers: [
    PrismaService,
    OrderService,
  ],
})
export class OrderModule {}
