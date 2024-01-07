import { Module } from '@nestjs/common'
import { PrismaService } from '../common'
import { TokenService } from './token.service'
import { TokenController } from './token.controller'

@Module({
  controllers: [TokenController],
  providers: [
    PrismaService,
    TokenService,
  ],
})

export class TokenModule {}
