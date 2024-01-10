import { Injectable, NotFoundException } from '@nestjs/common'
import BigNumber from 'bignumber.js'
import { PrismaService } from '../common'
import { TokenService } from '../token'
import { Order } from '../order'
import { MarketRaw } from './entities'

@Injectable()
export class MarketService {
  constructor(
    private prisma: PrismaService,
    private token: TokenService,
  ) { }

  async detailByMarkets(page: number, limit: number) {
    return await this.prisma.$queryRaw<MarketRaw[]>`
      SELECT
        T.tick as tick,
        T.limit as \`limit\`,
        COALESCE(list.price, 0) as price,
        COALESCE(sold24h.volume, 0) as volume,
        COALESCE(sold24h.sales, 0) as sales,
        COALESCE(sold.volume, 0) as totalVolume,
        COALESCE(sold.sales, 0) as totalSales,
        COALESCE(listOrSold.marketCap, 0) as marketCap,
        COALESCE(list.listed, 0) as listed,
        COUNT(DISTINCT H.owner) as holders
      FROM Tick as T
      
      LEFT JOIN Holder as H ON T.tick = H.tick
      LEFT JOIN
        (SELECT tick, MIN(price) as price, COUNT(*) AS listed FROM \`Order\` WHERE status = 0 GROUP BY tick) AS list ON T.tick = list.tick
      LEFT JOIN
        (SELECT tick,  SUM(price) AS marketCap  FROM \`Order\` WHERE status = 0 OR status = 1 GROUP BY tick) AS listOrSold ON T.tick = listOrSold.tick
      LEFT JOIN
        (SELECT tick, SUM(price) AS volume, COUNT(*) as sales  FROM \`Order\` WHERE time >= DATE_SUB(NOW(), INTERVAL 24 HOUR) AND status = 1 GROUP BY tick) AS sold24h ON T.tick = sold24h.tick
      LEFT JOIN
        (SELECT tick, SUM(price) AS volume, COUNT(*) as sales FROM \`Order\`  WHERE status = 1 GROUP BY tick) AS sold ON T.tick = sold.tick
      WHERE T.market
      GROUP BY T.tick
      ORDER BY marketCap DESC
      LIMIT ${limit} OFFSET ${(page - 1) * limit};
    `
  }

  async detailByMarket(id: string) {
    const tick = await this.token.detail({ tick: id })

    if (!tick)
      throw new NotFoundException(`Not found Tick [${id}]`)
    const { _sum: { price: volume } } = await this.prisma.order.aggregate({
      where: { tick: id, status: { in: [1] } },
      _sum: { price: true },
    })
    const { _count: { hash: sales } } = await this.prisma.order.aggregate({
      where: { tick: id, status: 1 },
      _count: { hash: true },
    })

    const [order] = await this.prisma.$queryRaw<Order[]>`
      SELECT * FROM  \`Order\` 
      WHERE tick = ${id} AND status = 0
      ORDER BY
        (price / amount) ASC 
      LIMIT 1;
    `
    const price = order
      ? new BigNumber(order.price.toString()).div(order.amount.toString()).toFixed(0)
      : '0'

    const limitPrice = new BigNumber(tick.limit.toString()).multipliedBy(price.toString()).toFixed(0)

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
