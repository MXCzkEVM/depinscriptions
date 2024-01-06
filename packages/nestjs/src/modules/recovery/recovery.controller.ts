import { Body, Controller, Post } from '@nestjs/common'
import { ApiBody, ApiConsumes, ApiResponse } from '@nestjs/swagger'
import { RecoveryService } from './recovery.service'
import { RecoveryBody } from './dto'

@Controller('recovery')
export class RecoveryController {
  constructor(private readonly recoveryService: RecoveryService) {}

  @Post('tick')
  @ApiBody({ type: RecoveryBody, required: true })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'RecoveryTicks' })
  async recoveryTick(@Body() body: { password: string, value: string }) {
    try {
      await this.recoveryService.tick(body.password, body.value)
      return { status: true, message: 'success' }
    }
    catch (error: any) {
      return { status: false, message: error.message }
    }
  }

  @Post('inscription')
  @ApiBody({ type: RecoveryBody, required: true })
  @ApiConsumes('application/json')
  @ApiResponse({ status: 200, description: 'RecoveryInscription' })
  async recoveryInscription(@Body() body: { password: string, value: string }) {
    try {
      await this.recoveryService.inscription(body.password, body.value)
      return { status: true, message: 'success' }
    }
    catch (error: any) {
      return { status: false, message: error.message }
    }
  }
}
