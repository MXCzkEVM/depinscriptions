import { Module } from '@nestjs/common'
import { PrismaService } from '../common'
import { HexagonController } from './hexagon.controller'
import { HexagonService } from './hexagon.service'

@Module({
  controllers: [HexagonController],
  providers: [
    PrismaService,
    HexagonService,
    PrismaService,
  ],
})
export class HexagonModule {}
