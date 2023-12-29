import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'

export interface QueryHexagonParams {
  tik: string
  hex: string
}

@Injectable()
export class HexagonService {
  constructor(private prisma: PrismaService) { }

  async count(params: Prisma.HexagonCountArgs) {
    return this.prisma.hexagon.count(params)
  }

  async lists(params: Prisma.HexagonFindManyArgs) {
    return this.prisma.hexagon.findMany(params)
  }

  async delete(where: Prisma.HexagonWhereInput) {
    return this.prisma.hexagon.deleteMany({ where })
  }

  async incrementValue(params: QueryHexagonParams, data: { value: bigint }) {
    const count = await this.prisma.hexagon.count({ where: params })
    if (count === 0) {
      await this.prisma.hexagon.create({
        data: { ...params, mit: data.value },
      })
    }
    else {
      await this.prisma.hexagon.updateMany({
        where: { hex: params.hex, tik: params.tik },
        data: { mit: { increment: data.value } },
      })
    }
  }
}
