import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';

export class HolderService {
  constructor(private prisma: PrismaService) {}

  async holder(where: Prisma.HolderWhereUniqueInput) {
    this.prisma.holder.findUnique({ where });
  }

  async holders(params: Prisma.HolderFindManyArgs) {
    return this.prisma.holder.findMany(params);
  }

  async createHolder(data: Prisma.HolderCreateInput) {
    return this.prisma.holder.create({ data });
  }

  async someHolder(params: { tick: string; owner: string }) {
    this.prisma.holder.count({
      where: { ...params },
    });
  }
}
