import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data })
  }

  async price() {
    const { _sum } = await this.prisma.order.aggregate({
      _sum: { price: true },
    })
    return _sum.price
  }
}
