import { Injectable } from '@nestjs/common'
import { Order, Prisma } from '@prisma/client'
import { omit } from 'lodash'
import { PrismaService } from '../common'

export interface OrderByFloorPriceParams {
  tick: string
  page: number
  limit: number
}

export interface OrderByBelowLimitPriceParams {
  tick: string
  price: string
}

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async create(data: Prisma.OrderCreateInput) {
    return this.record(await this.prisma.order.create({ data }))
  }

  async lists(params: Prisma.OrderFindManyArgs) {
    return this.prisma.order.findMany(params)
  }

  async listsByRecord(params: Prisma.OrderRecordFindManyArgs) {
    return this.prisma.orderRecord.findMany(params)
  }

  async listsOrderByFloorPrice(params: OrderByFloorPriceParams) {
    return this.prisma.$queryRaw<Order[]>`
      SELECT * FROM  \`Order\`
      WHERE tick = ${params.tick} AND status = 0
      ORDER BY (price - amount) DESC
      LIMIT ${params.limit} OFFSET ${(params.page - 1) * params.limit};
    `
  }

  async listOrderByBelowLimitPrice(params: OrderByBelowLimitPriceParams) {
    const token = await this.prisma.tick.findUnique({ where: { tick: params.tick } })
    const cond = `((price / amount) * ${token.limit}) < ${params.price}`
    return this.prisma.$queryRaw<Order[]>`
      SELECT * FROM  \`Order\`
      WHERE tick = ${params.tick} AND status = 0 AND ${cond};
    `
  }

  async update(hash: string, data: Partial<Order>) {
    const order = await this.prisma.order.update({ where: { hash }, data })
    return this.record({ ...order, ...data })
  }

  async detail(where: Prisma.OrderWhereUniqueInput) {
    return this.prisma.order.findUnique({ where })
  }

  async count(params: Prisma.OrderCountArgs) {
    return this.prisma.order.count(params)
  }

  async countByRecord(params: Prisma.OrderRecordCountArgs) {
    return this.prisma.orderRecord.count(params)
  }

  async some(hash: string) {
    const count = await this.count({ where: { hash } })
    return count !== 0
  }

  async record(data: Order) {
    await this.prisma.orderRecord.create({
      data: omit(data, ['lastTime', 'time', 'json']),
    })
    return data
  }

  async price() {
    const { _sum } = await this.prisma.order.aggregate({
      where: { status: { in: [0, 1] } },
      _sum: { price: true },
    })
    return _sum.price || '0'
  }
}
