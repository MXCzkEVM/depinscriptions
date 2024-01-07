import { Module } from '@nestjs/common'
import { TokenService } from '../token'
import { HolderService } from '../holder'
import { PrismaService } from '../common'
import { InscriptionService } from './inscription.service'
import { InscriptionController } from './inscription.controller'

@Module({
  controllers: [InscriptionController],
  providers: [
    PrismaService,
    InscriptionService,
    TokenService,
    HolderService,
  ],
})
export class InscriptionModule {}
