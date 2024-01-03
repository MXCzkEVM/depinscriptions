import { Order, Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { MarketRawDto } from 'src/dtos/query-raw'
import BigNumber from 'bignumber.js'
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
    return await this.prisma.$queryRaw<MarketRawDto[]>`
      SELECT
          T.tick as tick,
          COALESCE(MIN(O.price), 0) as price,
          COALESCE(sold24h.volume, 0) as volume,
          COALESCE(sold24h.sales, 0) as sales,
          COUNT(DISTINCT H.owner) as holders,
          COALESCE(sold.volume, 0) as totalVolume,
          COALESCE(sold.sales, 0) as totalSales,
          listOrSold.marketCap as marketCap,
          list.listed as listed
      FROM
          Tick as T
      LEFT JOIN Holder as H ON T.tick = H.tick
      LEFT JOIN \`Order\` as O ON T.tick = O.tick
      LEFT JOIN
        (
          SELECT tick, COUNT(*) AS listed
          FROM \`Order\`
          WHERE status = 0
          GROUP BY tick
        ) AS list ON T.tick = list.tick
      LEFT JOIN
        (
          SELECT tick, SUM(price) AS marketCap 
          FROM \`Order\`
          WHERE status = 0 OR status = 1
          GROUP BY tick
        ) AS listOrSold ON T.tick = listOrSold.tick
      LEFT JOIN
        (
          SELECT tick, SUM(price) AS volume, COUNT(*) as sales 
          FROM \`Order\` 
          WHERE time >= DATE_SUB(NOW(), INTERVAL 24 HOUR) AND status = 1
          GROUP BY tick
        ) AS sold24h ON T.tick = sold24h.tick
      LEFT JOIN
        (
          SELECT tick, SUM(price) AS volume, COUNT(*) as sales
          FROM \`Order\` 
          WHERE status = 1
          GROUP BY tick
        ) AS sold ON T.tick = sold.tick
      GROUP BY
          T.tick
      ORDER BY
        marketCap DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `
  }

  async detailByMarket(id: string) {
    const tick = await this.detail({ tick: id })
    const { _sum: { price: volume } } = await this.prisma.order.aggregate({
      where: { status: { in: [0, 1] } },
      _sum: {
        price: true,
      },
    })
    const { _count: { hash: sales } } = await this.prisma.order.aggregate({
      where: { status: 1 },
      _count: {
        hash: true,
      },
    })
    const [order] = await this.prisma.$queryRaw<Order[]>`
      SELECT * FROM  \`Order\` 
      WHERE tick = ${id}
      ORDER BY 
        (price - amount) DESC 
      LIMIT 1;
    `

    const price = order
      ? new BigNumber(order.price.toString()).div(order.amount.toString()).toString()
      : '0'

    const limitPrice = new BigNumber(tick.limit.toString()).multipliedBy(price.toString()).toString()

    return {
      tick: tick.tick,
      holders: BigInt(tick.holders),
      volume: volume || BigInt(0),
      sales: BigInt(sales),
      price,
      limitPrice,
      limit: tick.limit,
    }
  }
}
