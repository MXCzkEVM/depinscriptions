import type { Prisma } from '@prisma/client'
import type { PrismaService } from './prisma.service'

export class TickService {
  constructor(private prisma: PrismaService) {}

  async tick(where: Prisma.TickWhereUniqueInput) {
    return this.prisma.tick.findUnique({ where })
  }

  async ticks(params: Prisma.TickFindManyArgs) {
    return this.prisma.tick.findMany(params)
  }

  async createTick(data: Prisma.TickCreateInput) {
    return this.prisma.tick.create({ data })
  }

  async updateTick(tick: string, data: Prisma.TickUpdateInput) {
    return this.prisma.tick.update({
      where: { tick },
      data,
    })
  }
}
