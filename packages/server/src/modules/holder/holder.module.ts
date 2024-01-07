import { Module } from '@nestjs/common'
import { TokenService } from '../token'
import { PrismaService } from '../common'
import { HolderService } from './holder.service'
import { HolderController } from './holder.controller'

@Module({
  controllers: [HolderController],
  providers: [
    PrismaService,
    HolderService,
    TokenService,
  ],
})
export class HolderModule {}
