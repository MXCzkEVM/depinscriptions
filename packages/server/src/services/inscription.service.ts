import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

@Injectable()
export class InscriptionService {
  constructor(private prisma: PrismaService) {}

  async inscription(where: Prisma.InscriptionWhereUniqueInput) {
    return this.prisma.inscription.findUnique({ where })
  }

  async inscriptions(params: Prisma.InscriptionFindManyArgs) {
    return this.prisma.inscription.findMany(params)
  }
  async inscriptionCount(params: Prisma.InscriptionCountArgs) {
    return this.prisma.inscription.count(params)
  }

  async someInscription(hash: string) {
    const count = await this.prisma.inscription.count({ where: { hash } })
    return count !== 0
  }

  async recordInscription(data: Prisma.InscriptionCreateInput) {
    return this.prisma.inscription.create({ data })
  }
}
