import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TickService } from './tick.service'

export interface QueryHexagonParams {
  tik: string
  hex: string
}

@Injectable()
export class HexagonService {
  constructor(private prisma: PrismaService) { }

  async hexagonCount(params: Prisma.HexagonCountArgs) {
    return this.prisma.hexagon.count(params)
  }
  
  async hexagons(params: Prisma.HexagonFindManyArgs) {
    return this.prisma.hexagon.findMany(params)
  }

  async incrementHexagonValue(params: QueryHexagonParams, data: { value: number }) {
    const count = await this.prisma.hexagon.count({ where: params })
    if (count === 0) {
      await this.prisma.hexagon.create({
        data: { ...params, mit: data.value }
      })
    }
    else {
      await this.prisma.hexagon.updateMany({
        where: { hex: params.hex, tik: params.tik },
        data: { mit: { increment: data.value } }
      })
    }
  }
}
