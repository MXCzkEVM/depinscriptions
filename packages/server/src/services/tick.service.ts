import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class TickService {
  constructor(private prisma: PrismaService) { }

  async detail(where: Prisma.TickWhereUniqueInput) {
    return this.prisma.tick.findUnique({ where })
  }

  async lists(params: Prisma.TickFindManyArgs) {
    return this.prisma.tick.findMany(params)
  }

  async create(data: Prisma.TickCreateInput) {
    return this.prisma.tick.create({ data })
  }

  async update(tick: string, data: Prisma.TickUpdateInput) {
    return this.prisma.tick.update({
      where: { tick },
      data,
    })
  }

  async some(tick: string) {
    const count = await this.prisma.tick.count({ where: { tick } })
    return count !== 0
  }

  async incrementMinted(tick: string, data: { value: number }) {
    return this.prisma.tick.update({
      where: { tick },
      data: { minted: { increment: data.value } },
    })
  }

  async count(params?: Prisma.TickCountArgs) {
    return this.prisma.tick.count(params)
  }

  async detailByMarket(page: number, limit: number) {
    const result = await this.prisma.$queryRaw<{ a }>`
      SELECT
          Tick.tick,
          MIN(Order.price) as floorPrice,
          SUM(CASE WHEN Order.createdAt > CURRENT_TIMESTAMP - INTERVAL '24 HOURS' THEN Order.amount ELSE 0 END) as "volume",
          COUNT(CASE WHEN Order.createdAt > CURRENT_TIMESTAMP - INTERVAL '24 HOURS' THEN Order.id ELSE NULL END) as "sales",
          COUNT(distinct Holder.owner) as owners,
          SUM(Order.amount) as totalVolume,
          COUNT(Order.id) as totalSales,
          (COUNT(Order.id) - COUNT(CASE WHEN Order.status = 1 THEN Order.id ELSE NULL END)) as Listed
      FROM 
          Tick
      LEFT JOIN Holder ON Tick.tick = Holder.tick
      LEFT JOIN Order  ON Tick.tick = Order.tick
      GROUP BY 
          Tick.tick
      ORDER BY "volume" DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `

    return result
  }
}
