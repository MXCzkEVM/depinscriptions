import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../common'

@Injectable()
export class TokenService {
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
}
