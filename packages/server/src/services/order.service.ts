import { Injectable } from '@nestjs/common'
import { Prisma } from '@prisma/client'
import { PrismaService } from './prisma.service'

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.OrderCreateInput) {
    return this.prisma.order.create({ data })
  }

  async lists(params: Prisma.OrderFindManyArgs) {
    return this.prisma.order.findMany(params)
  }

  async update(hash: string, data: Prisma.OrderUpdateInput) {
    return this.prisma.order.update({
      where: { hash },
      data,
    })
  }

  async detail(where: Prisma.OrderWhereUniqueInput) {
    return this.prisma.order.findUnique({ where })
  }

  async count(params: Prisma.OrderCountArgs) {
    return this.prisma.order.count(params)
  }

  async some(hash: string) {
    const count = await this.count({ where: { hash } })
    return count !== 0
  }

  async price() {
    const { _sum } = await this.prisma.order.aggregate({
      where: { status: { in: [0, 1] } },
      _sum: { price: true },
    })
    return _sum.price
  }
}
