import type { Prisma } from '@prisma/client'
import type { PrismaService } from './prisma.service'

export class InscriptionService {
  constructor(private prisma: PrismaService) {}

  async inscription(where: Prisma.InscriptionWhereUniqueInput) {
    this.prisma.inscription.findUnique({ where })
  }

  async inscriptions(params: Prisma.InscriptionFindManyArgs) {
    return this.prisma.inscription.findMany(params)
  }

  async recordInscription(data: Prisma.InscriptionCreateInput) {
    return this.prisma.inscription.create({ data })
  }
}
