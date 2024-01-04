import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class InscriptionService {
  constructor(private prisma: PrismaService) {}

  async detail(where: Prisma.InscriptionWhereUniqueInput) {
    return this.prisma.inscription.findUnique({ where })
  }

  async lists(params: Prisma.InscriptionFindManyArgs) {
    return this.prisma.inscription.findMany(params)
  }

  async count(params: Prisma.InscriptionCountArgs) {
    return this.prisma.inscription.count(params)
  }

  async delete(where: Prisma.InscriptionWhereInput) {
    return this.prisma.inscription.deleteMany({ where })
  }

  async some(hash: string) {
    const count = await this.prisma.inscription.count({ where: { hash } })
    return count !== 0
  }

  async create(data: Prisma.InscriptionCreateInput) {
    return this.prisma.inscription.create({ data })
  }
}
