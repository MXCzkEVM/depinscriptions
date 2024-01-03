import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { MarketRawDto } from 'src/dtos/query-raw'
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

  async delete(where: Prisma.TickWhereInput) {
    return this.prisma.tick.deleteMany({ where })
  }

  async some(tick: string) {
    const count = await this.prisma.tick.count({ where: { tick } })
    return count !== 0
  }

  async incrementMinted(tick: string, data: { value: bigint }) {
    return this.prisma.tick.update({
      where: { tick },
      data: { minted: { increment: data.value } },
    })
  }

  async count(params?: Prisma.TickCountArgs) {
    return this.prisma.tick.count(params)
  }

  async detailByMarkets(page: number, limit: number) {
    // 当前的 order 所计算出来的 1个 tick 等于多少美元，然后把上架和购买的数量
    // 上架和购买的 price 相加
    return this.prisma.$queryRaw<MarketRawDto[]>`
      SELECT
          T.tick as tick,
          COALESCE(MIN(O.price), 0) as price,
          SUM(CASE WHEN O.time >= DATE_SUB(NOW(), INTERVAL 24 HOUR) THEN O.price ELSE 0 END) as volume,
          COUNT(CASE WHEN O.time >= DATE_SUB(NOW(), INTERVAL 24 HOUR) AND O.status=1 THEN O.number ELSE NULL END) as sales,
          COUNT(distinct H.owner) as holders,
          SUM(CASE WHEN O.status=1 THEN O.price ELSE 0 END) as totalVolume,
          COUNT(CASE WHEN O.status=1 THEN O.number ELSE NULL END) as totalSales,
          SUM(CASE WHEN O.status=1 AND O.status=0 THEN O.price ELSE 0 END) as marketCap
      FROM
          Tick as T
      LEFT JOIN Holder as H ON T.tick = H.tick
      LEFT JOIN \`Order\` as O ON T.tick = O.tick
      GROUP BY
          T.tick
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `
  }
}
