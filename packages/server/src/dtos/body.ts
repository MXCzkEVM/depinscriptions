import { ApiProperty } from '@nestjs/swagger'

export class RecoveryBodyDto {
  @ApiProperty()
  password: string

  @ApiProperty()
  tick: string
}
