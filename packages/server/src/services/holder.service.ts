import { Prisma } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PrismaService } from './prisma.service'
import { TickService } from './tick.service'

export interface QueryHolderParams {
  tick: string
  owner: string
}
@Injectable()
export class HolderService {
  constructor(private prisma: PrismaService, private tickService: TickService) { }

  async detail(params: Prisma.HolderFindFirstArgs) {
    return this.prisma.holder.findFirst(params)
  }

  async lists(params: Prisma.HolderFindManyArgs) {
    return this.prisma.holder.findMany(params)
  }

  async create(data: Prisma.HolderCreateInput) {
    return this.prisma.holder.create({ data })
  }

  async some(params: QueryHolderParams) {
    const count = await this.prisma.holder.count({
      where: params,
    })
    return count !== 0
  }

  async count(params: Prisma.HolderCountArgs) {
    return this.prisma.holder.count(params)
  }

  async update(where: QueryHolderParams, data: Prisma.HolderUpdateInput) {
    return this.prisma.holder.updateMany({
      where,
      data,
    })
  }

  async incrementValue(params: QueryHolderParams, data: { value: number, number: number }) {
    const isExist = await this.some(params)
    if (!isExist) {
      await this.create({
        owner: params.owner,
        tick: params.tick,
        number: data.number,
        value: +data.value,
      })
      await this.tickService.update(params.tick, {
        holders: { increment: 1 },
      })
    }
    else {
      await this.update(
        { owner: params.owner, tick: params.tick },
        { value: { increment: data.value } },
      )
    }
  }

  async decrementValue(params: QueryHolderParams, data: { value: number }) {
    const holder = await this.detail({ where: params })
    if (!holder)
      throw new Error(`Holder Error: ${params.owner.slice(0, 12)} does not hold ${params.tick}`)

    if (data.value > holder.value)
      throw new Error(`Holder Error: Deducting ${params.tick} greater than holder balance`)

    if (data.value - holder.value === 0) {
      await this.prisma.holder.delete({ where: { id: holder.id } })
    }
    else {
      this.update(
        { owner: params.owner, tick: params.tick },
        { value: { decrement: data.value } },
      )
    }
  }
}
